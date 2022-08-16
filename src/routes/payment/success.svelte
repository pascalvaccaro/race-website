<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getPaymentDetail } from '$lib/utils/stripe';
	import Disclaimer from '$lib/components/Disclaimer.svelte';

	const sessionId = $page.url.searchParams.get('sessionId');
	onMount(() => {
		if (sessionId) getPaymentDetail(sessionId);
	});
</script>

<Disclaimer>
	<h1>Merci pour votre don !</h1>
</Disclaimer>
