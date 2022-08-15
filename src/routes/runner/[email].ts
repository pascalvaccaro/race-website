import type { RequestHandler } from '@sveltejs/kit';
import { findRunnerByEmail } from '$lib/strapi.back';

export const GET: RequestHandler<{ email: string }, App.Runner[]> = async ({ params }) => {
	const { email } = params;
	const body = await findRunnerByEmail(email);

	return {
		body
	};
};
