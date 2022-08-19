import type { RequestHandler } from '@sveltejs/kit';
import { createRun, getRace, updateRun } from '$lib/strapi/race';

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

export const POST: RequestHandler<{ id: string }> = async ({ request, params }) => {
	const { data } = await request.json();
	await Promise.all(
		data.map((run: App.Run) => ('id' in run ? updateRun : createRun)(params.id)(run))
	);

	return { 
		status: 200,
	}
};
