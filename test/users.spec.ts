import { CacheModule, CACHE_MANAGER, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { getPaprRepositoryToken, PaprRepository } from '../src/papr';
import { UsersController } from '../src/user/user.controller';
import { UsersService } from '../src/user/user.service';
import { User } from '../src/user/user.model';
import { userRepositoryMock, userResultMock } from './fixtures/mocks';
import { Cache } from 'cache-manager';

describe('users', () => {
  let app: INestApplication;

  function serviceFactory(
    usersRepository: PaprRepository<typeof User>,
    cacheManager: Cache,
  ): UsersService {
    return new UsersService(usersRepository, cacheManager);
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: serviceFactory,
          inject: [getPaprRepositoryToken(User), CACHE_MANAGER],
        },
        {
          provide: getPaprRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

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
      };

      let res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(201);

      newUser = {
        email: 'andersonjuega@gmail.com',
        name: 'ander',
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
      };

      const res = await supertest(app.getHttpServer())
        .post('/api/users')
        .send(newUser);

      expect(res.status).toBe(409);
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

  describe('/users/:id (POST)', () => {
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
