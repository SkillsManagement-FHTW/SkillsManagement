import User from '../../models/user.model.js';
import roleEnum from '../../models/enums/role.enum.js';
import employmentTypeEnum from '../../models/enums/employment.type.enum.js';
import { generateToken } from '../../services/jwt.service.js';

let userCounter = 0;

export const createTestUser = ({ role = roleEnum.LECTURER, isActive = true, ...overrides } = {}) => {
    userCounter++;
    return User.create({
        username: `user${userCounter}`,
        password: 'hashed-password',
        role,
        firstName: 'Test',
        lastName: `User${userCounter}`,
        email: `user${userCounter}@test.at`,
        employmentType: employmentTypeEnum.INTERNAL,
        mustChangePassword: false,
        isActive,
        ...overrides
    });
};

export const authHeaderFor = (user) => `Bearer ${generateToken(user)}`;
