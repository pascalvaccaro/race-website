import type { RequestHandler } from '@sveltejs/kit';
import { getRun, registerRun } from '$lib/strapi';
import { extractRegisterFormData } from '$lib/utils/form';

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

export const POST: RequestHandler<{ run: string }, { run: App.Run; runner: App.Runner}> = async ({ params, request }) => {
  const parentRun = await getRun(params.run);
  const data = await request.formData();
  const body = await extractRegisterFormData(data);
  const run = await registerRun(body);
  
  return {
    body: { run, runner: parentRun.runner }
  }
}