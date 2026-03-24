import request from 'supertest';
import app from '../src/app';
import { connectTestDB, disconnectTestDB, clearCollections } from './setup/dbHelper';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

const validUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

// ─── Register ────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('registers a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('email');
    expect(res.body.data.email).toBe(validUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects short password (< 6 chars)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUser);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── Protected Route ─────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  it('returns user when authenticated', async () => {
    const loginRes = await request(app).post('/api/auth/register').send(validUser);
    const cookie = loginRes.headers['set-cookie'] as unknown as string[];
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(validUser.email);
  });

  it('returns 401 when no token provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('clears the auth cookie on logout', async () => {
    const loginRes = await request(app).post('/api/auth/register').send(validUser);
    const cookie = loginRes.headers['set-cookie'] as unknown as string[];
    const res = await request(app).post('/api/auth/logout').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
