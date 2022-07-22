import type { RequestHandler } from '@sveltejs/kit';
import { getRun } from '$lib/strapi';

export const GET: RequestHandler<{ run: string }, { run: App.Run }> = async ({ params}) => {
  const { run: id } = params;
  const run = await getRun(id);
  if (!run)
    return {
      status: 404
    };
  return {
    body: { run },
  };
};

