import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

interface PluginOptions {
  prismaClient?: PrismaClient;
}

export default fp(async (fastify, opts: PluginOptions) => {
  const prisma = opts?.prismaClient || new PrismaClient();
  if (!opts?.prismaClient) {
    await prisma.$connect();
  }
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
});
