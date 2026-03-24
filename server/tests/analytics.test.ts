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

async function registerAndLogin(email = 'analytics@example.com') {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Analytics User', email, password: 'password123' });
  return { cookie: res.headers['set-cookie'] as unknown as string[] };
}

describe('GET /api/analytics', () => {
  it('returns zero counts when user has no tasks', async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app).get('/api/analytics').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.totalTasks).toBe(0);
    expect(res.body.data.completedTasks).toBe(0);
    expect(res.body.data.pendingTasks).toBe(0);
    expect(res.body.data.completionPercentage).toBe(0);
  });

  it('returns correct counts after creating tasks', async () => {
    const { cookie } = await registerAndLogin();

    // Create 3 Todo, 1 In Progress, 2 Done
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ title: 'T1', status: 'Todo', priority: 'Low' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ title: 'T2', status: 'Todo', priority: 'Medium' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ title: 'T3', status: 'Todo', priority: 'High' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ title: 'T4', status: 'In Progress', priority: 'Medium' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ title: 'T5', status: 'Done', priority: 'Low' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ title: 'T6', status: 'Done', priority: 'High' });

    const res = await request(app).get('/api/analytics').set('Cookie', cookie);
    expect(res.status).toBe(200);

    const { totalTasks, completedTasks, pendingTasks, completionPercentage, statusBreakdown, priorityBreakdown } =
      res.body.data;

    expect(totalTasks).toBe(6);
    expect(completedTasks).toBe(2);
    expect(pendingTasks).toBe(4);
    expect(completionPercentage).toBe(33); // Math.round(2/6*100)

    expect(statusBreakdown.todo).toBe(3);
    expect(statusBreakdown.inProgress).toBe(1);
    expect(statusBreakdown.done).toBe(2);

    expect(priorityBreakdown.low).toBe(2);
    expect(priorityBreakdown.medium).toBe(2);
    expect(priorityBreakdown.high).toBe(2);
  });

  it('only counts tasks belonging to the requesting user', async () => {
    const user1 = await registerAndLogin('ana1@example.com');
    const user2 = await registerAndLogin('ana2@example.com');

    // user1 creates 3 done tasks
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/tasks')
        .set('Cookie', user1.cookie)
        .send({ title: `Task ${i}`, status: 'Done', priority: 'Low' });
    }

    // user2 should still see 0
    const res = await request(app).get('/api/analytics').set('Cookie', user2.cookie);
    expect(res.body.data.totalTasks).toBe(0);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(401);
  });
});
