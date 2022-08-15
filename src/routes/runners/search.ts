import type { RequestHandler } from '@sveltejs/kit';
import { findRunners } from '$lib/strapi.back';

export const POST: RequestHandler<{ email?: string; fullname?: string }, App.Runner[]> = async ({ request }) => {
	const params = await request.json();
	const body = await findRunners(params);

	return {
		body
	};
};
