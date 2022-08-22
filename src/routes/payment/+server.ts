import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkOutProduct, type StripeProduct } from '$lib/strapi/stripe';

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const params: StripeProduct = await request.json();
		const checkoutSuccessUrl = url.origin + '/payment/success';
		const checkoutCancelUrl = url.origin + '/payment/cancel';
		const response = await checkOutProduct(params, { checkoutSuccessUrl, checkoutCancelUrl });

		return json(response);
	} catch (err: any) {
		throw error(400, err.message ?? err.toString());
	}
};
