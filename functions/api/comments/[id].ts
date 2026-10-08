import { createAuth, getDb, type Env } from '../../_auth';

type Ctx = { request: Request; env: Env; params: { id: string } };

export const onRequestDelete = async ({ request, env, params }: Ctx): Promise<Response> => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const db = getDb(env);
  const deleted = await db
    .deleteFrom('comment')
    .where('id', '=', params.id)
    .where('userId', '=', session.user.id)
    .executeTakeFirst();

  const removed = Number((deleted as unknown as { changes?: number })?.changes ?? 0);
  if (removed === 0) {
    return Response.json({ error: 'not found' }, { status: 404 });
  }
  return Response.json({ ok: true });
};
