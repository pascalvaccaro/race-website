<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Loading from './Loading.svelte';

	let scanning = false;
	let loading = false;

	let html5Qrcode: InstanceType<typeof Html5Qrcode>;

	onMount(init);

	function init() {
		html5Qrcode = new Html5Qrcode('reader');
	}

	function start() {
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 500 }
			},
			onScanSuccess,
			onScanFailure
		);
		scanning = true;
	}

	async function stop() {
		await html5Qrcode.stop();
		scanning = false;
	}

	async function onScanSuccess(decodedText: string) {
		html5Qrcode.pause(true);
		loading = true;
		try {
			const body = JSON.stringify(JSON.parse(decodedText));
			const res = await fetch($page.url.pathname, {
				method: 'POST',
				body,
				headers: { 'Content-Type': 'application/json' }
			});
			loading = false;
			if (res.redirected) window.location.assign(res.url);
		} catch (err) {
			console.error(err);
			return;
		} finally {
			loading = false;
			html5Qrcode.resume();
		}
	}

	function onScanFailure(error: unknown) {
		console.warn(`Code scan error = ${error}`);
	}
</script>

<main>
	{#if loading}
		<Loading />
	{/if}
	<reader id="reader" />
	{#if scanning}
		<button on:click={stop}>stop</button>
	{:else}
		<button on:click={start}>start</button>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
	reader {
		margin-top: 2rem;
		width: 100%;
		min-height: 500px;
		background-color: rgba(0, 0, 0, 0.5);
		border: 1px solid white;
	}

	button {
		text-transform: uppercase;
		padding: 1rem 2rem;
		font-size: large;
		font-weight: bold;
		background-color: blue;
		color: white;
	}
</style>
