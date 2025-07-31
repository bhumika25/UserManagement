import { describe, it, expect, beforeEach, vi } from 'vitest';
import Fastify from 'fastify';
import prismaPlugin from '../src/plugins/prisma';
import profileRoutes from '../src/routes/profile.route';

const mockPrisma = {
  profile: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteMany: vi.fn(),
  },
};

let app;

beforeEach(async () => {
  app = Fastify();
  await app.register(prismaPlugin, { prismaClient: mockPrisma });
  app.register(profileRoutes, { prefix: '/profiles' });
  await app.ready();
  vi.clearAllMocks();
});

describe('Profile API', () => {
  it('GET - /profiles should return an array of profiles', async () => {
    mockPrisma.profile.findMany.mockResolvedValue([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01').toISOString(),
      },
    ]);

    const res = await app.inject({ method: 'GET', url: '/profiles' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(1);
    expect(body[0].firstName).toBe('John');
    expect(body[0].lastName).toBe('Doe');
    expect(body[0].dateOfBirth.startsWith('1990-01-01')).toBe(true);
  });

  it('GET - /profiles should return an empty array if no profiles', async () => {
    mockPrisma.profile.findMany.mockResolvedValue([]);

    const res = await app.inject({ method: 'GET', url: '/profiles' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  it('POST - /profiles should create a profile', async () => {
    const newProfile = {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '01/01/1990',
    };
    mockPrisma.profile.create.mockResolvedValue({
      id: 2,
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      dateOfBirth: newProfile.dateOfBirth,
    });

    const res = await app.inject({
      method: 'POST',
      url: '/profiles',
      payload: newProfile,
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.firstName).toBe(newProfile.firstName);
    expect(body.lastName).toBe(newProfile.lastName);
    expect(body.dateOfBirth).toBe(newProfile.dateOfBirth);
  });

  it('GET - /profiles/:id should return a profile if found', async () => {
    mockPrisma.profile.findUnique.mockResolvedValue({
      id: 3,
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: '1980-05-05T00:00:00.000Z',
    });

    const res = await app.inject({ method: 'GET', url: '/profiles/3' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.firstName).toBe('Alice');
    expect(body.lastName).toBe('Smith');
    expect(body.dateOfBirth.startsWith('1980-05-05')).toBe(true);
  });

  it('GET - /profiles/:id should return 404 if not found', async () => {
    mockPrisma.profile.findUnique.mockResolvedValue(null);

    const res = await app.inject({ method: 'GET', url: '/profiles/999' });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);
    expect(body.error).toBeDefined();
  });

  it('PUT - /profiles/:id should update and return the profile', async () => {
    const updatedProfile = {
      firstName: 'Bob',
      lastName: 'Brown',
      dateOfBirth: '01/01/2021',
    };
    mockPrisma.profile.update.mockResolvedValue({
      id: 4,
      ...updatedProfile,
    });
    console.log('Updated Profile:', updatedProfile);
    const res = await app.inject({
      method: 'PUT',
      url: '/profiles/4',
      payload: updatedProfile,
      headers: { 'content-type': 'application/json' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.firstName).toBe(updatedProfile.firstName);
    expect(body.lastName).toBe(updatedProfile.lastName);
    expect(body.dateOfBirth).toBe(updatedProfile.dateOfBirth);
  });
});
