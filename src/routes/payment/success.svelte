<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Disclaimer from '$lib/components/Disclaimer.svelte';

	let transaction: unknown;
	const sessionId = $page.url.searchParams.get('sessionId');

	onMount(async () => {
		if (sessionId)
			transaction = await fetch(`/runners/donation/${sessionId}`).then((res) => res.json());
		console.debug(transaction);
	});
</script>

<Disclaimer>
	<h1>Merci pour votre don !</h1>
</Disclaimer>

<style>
	h1 {
		padding: 0 1rem;
	}
</style>
