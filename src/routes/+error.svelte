<script lang="ts">
	import { dev } from '$app/env';
	import { page } from '$app/stores';
</script>

<div>
	<h1>{$page.error.message}</h1>
	{#if dev}
		<pre>{$page.error.status}</pre>
		<pre>{$page.error.stack}</pre>
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
