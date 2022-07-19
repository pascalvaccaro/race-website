<script lang="ts">
	import { runners, hasOptions } from '$lib/store/runners';
	import { setRunner } from '$lib/store/run';

	export let name: string;

	function onChange(event: any) {
		const entry = $runners.find((entry) => entry.id === event.detail);
		if (entry) setRunner(entry);
	}
</script>

{#if $hasOptions}
	<select {name} on:change={onChange}>
		{#each $runners as entry}
			<option value={entry.id}>{entry.firstName} {entry.lastName}</option>
		{/each}
	</select>
{/if}

<div class:hidden={$hasOptions}>
	<slot />
</div>

<style>
	.hidden {
		display: none;
	}
</style>
