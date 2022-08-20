import { createOrUpdateRunner } from '$lib/strapi/register';

export const extractRegisterFormData = async (data: FormData) => {
	const run = {
		chrono: '00:00:00.000'
	} as App.Run;
	const runner = {} as App.Runner;
	const attachments = [] as { file: File; fieldName: string }[];

	data.forEach((value, key) => {
		const [modelName, fieldName] = key.split('.');
		const strValue = value.toString().trim();
		if (!strValue) return;

		const nbValue = !isNaN(+strValue) ? +strValue : 0;
		const boolValue = strValue === 'on';
		switch (modelName) {
			case 'run':
				switch (fieldName) {
					case 'walking':
					case 'copyright':
						run[fieldName] = boolValue;
						break;
					case 'runner':
						runner.id = nbValue;
						// @ts-expect-error run.runner is a number
						run[fieldName] = nbValue;
						break;
					case 'race':
						// @ts-expect-error run.race is a number
						run[fieldName] = nbValue;
						break;
				}
				break;
			case 'runner':
				switch (fieldName) {
					case 'minor':
					case 'child':
						runner[fieldName] = boolValue;
						break;
					case 'firstname':
					case 'lastname':
					case 'email':
						runner[fieldName] = strValue;
						break;
					case 'parent':
						runner.parent = nbValue;
						run.runner = run.runner ?? {};
						run.runner.parent = nbValue;
						break;
				}
				break;
			case 'files':
				attachments.push({
					fieldName,
					file: value as File,
				});
				break;
		}
	});

	try {
		run.runner = await createOrUpdateRunner(runner, attachments);
	} catch (e: unknown) {
		const error = e as Error;
		console.error(error.message || error.toString());
		console.error(error.stack);
	}

	return run;
};
