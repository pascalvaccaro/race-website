import { error } from '@sveltejs/kit';
import { getRun } from '$lib/strapi/register';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ run: App.Run }> = async ({ params }) => {
	try {
		const run = await getRun(params.runId);
		return { run };
	} catch (err: any) {
		throw error(err.statusCode ?? 500, err.message);
	}
};
