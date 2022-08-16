import { env } from '$env/dynamic/public';

const { PUBLIC_STRAPI_URL: baseUrl } = env;

export type StripeProduct = {
	id: number | string;
	title: string;
	stripePriceId: string | number;
	stripePlanId: string | number;
	isSubscription: boolean;
};
type StripeSession = { id?: number | string; url: string };

export async function checkOutProduct(product: StripeProduct) {
	const checkoutSessionUrl = baseUrl + '/strapi-stripe/createCheckoutSession/';

	const response = await fetch(checkoutSessionUrl, {
		method: 'post',
		body: JSON.stringify({
			stripePriceId: product.stripePriceId,
			stripePlanId: product.stripePlanId,
			isSubscription: product.isSubscription,
			productId: product.id,
			productName: product.title
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then<StripeSession>((res) => res.json());
	if (response.id) {
		window.location.replace(response.url);
	}
}

//  storing product payment order in strapi logic

export async function getPaymentDetail(checkoutSessionId: string) {
	const retrieveCheckoutSessionUrl =
		baseUrl + '/strapi-stripe/retrieveCheckoutSession/' + checkoutSessionId;
	const transaction = await fetch(retrieveCheckoutSessionUrl, {
		method: 'get',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => res.json());

	if (transaction.payment_status === 'paid') {
		if (
			window.performance
				.getEntriesByType('navigation')
				.map((nav) => nav.entryType)
				.includes('reload')
		) {
			console.info('website reloaded');
		} else {
			// store payment in strapi
			const stripePaymentUrl = baseUrl + '/strapi-stripe/stripePayment';
			await fetch(stripePaymentUrl, {
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
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	}

	return transaction;
}
