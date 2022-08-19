import { getRace } from '$lib/strapi/race';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ race: App.Race }> = async ({
	params
}) => {
	try {
		const race = await getRace(params.id);
		return { race };
	} catch (err: any) {
		throw error(err.statusCode ?? 500, err.message ?? err.toString());
	}
};