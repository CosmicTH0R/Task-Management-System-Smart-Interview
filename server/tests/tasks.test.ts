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

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function registerAndLogin(
  email = 'taskuser@example.com',
  password = 'password123',
  name = 'Task User',
) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password });
  return { cookie: res.headers['set-cookie'] as unknown as string[], userId: res.body.data?.user?._id as string };
}

const baseTask = {
  title: 'Test Task',
  description: 'A test task description',
  status: 'Todo',
  priority: 'Medium',
};

// ─── Create Task ──────────────────────────────────────────────────────────────

describe('POST /api/tasks', () => {
  it('creates a task for authenticated user', async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(baseTask.title);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).post('/api/tasks').send(baseTask);
    expect(res.status).toBe(401);
  });

  it('rejects task with missing title', async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app)
      .post('/api/tasks')
      .set('Cookie', cookie)
      .send({ description: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ─── Get All Tasks ────────────────────────────────────────────────────────────

describe('GET /api/tasks', () => {
  it('returns all tasks for the authenticated user', async () => {
    const { cookie } = await registerAndLogin();
    await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ ...baseTask, title: 'Task 2' });

    const res = await request(app).get('/api/tasks').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.total).toBe(2);
  });

  it('filters by status', async () => {
    const { cookie } = await registerAndLogin();
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ ...baseTask, status: 'Todo' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ ...baseTask, title: 'Done Task', status: 'Done' });

    const res = await request(app).get('/api/tasks?status=Done').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe('Done');
  });

  it('filters by priority', async () => {
    const { cookie } = await registerAndLogin();
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ ...baseTask, priority: 'High' });
    await request(app).post('/api/tasks').set('Cookie', cookie).send({ ...baseTask, title: 'Low Task', priority: 'Low' });

    const res = await request(app).get('/api/tasks?priority=High').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].priority).toBe('High');
  });

  it('returns paginated results', async () => {
    const { cookie } = await registerAndLogin();
    for (let i = 1; i <= 5; i++) {
      await request(app).post('/api/tasks').set('Cookie', cookie).send({ ...baseTask, title: `Task ${i}` });
    }
    const res = await request(app).get('/api/tasks?page=1&limit=3').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.pagination.total).toBe(5);
    expect(res.body.pagination.pages).toBe(2);
  });

  it('does not return another user\'s tasks', async () => {
    const user1 = await registerAndLogin('user1@example.com');
    const user2 = await registerAndLogin('user2@example.com');
    await request(app).post('/api/tasks').set('Cookie', user1.cookie).send(baseTask);

    const res = await request(app).get('/api/tasks').set('Cookie', user2.cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

// ─── Get Task By ID ───────────────────────────────────────────────────────────

describe('GET /api/tasks/:id', () => {
  it('returns a task by ID for the owner', async () => {
    const { cookie } = await registerAndLogin();
    const create = await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app).get(`/api/tasks/${taskId}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(taskId);
  });

  it('returns 404 for another user\'s task', async () => {
    const user1 = await registerAndLogin('u1@example.com');
    const user2 = await registerAndLogin('u2@example.com');
    const create = await request(app).post('/api/tasks').set('Cookie', user1.cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app).get(`/api/tasks/${taskId}`).set('Cookie', user2.cookie);
    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid task ID', async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app).get('/api/tasks/invalid-id').set('Cookie', cookie);
    expect(res.status).toBe(400);
  });
});

// ─── Update Task ──────────────────────────────────────────────────────────────

describe('PUT /api/tasks/:id', () => {
  it('updates a task for the owner', async () => {
    const { cookie } = await registerAndLogin();
    const create = await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Cookie', cookie)
      .send({ title: 'Updated Title', priority: 'High' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.priority).toBe('High');
  });

  it('rejects update from non-owner', async () => {
    const user1 = await registerAndLogin('ow1@example.com');
    const user2 = await registerAndLogin('ow2@example.com');
    const create = await request(app).post('/api/tasks').set('Cookie', user1.cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Cookie', user2.cookie)
      .send({ title: 'Hijacked' });
    expect(res.status).toBe(404);
  });
});

// ─── Update Task Status ───────────────────────────────────────────────────────

describe('PATCH /api/tasks/:id/status', () => {
  it('updates task status', async () => {
    const { cookie } = await registerAndLogin();
    const create = await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Cookie', cookie)
      .send({ status: 'Done' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('Done');
  });

  it('rejects status update without status field', async () => {
    const { cookie } = await registerAndLogin();
    const create = await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Cookie', cookie)
      .send({});
    expect(res.status).toBe(400);
  });
});

// ─── Delete Task ──────────────────────────────────────────────────────────────

describe('DELETE /api/tasks/:id', () => {
  it('deletes a task for the owner', async () => {
    const { cookie } = await registerAndLogin();
    const create = await request(app).post('/api/tasks').set('Cookie', cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app).delete(`/api/tasks/${taskId}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Confirm it's gone
    const check = await request(app).get(`/api/tasks/${taskId}`).set('Cookie', cookie);
    expect(check.status).toBe(404);
  });

  it('rejects deletion from non-owner', async () => {
    const user1 = await registerAndLogin('del1@example.com');
    const user2 = await registerAndLogin('del2@example.com');
    const create = await request(app).post('/api/tasks').set('Cookie', user1.cookie).send(baseTask);
    const taskId = create.body.data._id;

    const res = await request(app).delete(`/api/tasks/${taskId}`).set('Cookie', user2.cookie);
    expect(res.status).toBe(404);
  });
});
