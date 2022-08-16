import { createOrUpdateRunner } from '$lib/strapi.back';

export const extractRegisterFormData = async (data: FormData) => {
	const run = {
		chrono: '00:00:00.000'
	} as App.Run;
	const runner = {} as App.Runner;
	const attachments = [] as File[];

	data.forEach((value, key) => {
		const [modelName, fieldName] = key.split('.');
		const strValue = value.toString();
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
				attachments.push(value as File);
				runner.attachments = runner.attachments ?? [];
				runner.attachments.push({
					__component: `attachments.${fieldName}`,
					valid: false
				});
				break;
		}
	});

	try {
		run.runner = await createOrUpdateRunner(runner, attachments);
		console.log('run.runner', run.runner);
	} catch (e: unknown) {
		const error = e as Error;
		console.error(error.message || error.toString());
		console.error(error.stack);
	}

	return run;
};
