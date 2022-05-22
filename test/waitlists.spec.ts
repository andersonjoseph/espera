import supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  jwtGuardMockFactory,
  waitlistRepositoryMock,
  waitlistResultMock,
} from './fixtures/mocks';
import { WaitlistModuleMock } from './fixtures/modules/waitlistModule';
import { AuthGuard } from '@nestjs/passport';

describe('waitlists', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = (
      await WaitlistModuleMock.overrideGuard(AuthGuard('jwt'))
        .useFactory({ factory: jwtGuardMockFactory })
        .compile()
    ).createNestApplication();

    await app.init();
  });

  describe('/api/waitlists (GET)', () => {
    it('should return an array of waitlists', async () => {
      const res = await supertest(app.getHttpServer()).get('/api/waitlists/');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);

      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('options');
      expect(res.body[0]).toHaveProperty('date');
    });
  });

  describe('/api/waitlists/:id (DELETE)', () => {
    it('should delete and return no content', async () => {
      const res = await supertest(app.getHttpServer()).delete(
        '/api/waitlists/627c35084252f301edf7c44f',
      );
      expect(res.status).toBe(204);
    });
  });

  describe('/api/waitlists/:id (GET)', () => {
    it('should return a single waitlist', async () => {
      const res = await supertest(app.getHttpServer()).get(
        '/api/waitlists/627c35084252f301edf7c44f',
      );

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('options');
      expect(res.body).toHaveProperty('date');
    });

    it('should return 404 if a waitlist does not exist', async () => {
      // mock not found waitlist;
      waitlistRepositoryMock.findById = jest.fn().mockResolvedValue(null);
      const res = await supertest(app.getHttpServer()).get(
        '/api/waitlists/627c35083252f301edf7c44f',
      );

      expect(res.status).toBe(404);

      // reset mock
      waitlistRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue(waitlistResultMock);
    });

    it('should return error 400 if id is not a valid ObjectId', async () => {
      let res = await supertest(app.getHttpServer()).get('/api/waitlists/1');
      expect(res.status).toBe(400);

      res = await supertest(app.getHttpServer()).get('/api/waitlists/uno');
      expect(res.status).toBe(400);
    });
  });

  describe('/api/waitlists (POST)', () => {
    it('Should create and return the new waitlist', async () => {
      // mock found waitlist to null to prevent 409 conflic (existing waitlist)
      waitlistRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

      const newWaitlist = {
        name: 'lalista',
        options: {
          userSkips: 1,
          sendEmails: true,
          verifyEmails: true,
        },
      };

      const res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(201);

      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('options');
      expect(res.body).toHaveProperty('date');
      expect(res.body).toHaveProperty('_id');

      // reset mock
      waitlistRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue(waitlistResultMock);
    });

    it('Should return 409 if the waitlist already exists', async () => {
      const newWaitlist = {
        name: 'lalista',
        options: {
          userSkips: 1,
          sendEmails: true,
          verifyEmails: true,
        },
      };

      const res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(409);
    });

    it('Should return 400 if the waitlist body is not well formatted', async () => {
      // missing name
      let newWaitlist: object = {
        options: {
          userSkips: 1,
          sendEmails: true,
          verifyEmails: true,
        },
      };

      let res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(400);

      // empty name
      newWaitlist = {
        name: '',
        options: {
          userSkips: 1,
          sendEmails: true,
          verifyEmails: true,
        },
      };

      res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(400);

      // missing options
      newWaitlist = {
        name: 'lista1',
      };

      res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(400);

      // missing options.userSkips
      newWaitlist = {
        name: 'lista1',
        options: {
          sendEmails: true,
          verifyEmails: true,
        },
      };

      res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(400);

      // missing options.sendEmails
      newWaitlist = {
        name: 'lista1',
        options: {
          userSkips: 2,
          verifyEmails: true,
        },
      };

      res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(400);

      // missing options.verifyEmails
      newWaitlist = {
        name: 'lista1',
        options: {
          userSkips: 2,
          sendEmails: true,
        },
      };

      res = await supertest(app.getHttpServer())
        .post('/api/waitlists')
        .send(newWaitlist);

      expect(res.status).toBe(400);
    });
  });

  describe('/api/waitlists/:id (PATCH)', () => {
    it('should update and return the updated waitlist', async () => {
      // mock found waitlist to null to prevent 409 conflic (existing waitlist)
      waitlistRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

      const updatedData = {
        name: 'new waitlist name',
        options: {
          userSkips: 2,
          sendEmails: true,
          verifyEmails: true,
        },
      };

      const res = await supertest(app.getHttpServer())
        .patch('/api/waitlists/627c35083252f301edf7c44f')
        .send(updatedData);

      expect(res.status).toBe(200);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('options');

      // reset mock
      waitlistRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue(waitlistResultMock);
    });
  });
});
