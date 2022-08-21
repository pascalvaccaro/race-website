<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Loading from './Loading.svelte';

	export let errors: Error | null;
	let loading = true;
	onMount(() => (loading = false));
	onDestroy(() => (loading = false));

	const redirectPathname = $page.url.searchParams.get('redirectPathname');
</script>

<form method="post" on:submit={() => (loading = true)}>
	{#if loading}
		<Loading />
	{:else if errors}
		<p>{errors.message}</p>
	{/if}
	{#if redirectPathname}
	<input type="hidden" name="redirectPathname" value={redirectPathname} />
	{/if}
	<input placeholder="Adresse email" type="email" name="email" required />

	<input placeholder="Mot de passe" type="password" name="password" required />

	<button type="submit">Me connecter</button>
</form>

<style>
	form {
		position: relative;
		min-height: 420px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}
	form > * {
		margin: 1rem 0;
	}
	input {
		padding: 8px 16px;
	}
	input {
		max-height: 1.5rem;
		padding: 8px;
		font-size: 1.25rem;
	}
	input::placeholder {
		font-size: 1rem;
		margin-bottom: 4px;
	}
	button {
		height: 2.5rem;
		text-transform: uppercase;
		font-size: 1.25rem;
		font-weight: bold;
		background-color: blue;
		color: white;
		cursor: pointer;
	}
</style>
