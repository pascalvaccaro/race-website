import { error, type Action } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getRun, getRunner, registerRun } from '$lib/strapi/register';
import { extractRegisterFormData } from '$lib/utils/form';

export const load: PageServerLoad<{ run: App.Run; runner: App.Runner | null }> = async ({
	params,
	url
}) => {
	const { run: id } = params;
	const run = await getRun(id);
	if (!run) throw error(404);

	const parentId = url.searchParams.get('parentId');
	if (parentId && String(run.runner.id) !== parentId) {
		const runner = await getRunner(parentId);
		return { run, runner };
	}
	return { run, runner: null };
};

export const POST: Action<{ run: string }> = async ({ request }) => {
	const body = await request.formData();
	const data = await extractRegisterFormData(body);
	const parent = (data.runner?.parent as App.Runner)?.id ?? null;
	const run = await registerRun(data);

	return {
		location: `/register/${run.id}${parent ? '?parentId=' + parent : ''}`
	};
};
