import { createAuth, getDb, type Env } from '../../_auth';

type Ctx = { request: Request; env: Env };

const TARGET_RE = /^[a-z0-9:_-]{1,100}$/;
const MAX_BODY = 2000;
const RATE_LIMIT_MS = 30_000;

export const onRequestGet = async ({ request, env }: Ctx): Promise<Response> => {
  const target = new URL(request.url).searchParams.get('target') ?? '';
  if (!TARGET_RE.test(target)) {
    return Response.json({ error: 'invalid target' }, { status: 400 });
  }

  const db = getDb(env);
  const rows = await db
    .selectFrom('comment')
    .innerJoin('user', (join) => join.onRef('user.id', '=', 'comment.userId'))
    .select([
      'comment.id as id',
      'comment.body as body',
      'comment.createdAt as createdAt',
      'user.name as authorName',
      'user.image as authorImage',
    ])
    .where('comment.target', '=', target)
    .where('comment.hidden', '=', 0)
    .orderBy('comment.createdAt', 'desc')
    .limit(100)
    .execute();

  return Response.json({ comments: rows });
};

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let payload: { target?: string; body?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  const target = (payload.target ?? '').trim();
  const body = (payload.body ?? '').trim();
  if (!TARGET_RE.test(target)) {
    return Response.json({ error: 'invalid target' }, { status: 400 });
  }
  if (body.length < 1 || body.length > MAX_BODY) {
    return Response.json({ error: `body must be 1-${MAX_BODY} chars` }, { status: 400 });
  }

  const db = getDb(env);
  const userId = session.user.id;

  // naive anti-spam: max one comment per 30s per user
  const recent = await db
    .selectFrom('comment')
    .select((eb) => eb.fn.countAll<number>(), 'n')
    .where('userId', '=', userId)
    .where('createdAt', '>', Date.now() - RATE_LIMIT_MS)
    .executeTakeFirst();
  if ((recent?.n ?? 0) > 0) {
    return Response.json({ error: 'too fast — wait a moment' }, { status: 429 });
  }

  const id = crypto.randomUUID();
  const createdAt = Date.now();
  await db
    .insertInto('comment')
    .values({ id, target, userId, body, createdAt, hidden: 0 })
    .execute();

  return Response.json({
    comment: {
      id,
      body,
      createdAt,
      authorName: session.user.name,
      authorImage: session.user.image ?? null,
    },
  });
};
