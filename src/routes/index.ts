import type { RequestHandler } from '@sveltejs/kit';
import { FormData } from 'formdata-node';
import { createRunner, findNextPublicRace, registerRun, updateRunner } from '$lib/strapi';

export async function GET() {
	const race = await findNextPublicRace();
	if (!race)
		return {
			status: 404
		};

	return {
		body: { race }
	};
}

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();

	const run = {} as App.Run;
	const runner = {} as App.Runner;
	const runnerForm = new FormData();

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
					case 'firstName':
					case 'lastName':
					case 'email':
						runner[fieldName] = strValue;
						break;
					case 'id':
						runner.id = nbValue;
            run.runner = run.runner ?? {};
            run.runner.id = nbValue;
						break;
				}
				break;
			case 'files':
				switch (fieldName) {
					case 'attestations':
					case 'certificates':
						runnerForm.append(`files.attachment`, value);
						// case 'authorizations':
						runner[fieldName].push({
							__component: `medical.${fieldName.slice(0, -1)}`,
							...(fieldName === 'certificates' ? { expiration: new Date() } : { valid: false })
						});
						break;
				}
        break;
		}
	});

  const method = runner.id ? updateRunner : createRunner;
  runnerForm.append('data', JSON.stringify(runner));
  try {
    run.runner = await method(runnerForm, (runner.id ?? "").toString());
  } catch (e) {
    // nothing to do
  }
  try {
    const body = await registerRun(run);
    
    return {
      status: 201,
      body,
    };
  } catch (err: any) {
    return {
      status: err.status || 500,
      body: err
    }
  }
};
