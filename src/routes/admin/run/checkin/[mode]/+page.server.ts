import { error, type Action } from '@sveltejs/kit';
import { getRace, findNextAvailableNumberSign } from '$lib/strapi/race';
import { registerRun } from '$lib/strapi/register';
import { extractRegisterFormData } from '$lib/utils/form';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ race: App.Race }> = async () => {
	try {
		const race = await getRace('next');
		return { race };
	} catch (err: any) {
		throw error(err.statusCode ?? 500, err.message ?? err.toString());
	}
};

export const POST: Action<{ id: string }> = async ({ request }) => {
	let data: App.Run;
	if (request.headers.get('Content-Type') === 'application/json') {
		data = await request.json() as App.Run;
	} else {
		const body = await request.formData();
		data = await extractRegisterFormData(body);
	}
	data.numberSign = await findNextAvailableNumberSign(data);
	const run = await registerRun(data);

	return {
		location: `/admin/run/${run.id}`
	};
};
