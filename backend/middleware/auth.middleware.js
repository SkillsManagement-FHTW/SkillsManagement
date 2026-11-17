import {verifyToken} from '../services/jwt.service.js';
import {getUserStatus} from '../services/user.service.js';
import roleEnum from '../models/enums/role.enum.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        req.user = await verifyToken(token);
    } catch (error) {
        if (error.message === 'Token is blacklisted') {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // A token stays valid after deactivation or deletion, so the account state is checked on every request
    try {
        const isActive = await getUserStatus(req.user.id);
        if (!isActive) {
            return res.status(403).json({ message: 'Account is not active' });
        }
    } catch (error) {
        if (error.status === 404) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        return next(error);
    }

    next();
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role.toLowerCase();

        const hasPermission = roles.some(role => role.toLowerCase() === userRole);

        if (!hasPermission) {
            return res.status(403).json({
                message: 'Access denied: insufficient permissions'
            });
        }
        next();
    };
};

/**
 * Registrations flagged as admin creation may set the role of the new user,
 * so they must come from an authenticated admin or competence leader.
 */
export const authorizeAdminCreation = (req, res, next) => {
    if (req.headers['x-admin-creation'] !== 'true') {
        return next();
    }

    const authorizeAdminOrCompetenceLeader = authorizeRole([roleEnum.ADMIN, roleEnum.COMPETENCE_LEADER]);
    authenticateToken(req, res, () => authorizeAdminOrCompetenceLeader(req, res, next));
};
