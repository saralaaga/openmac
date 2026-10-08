import { createAuth, type Env } from '../../_auth';

type PagesFunctionContext = { request: Request; env: Env };

export const onRequest = async (context: PagesFunctionContext): Promise<Response> => {
  const auth = createAuth(context.env);
  return auth.handler(context.request);
};
