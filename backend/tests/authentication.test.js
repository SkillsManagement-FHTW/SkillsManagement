import { describe, it, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../app.js';
import User from '../models/user.model.js';
import { hashPassword } from '../services/auth.service.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from './helpers/test-database.js';
import { createTestUser, authHeaderFor } from './helpers/test-users.js';

const PROTECTED_ROUTE = '/api/v1/users';

describe('Authentication', () => {
    before(connectTestDatabase);
    afterEach(clearTestDatabase);
    after(disconnectTestDatabase);

    describe('not logged in', () => {
        it('rejects requests without a token', async () => {
            const res = await request(app).get(PROTECTED_ROUTE);

            assert.equal(res.status, 401);
        });

        it('rejects requests with an invalid token', async () => {
            const res = await request(app)
                .get(PROTECTED_ROUTE)
                .set('Authorization', 'Bearer not-a-valid-token');

            assert.equal(res.status, 403);
        });

        it('rejects a token after logout', async () => {
            const user = await createTestUser();
            const authHeader = authHeaderFor(user);

            await request(app).post('/api/v1/auth/logout').set('Authorization', authHeader).expect(200);
            const res = await request(app).get(PROTECTED_ROUTE).set('Authorization', authHeader);

            assert.equal(res.status, 401);
        });
    });

    describe('inactive users', () => {
        it('cannot log in', async () => {
            const password = 'Secret123!';
            await createTestUser({ isActive: false, username: 'inactive', password: await hashPassword(password) });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ identifier: 'inactive', password });

            assert.equal(res.status, 403);
            assert.equal(res.body.token, undefined);
        });

        it('lose access with a token issued before deactivation', async () => {
            const user = await createTestUser();
            const authHeader = authHeaderFor(user);
            await User.findByIdAndUpdate(user._id, { isActive: false });

            const res = await request(app).get(PROTECTED_ROUTE).set('Authorization', authHeader);

            assert.equal(res.status, 403);
        });

        it('lose access with a token issued before deletion', async () => {
            const user = await createTestUser();
            const authHeader = authHeaderFor(user);
            await User.findByIdAndDelete(user._id);

            const res = await request(app).get(PROTECTED_ROUTE).set('Authorization', authHeader);

            assert.equal(res.status, 401);
        });
    });

    it('grants access to an active, logged in user', async () => {
        const user = await createTestUser();

        const res = await request(app).get(PROTECTED_ROUTE).set('Authorization', authHeaderFor(user));

        assert.equal(res.status, 200);
    });
});
