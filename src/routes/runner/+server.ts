import { findRunners } from '$lib/strapi/register';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const params = Object.fromEntries(url.searchParams.entries());
	const body = await findRunners(params);

	return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
};
