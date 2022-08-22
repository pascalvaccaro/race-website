<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import type { StripeProduct } from '$lib/strapi/stripe';

	let products: StripeProduct[] = [];
	onMount(() =>
		fetch(`${env.PUBLIC_STRAPI_URL}/strapi-stripe/getProduct/0/100/price/asc`)
			.then((res) => res.json())
			.then((res) => (products = res.data as StripeProduct[]))
	);

	async function selectProduct(product: StripeProduct) {
		await fetch('/payment', {
			method: 'POST',
			body: JSON.stringify(product),
			headers: { 'Content-Type': 'application/json' }
		})
			.then((res) => res.json())
			.then((res) => (res.id ? window.location.replace(res.url) : undefined));
	}
</script>

<div class="container">
	{#each products as product}
		<button type="button" on:click={() => selectProduct(product)}>
			{product.title}
		</button>
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.container > button {
		margin: 1rem;
		padding: 1rem;
		outline: none;
	}
</style>
