import { findRunners } from '$lib/strapi/register';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const params = await request.json();
	const body = await findRunners(params);

	return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
};
