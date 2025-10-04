import { FastifyInstance } from 'fastify';
import { check } from '../../utils/password';

export async function doLogin(app: FastifyInstance, email: string, password: string){
  const admin = await app.prisma.admin.findUnique({ where: { email }});
  if (!admin) return null;
  const ok = await check(admin.password, password);
  if (!ok) return null;
  const access = app.jwt.sign({ sub: admin.id, role: 'ADMIN' }, { expiresIn: app.config.JWT_EXPIRES });
  const refresh = app.jwt.sign({ sub: admin.id, role: 'ADMIN', typ: 'refresh' }, { expiresIn: app.config.JWT_REFRESH_EXPIRES });
  return { access, refresh };
}
