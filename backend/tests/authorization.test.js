import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../app.js';
import roleEnum from '../models/enums/role.enum.js';
import { connectTestDatabase, clearTestDatabase, disconnectTestDatabase } from './helpers/test-database.js';
import { createTestUser, authHeaderFor } from './helpers/test-users.js';

describe('Authorization', () => {
    let admin, competenceLeader, lecturer, otherLecturer;

    before(connectTestDatabase);
    after(disconnectTestDatabase);

    beforeEach(async () => {
        admin = await createTestUser({ role: roleEnum.ADMIN });
        competenceLeader = await createTestUser({ role: roleEnum.COMPETENCE_LEADER });
        lecturer = await createTestUser({ role: roleEnum.LECTURER });
        otherLecturer = await createTestUser({ role: roleEnum.LECTURER });
    });

    afterEach(clearTestDatabase);

    describe('inactive users overview', () => {
        const route = '/api/v1/users/inactive';

        it('is allowed for admins and competence leaders', async () => {
            for (const user of [admin, competenceLeader]) {
                const res = await request(app).get(route).set('Authorization', authHeaderFor(user));
                assert.equal(res.status, 200, `expected 200 for ${user.role}`);
            }
        });

        it('is forbidden for lecturers', async () => {
            const res = await request(app).get(route).set('Authorization', authHeaderFor(lecturer));

            assert.equal(res.status, 403);
        });
    });

    describe('activating users', () => {
        it('is forbidden for lecturers', async () => {
            const res = await request(app)
                .patch(`/api/v1/users/${otherLecturer._id}/activate`)
                .set('Authorization', authHeaderFor(lecturer));

            assert.equal(res.status, 403);
        });
    });

    describe('deleting users', () => {
        it('is allowed for admins', async () => {
            const res = await request(app)
                .delete(`/api/v1/users/${lecturer._id}`)
                .set('Authorization', authHeaderFor(admin));

            assert.equal(res.status, 200);
        });

        it('is forbidden for competence leaders and lecturers', async () => {
            for (const user of [competenceLeader, lecturer]) {
                const res = await request(app)
                    .delete(`/api/v1/users/${otherLecturer._id}`)
                    .set('Authorization', authHeaderFor(user));
                assert.equal(res.status, 403, `expected 403 for ${user.role}`);
            }
        });
    });

    describe('editing a user profile', () => {
        it('is allowed for the own profile', async () => {
            const res = await request(app)
                .put(`/api/v1/users/${lecturer._id}`)
                .set('Authorization', authHeaderFor(lecturer))
                .send({ phoneNumber: '0123' });

            assert.equal(res.status, 200);
        });

        it('is forbidden for the profile of another lecturer', async () => {
            const res = await request(app)
                .put(`/api/v1/users/${otherLecturer._id}`)
                .set('Authorization', authHeaderFor(lecturer))
                .send({ phoneNumber: '0123' });

            assert.equal(res.status, 403);
        });

        it('ignores a role change by a lecturer', async () => {
            const res = await request(app)
                .put(`/api/v1/users/${lecturer._id}`)
                .set('Authorization', authHeaderFor(lecturer))
                .send({ role: roleEnum.ADMIN });

            assert.equal(res.status, 200);
            assert.equal(res.body.role, roleEnum.LECTURER);
        });
    });

    describe('managing future skills', () => {
        const route = '/api/v1/future-skills';

        it('requires login', async () => {
            const res = await request(app).post(route).send({ name: 'AI' });

            assert.equal(res.status, 401);
        });

        it('is allowed for admins and competence leaders', async () => {
            for (const user of [admin, competenceLeader]) {
                const res = await request(app)
                    .post(route)
                    .set('Authorization', authHeaderFor(user))
                    .send({ name: 'AI' });
                assert.equal(res.status, 201, `expected 201 for ${user.role}`);
            }
        });

        it('is forbidden for lecturers', async () => {
            const authHeader = authHeaderFor(lecturer);
            const created = await request(app)
                .post(route)
                .set('Authorization', authHeaderFor(admin))
                .send({ name: 'AI' });

            const responses = await Promise.all([
                request(app).post(route).set('Authorization', authHeader).send({ name: 'AI' }),
                request(app).put(`${route}/${created.body._id}`).set('Authorization', authHeader).send({ name: 'ML' }),
                request(app).delete(`${route}/${created.body._id}`).set('Authorization', authHeader),
                request(app).post(`${route}/send-email`).set('Authorization', authHeader).send({})
            ]);

            responses.forEach(res => assert.equal(res.status, 403));
        });
    });

    describe('registering a user with a chosen role', () => {
        const route = '/api/v1/auth/register';

        it('requires login', async () => {
            const res = await request(app)
                .post(route)
                .set('x-admin-creation', 'true')
                .send({ email: 'attacker@test.at', role: roleEnum.ADMIN });

            assert.equal(res.status, 401);
        });

        it('is forbidden for lecturers', async () => {
            const res = await request(app)
                .post(route)
                .set('x-admin-creation', 'true')
                .set('Authorization', authHeaderFor(lecturer))
                .send({ email: 'attacker@test.at', role: roleEnum.ADMIN });

            assert.equal(res.status, 403);
        });
    });
});
