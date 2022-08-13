import type { RequestHandler } from '@sveltejs/kit';
import { findNextPublicRace, registerRun, createOrUpdateRunner } from '$lib/strapi';
import { extractRegisterFormData } from '$lib/utils/form';

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
	try {
		const data = await request.formData();
		const run = await extractRegisterFormData(data as any);
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
