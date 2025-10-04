import { buildApp } from './app';
import { env } from './config/env';

buildApp().then(app => {
  app.listen({ port: env.PORT, host: '0.0.0.0' })
    .then(() => app.log.info(`api up on :${env.PORT}`));
});