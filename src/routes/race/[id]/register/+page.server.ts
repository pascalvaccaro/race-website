import type { RequestHandler } from '@sveltejs/kit';
import { getRace } from '$lib/strapi/race';

export const GET: RequestHandler<{ id: string }, { race: App.Race } | unknown> = async ({
	params
}) => {
	try {
		const race = await getRace(params.id);
		return {
			body: { race }
		};
	} catch (err: unknown) {
		return {
			status: 500,
			body: err as App.Race
		};
	}
};