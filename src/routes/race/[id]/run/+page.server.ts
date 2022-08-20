import { error, redirect, type Action } from '@sveltejs/kit';
import { getRace, updateRun, findNextAvailableNumberSign } from '$lib/strapi/race';
import { registerRun } from '$lib/strapi/register';
import { extractRegisterFormData } from '$lib/utils/form';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad<{ race: App.Race }> = async ({ params }) => {
	try {
		const race = await getRace(params.id);
		return { race };
	} catch (err: any) {
		throw error(err.statusCode ?? 500, err.message ?? err.toString());
	}
};

export const POST: Action<{ id: string }> = async ({ params, request }) => {
	const body = await request.formData();
	const data = await extractRegisterFormData(body);
	data.numberSign = await findNextAvailableNumberSign(data);
	const run = await registerRun(data);

	return {
		location:  `/race/${params.id}/run/${run.id}`
	};
};

export const PUT: Action<{ id: string }> = async ({ params, request }) => {
	const body = await request.json() as App.Run;
	body.numberSign = await findNextAvailableNumberSign(body);
	const run = await updateRun(params.id)(body);
	const location = `/race/${params.id}/run/${run.id}`;

	throw redirect(302, location);
};
