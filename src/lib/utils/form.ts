import { createOrUpdateRunner } from "$lib/strapi";
import { writeFile } from 'node:fs/promises';

export const extractRegisterFormData = async (data: FormData) => {
  const run = {
		chrono: '00:00:00.000',
	} as App.Run;
	const runner = {} as App.Runner;
	const attachments = [] as string[];
	console.log(Object.entries(data));

	data.forEach((value, key, parent) => {
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
					case 'race':
						// @ts-expect-error run.runner is a number
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
					case 'id':
						runner.id = nbValue;
						run.runner = run.runner ?? {};
						run.runner.id = nbValue;
						break;
					case 'parent':
						runner.parent = nbValue;
						run.runner = run.runner ?? {}
						run.runner.parent = nbValue;
						break;
				}
				break;
			case 'files':
				switch (fieldName) {
					case 'authorization':
						attachments.push(value as string);
						runner[fieldName] = runner[fieldName] || {};
						runner[fieldName] = {
							__component: `attachments.${fieldName}`,
						};
						break;
					case 'certificate':
						attachments.push(value as string);
						runner[fieldName] = runner[fieldName] || {} as App.Runner['authorization'];
						runner[fieldName] = {
							__component: `attachments.certifificate`,
							expiration: null,
							valid: false
						};
						break;
				}
				break;
		}
	});

  
  try {
    run.runner = await createOrUpdateRunner({ runner, attachments });
  } catch (e: any) {
    console.error(e.message || e);
    console.error(e.stack);
  }

  return run;
};
