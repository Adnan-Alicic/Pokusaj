const request = require('supertest');
const app = require('../app'); // Pretpostavljamo da je app.js tvoj glavni fajl

describe('Tickets API', () => {
    let token;

    beforeAll(async() => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        token = res.body.token; // Pretpostavljamo da vraća JWT token
    });

    it('should create a new ticket', async() => {
        const res = await request(app)
            .post('/tickets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Ticket',
                description: 'This is a new ticket'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should fetch all tickets', async() => {
        const res = await request(app)
            .get('/tickets')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});