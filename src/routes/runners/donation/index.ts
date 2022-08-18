import type { RequestHandler } from '@sveltejs/kit';
import { checkOutProduct, type StripeProduct } from '$lib/strapi/stripe';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const params = (await request.json()) as StripeProduct;
		const response = await checkOutProduct(params);

		return { body: response };
	} catch (err: any) {
		return {
			status: 500,
			body: err.message ?? err.toString()
		};
	}
};
