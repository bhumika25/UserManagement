import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import prismaPlugin from './plugins/prisma.js';
import profileRoutes from './routes/profile.route.js';

const app = Fastify({
  logger: {
    level: 'info',
    redact: ['req.headers.authorization'],
  },
});

app.addHook('onRequest', (request, reply, done) => {
  request.log.info(
    { method: request.method, url: request.url },
    'Incoming request, called from onRequest hook',
  );
  done();
});

app.addHook('onResponse', (request, reply, done) => {
  request.log.info({ statusCode: reply.statusCode }, 'Request completed, called from onResponse hook');
  done();
});

app.register(swagger, {
  openapi: {
    info: {
      title: 'User Profile API',
      version: '1.0.0',
      description: 'Swagger docs for the User Profile Service',
    },
  },
});

app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

app.register(prismaPlugin);
app.register(profileRoutes, { prefix: '/profiles' });

export default app;
