import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { convertDMYToISO } from '../utils/dateFormatter.js';
import { Profile, CreateProfileBody } from '../types/profile.js';

const ProfileSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    dateOfBirth: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'firstName', 'lastName', 'dateOfBirth'],
};

const CreateProfileSchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'dateOfBirth'],
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    dateOfBirth: { type: 'string', pattern: '^\\d{2}/\\d{2}/\\d{4}$' },
  },
};

const profileRoutes: FastifyPluginAsync = async (fastify) => {
  const prisma = fastify.prisma;

  //GET ALL PROFILES API
  fastify.get('/', {
    schema: {
      summary: 'Get all profiles',
      response: {
        200: {
          type: 'array',
          items: ProfileSchema,
        },
      },
    },
    handler: async (_req, reply): Promise<Profile[]> => {
      try {
        const profiles = await prisma.profile.findMany();
        return reply.send(profiles);
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    },
  });

  //GET PROFILE BY ID API
  fastify.get('/:id', {
    schema: {
      summary: 'Get a profile by ID',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
      response: {
        200: ProfileSchema,
        404: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    handler: async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ): Promise<Profile | void> => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return reply.code(400).send({ error: 'Invalid profile ID' });
      }
      try {
        const profile = await prisma.profile.findUnique({ where: { id } });
        if (!profile) {
          return reply.code(404).send({ error: 'Profile not found' });
        }
        return reply.send(profile);
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    },
  });

  //CREATE PROFILE API
  fastify.post('/', {
    schema: {
      summary: 'Create a new profile',
      body: CreateProfileSchema,
      response: {
        201: ProfileSchema,
        400: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    handler: async (
      req: FastifyRequest<{ Body: CreateProfileBody }>,
      reply: FastifyReply,
    ): Promise<Profile | void> => {
      const { firstName, lastName, dateOfBirth } = req.body;
      const isoDate = convertDMYToISO(dateOfBirth);
      if (!isoDate) {
        return reply.code(400).send({ error: 'Invalid date format. Expected dd/mm/yyyy.' });
      }

      try {
        const profile = await prisma.profile.create({
          data: { firstName, lastName, dateOfBirth: isoDate },
        });
        return reply.code(201).send(profile);
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    },
  });

  //UPDATE PROFILE API
  fastify.put('/:id', {
    schema: {
      summary: 'Update a profile',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
      body: CreateProfileSchema,
      response: {
        200: ProfileSchema,
        400: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
        404: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    handler: async (
      req: FastifyRequest<{ Params: { id: string }; Body: CreateProfileBody }>,
      reply: FastifyReply,
    ): Promise<Profile | void> => {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return reply.code(400).send({ error: 'Invalid profile ID' });
      }

      const { firstName, lastName, dateOfBirth } = req.body;
      const isoDate = convertDMYToISO(dateOfBirth);
      if (!isoDate) {
        return reply.code(400).send({ error: 'Invalid date format. Expected dd/mm/yyyy.' });
      }

      try {
        const updated = await prisma.profile.update({
          where: { id },
          data: { firstName, lastName, dateOfBirth: isoDate },
        });
        return reply.send(updated);
      } catch (error) {
        fastify.log.error(error);
        return reply.code(404).send({ error: 'Profile not found' });
      }
    },
  });
};

export default profileRoutes;
