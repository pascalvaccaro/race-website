import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getRunner } from '$lib/strapi/register';

export const load: PageServerLoad<{ runner: App.Runner }> = async ({ params }) => {
	const runner = await getRunner(params.id, {
		populate: ['runs', 'runs.race', 'runs.race.park', 'parent'],
	});
	if (!runner) throw error(404);
	return { runner };
};

export const prerender = true;