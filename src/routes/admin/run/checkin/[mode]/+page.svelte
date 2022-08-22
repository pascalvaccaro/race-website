<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import QrCodeScanner from '$lib/components/QRCodeScanner.svelte';
	import RegisterForm from '$lib/components/RegisterForm.svelte';

	export let data: PageData;
	$: race = data.race as App.Race;
</script>

{#if $page.params.mode === 'scanner'}
	<QrCodeScanner />
{:else if $page.params.mode === 'runner'}
	<RegisterForm {race} />
{/if}
