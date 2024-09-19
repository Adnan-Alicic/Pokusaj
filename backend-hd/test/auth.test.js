const request = require('supertest');
const app = require('../app'); // Pretpostavljamo da je app.js tvoj glavni fajl

describe('Auth API', () => {
    it('should register a new user', async() => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                firstname: 'Test',
                lastname: 'User',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should login a user', async() => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
    });
});