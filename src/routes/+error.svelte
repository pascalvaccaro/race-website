<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	const load: Load = ({ error, status }) => ({
		props: {
			title: `${status}: ${error?.message ?? error?.toString()}`,
			stack: error?.stack || ''
		}
	});
	export { load };
</script>

<script lang="ts">
	import { dev } from '$app/env';
	export let title: string;
	export let stack: string;
</script>

<div>
	<h1>{title}</h1>
	{#if dev}
		<pre>{stack}</pre>
	{/if}
</div>

<style>
	div {
		max-width: 520px;
		min-height: 100vh;
	}
	h1,
	pre {
		color: white;
	}
</style>
