import type { PageServerLoad } from './$types';
import { error, type Action } from '@sveltejs/kit';
import { createRun, getRace, updateRun } from '$lib/strapi/race';

export const load: PageServerLoad<{ race: App.Race }> = async () => {
	try {
		const race = await getRace('next');
		return { race };
	} catch (err: any) {
		throw error(err.status ?? err.statusCode ?? 500, err.message);
	}
};

export const POST: Action<{ id: string }> = async ({ request }) => {
	const { data, raceId } = await request.json();
	await Promise.all(
		data.map((run: App.Run) => ('id' in run ? updateRun : createRun)(raceId)(run))
	);
};
