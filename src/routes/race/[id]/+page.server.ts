import type { PageServerLoad } from './$types';
import {  error, type Action } from '@sveltejs/kit';
import { createRun, getRace, updateRun } from '$lib/strapi/race';

export const load: PageServerLoad<{ race: App.Race }> = async ({
	params
}) => {
	try {
		const race = await getRace(params.id);
		return { race };
	} catch (err: any) {
		throw error(err.statusCode ?? 500, err.message)
	}
};

export const POST: Action<{ id: string }> = async ({ request, params }) => {
	const { data } = await request.json();
	await Promise.all(
		data.map((run: App.Run) => ('id' in run ? updateRun : createRun)(params.id)(run))
	);
};
