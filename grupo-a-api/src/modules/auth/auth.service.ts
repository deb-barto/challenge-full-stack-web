import { FastifyInstance } from 'fastify';
import { check } from '../../utils/password';

export async function doLogin(app: FastifyInstance, username: string, password: string){
  const admin = await app.prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;
  const ok = await check(admin.password, password);
  if (!ok) return null;
  const payload = { sub: admin.id, role: 'ADMIN', username: admin.username } as const;
  const access = app.jwt.sign(payload, { expiresIn: app.config.JWT_EXPIRES });
  const refresh = app.jwt.sign({ ...payload, typ: 'refresh' }, { expiresIn: app.config.JWT_REFRESH_EXPIRES });
  return {
    access,
    refresh,
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      createdAt: admin.createdAt,
    }
  };
}
