import { env } from '$env/dynamic/private';
import { fetchFactory } from './shared';
const { STRAPI_URL, STRAPI_API_TOKEN } = env;

export type StripeProduct = {
	id: string;
	title: string;
	stripePriceId: string;
	stripePlanId: string;
	isSubscription: boolean;
};
type StripeSession = { id?: number | string; url: string };
export type StripeTrx = {
	id: string;
	amount_total: number;
	payment_status: string;
	customer_details: {
		name: string;
		email: string;
	};
	metadata: {
		productId: string;
	};
};

const authFetch = fetchFactory(STRAPI_API_TOKEN, (res: Response) => res.json());

export async function checkOutProduct(product: StripeProduct) {
	const endpoint = new URL('/strapi-stripe/createCheckoutSession/', STRAPI_URL);

	const response = await authFetch<StripeSession>(endpoint, {
		method: 'post',
		body: JSON.stringify({
			stripePriceId: product.stripePriceId,
			stripePlanId: product.stripePlanId,
			isSubscription: product.isSubscription,
			productId: product.id,
			productName: product.title
		})
	});

	return response as { id: string; url: string };
}

//  storing product payment order in strapi logic

export async function getPaymentDetail(checkoutSessionId: string) {
	if (!checkoutSessionId) return null;
	const endpoint = new URL(
		'/strapi-stripe/retrieveCheckoutSession/' + checkoutSessionId,
		STRAPI_URL
	);
	const transaction = await authFetch<StripeTrx>(endpoint);

	if (transaction.payment_status === 'paid') {
		const endpoint = new URL('/strapi-stripe/stripePayment', STRAPI_URL);
		await authFetch(endpoint, {
			method: 'post',
			body: JSON.stringify({
				txnDate: new Date(),
				transactionId: transaction.id,
				isTxnSuccessful: true,
				txnMessage: transaction,
				txnAmount: transaction.amount_total / 100,
				customerName: transaction.customer_details.name,
				customerEmail: transaction.customer_details.email,
				stripeProduct: transaction.metadata.productId
			})
		});
	}

	return transaction;
}
