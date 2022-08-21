import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { checkOutProduct, type StripeProduct } from '$lib/strapi/stripe';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const params: StripeProduct = await request.json();
		const response = await checkOutProduct(params);

		return json(response);
	} catch (err: any) {
		throw error(400, err.message ?? err.toString());
	}
};
