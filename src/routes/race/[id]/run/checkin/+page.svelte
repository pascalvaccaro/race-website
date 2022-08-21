<script lang="ts">
	import type { PageData } from './$types';
	import QrCodeScanner from '$lib/components/QRCodeScanner.svelte';
	import RunForm from '$lib/components/RunForm.svelte';

	export let data: PageData;
	$: race = data.race as App.Race;

	let scanning = true;
	let registering = false;

	function onChangeMode(mode?: 'scanning' | 'registering' | null) {
		scanning = mode === 'scanning';
		registering = mode === 'registering';
	}
</script>

<main class="container">
	<section class="options">
		{#if scanning}
			<QrCodeScanner {race} />
		{:else if registering}
			<RunForm {race} />
		{/if}
	</section>
	<footer class="selector">
		<button on:click={() => onChangeMode('registering')}>Inscrire un nouveau participant</button>
		<button on:click={() => onChangeMode('scanning')}>Scanner un QR Code</button>
	</footer>
</main>

<style>
	main.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	section.options {
		flex-grow: 1;
		width: 100%;
	}
	footer.selector {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		height: 5rem;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.75);
		padding: 1rem;
	}
	footer.selector > button {
		max-width: 40%;
		padding: 1rem 2rem;
		border-radius: 1rem;
		font-weight: bold;
	}
</style>