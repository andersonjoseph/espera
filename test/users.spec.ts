import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import {
  userRepositoryMock,
  userResultMock,
  waitlistRepositoryMock,
  waitlistResultMock,
} from './fixtures/mocks';
import { UserModuleMock } from './fixtures/modules/userModule';

describe('users', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = (await UserModuleMock.compile()).createNestApplication();

    await app.init();
  });

  describe('/users (GET)', () => {
    it('should return an array of users', async () => {
      let res = await supertest(app.getHttpServer()).get('/api/users/');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('metadata');
      expect(res.body).toHaveProperty('records');
      expect(res.body.records).toBeInstanceOf(Array);

      expect(res.body.records[0]).toHaveProperty('_id');
      expect(res.body.records[0]).toHaveProperty('email');
      expect(res.body.records[0]).toHaveProperty('position');
      expect(res.body.records[0]).toHaveProperty('date');
      expect(res.body.records[0]).toHaveProperty('referrers');
      expect(res.body.records[0]).toHaveProperty('verified');

      res = await supertest(app.getHttpServer()).get('/api/users?page=1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('metadata');
      expect(res.body).toHaveProperty('records');
      expect(res.body.records).toBeInstanceOf(Array);

      expect(res.body.records[0]).toHaveProperty('_id');
      expect(res.body.records[0]).toHaveProperty('email');
      expect(res.body.records[0]).toHaveProperty('position');
      expect(res.body.records[0]).toHaveProperty('date');
      expect(res.body.records[0]).toHaveProperty('referrers');
      expect(res.body.records[0]).toHaveProperty('verified');
      expect(res.body.records[0]).toHaveProperty('waitlist');
    });

    it('should return error 400 if page is not a valid number', async () => {
      let res = await supertest(app.getHttpServer()).get('/api/users/?page=0');
      expect(res.status).toBe(400);

      res = await supertest(app.getHttpServer()).get('/api/users/?page=-1');
      expect(res.status).toBe(400);

      res = await supertest(app.getHttpServer()).get('/api/users/?page=uno');
      expect(res.status).toBe(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a single user', async () => {
      const res = await supertest(app.getHttpServer()).get(
        '/api/users/6272f75b20545b275cd4b547',
      );

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('position');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('referrers');
      expect(res.body).toHaveProperty('verified');
      expect(res.body).toHaveProperty('waitlist');
    });

    it('should return status 400 if id is not an objectId', async () => {
      let res = await supertest(app.getHttpServer()).get('/api/users/2');
      expect(res.status).toBe(400);

      res = await supertest(app.getHttpServer()).get('/api/users/dos');
      expect(res.status).toBe(400);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete single user and return 204', async () => {
      const res = await supertest(app.getHttpServer()).delete(
        '/api/users/6272f75b20545b275cd4b547',
      );

      expect(res.status).toBe(204);
    });

    it('should return status 400 if id is not an objectId', async () => {
      let res = await supertest(app.getHttpServer()).delete('/api/users/2');
      expect(res.status).toBe(400);

      res = await supertest(app.getHttpServer()).delete('/api/users/dos');
      expect(res.status).toBe(400);
    });
  });

  describe('/users/ (POST)', () => {
    it('should create and return the created user', async () => {
      // mock existing user to null
      userRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

      let newUser: Record<string, string | number | boolean> = {
        email: 'andersonjuega@gmail.com',
        name: 'ander',
        waitlist: '627c35084252f301edf7c44f',
      };

      let res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(201);

      newUser = {
        email: 'andersonjuega@gmail.com',
        name: 'ander',
        waitlist: '627c35084252f301edf7c44f',
        referredBy: 'andersonjuega@gmail.com',
      };

      res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(201);

      // reset mock
      userRepositoryMock.findOne = jest.fn().mockResolvedValue(userResultMock);
    });

    it('should return 409 if email already exists', async () => {
      const newUser = {
        email: 'andersonjuega@gmail.com',
        name: 'ander',
        waitlist: '627c35084252f301edf7c44f',
      };

      const res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(409);
    });

    it('should return 409 if wailist does not exist', async () => {
      // mock existing waitlist as null
      waitlistRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      const newUser = {
        email: 'andersonjuega@gmail.com',
        name: 'ander',
        waitlist: '627c35084252f301edf7c44f',
      };

      const res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(409);

      // reset mock
      waitlistRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue(waitlistResultMock);
    });

    it('should return 400 if body is not well formatted', async () => {
      // mock existing user to null
      userRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

      // empty body
      let newUser = {};

      let res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(400);

      // Not valid email
      newUser = {
        email: 'andersonjuega',
      };

      res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(400);

      // No email
      newUser = {
        name: 'andersonjuega',
      };

      res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(400);

      // Empty name
      newUser = {
        email: 'andersonjuega@gmail.com',
        name: '',
      };

      res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(400);

      // no valid referrer
      newUser = {
        email: 'andersonjuega@gmail.com',
        referredBy: 'bestfriend',
      };

      res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(400);

      // reset mock
      userRepositoryMock.findOne = jest.fn().mockResolvedValue(userResultMock);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should return updated object', async () => {
      // update email
      let newUser: Record<string, string | number | boolean> = {
        email: 'andersonjuega@gmail.com',
      };

      let res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('position');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('referrers');
      expect(res.body).toHaveProperty('verified');

      // update name
      newUser = {
        name: 'ander',
      };

      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('position');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('referrers');
      expect(res.body).toHaveProperty('verified');
    });

    it('should return status 400 if update object is not well formatted', async () => {
      // bad email
      let newUser: Record<string, string | number | boolean> = {
        email: 'andersonjuega',
      };

      let res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);

      // empty name
      newUser = {
        name: '',
      };

      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);

      // position not a number
      newUser = {
        position: '1',
      };

      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);

      // position not a number
      newUser = {
        position: 'uno',
      };

      // referrers not a number
      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);

      newUser = {
        referrers: 'uno',
      };

      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);

      // referrers not a number
      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);

      newUser = {
        referrers: '1',
      };

      res = await supertest(app.getHttpServer())
        .patch('/api/users/6272f75b20545b275cd4b547')
        .send(newUser);

      expect(res.status).toBe(400);
    });
  });
});
