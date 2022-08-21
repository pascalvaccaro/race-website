<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import QrCodeScanner from '$lib/components/QRCodeScanner.svelte';
	import RunForm from '$lib/components/RunForm.svelte';

	export let data: PageData;
	$: race = data.race as App.Race;
</script>

<section class="options">
	{#if $page.params.mode === 'scanner'}
		<QrCodeScanner />
	{:else if $page.params.mode === 'runner'}
		<RunForm {race} />
	{/if}
</section>

<style>
	section.options {
		flex-grow: 1;
		width: 100%;
	}
</style>
