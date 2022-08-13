import type { RequestHandler } from '@sveltejs/kit';
import { findNextPublicRace, registerRun, createOrUpdateRunner } from '$lib/strapi';

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

	const run = {
		chrono: '00:00:00.000',
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
				}
				break;
			case 'files':
				switch (fieldName) {
					case 'certificates':
						// case 'authorizations':
						attachments.push(value as File);
						runner[fieldName] = runner[fieldName] || [];
						runner[fieldName].push({
							__component: `medical.${fieldName.slice(0, -1)}`,
							...(fieldName === 'certificates' ? { expiration: new Date() } : null)
						});
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
  try {
    const { id } = await registerRun(run);
    
    return {
      status: 303,
			headers: {
				location: `/register/${id}`
			}
    };
  } catch (err: any) {
    return {
      status: err.status || 500,
      body: err
    }
  }
};
