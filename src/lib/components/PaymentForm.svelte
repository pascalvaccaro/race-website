<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { checkOutProduct } from '$lib/utils/stripe';
	import type { StripeProduct } from '$lib/utils/stripe';

	let products: StripeProduct[] = [];
	onMount(() =>
		fetch(`${env.PUBLIC_STRAPI_URL}/strapi-stripe/getProduct/0/100/price/asc`)
			.then((res) => res.json())
			.then((res) => (products = res.res as StripeProduct[]))
	);
</script>

<div class="container">
	{#each products as product}
		<button type="button" on:click={() => checkOutProduct(product)}>
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
