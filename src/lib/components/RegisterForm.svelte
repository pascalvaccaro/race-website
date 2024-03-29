<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { run, setRunner, needs } from '$lib/store/run';
	import SmartInput from './SmartInput.svelte';
	import FileInput from './FileInput.svelte';
	import CheckInput from './CheckInput.svelte';
	import RadioInput from './RadioInput.svelte';
	import Panel from './Panel.svelte';
	import Loading from './Loading.svelte';
	import TwoCols from './TwoCols.svelte';

	export let race: App.Race;
	export let parent: App.Runner | null = null;
	const pronoun = parent ? 'Il/elle' : 'Je';
	let loading = true;
	onMount(() => (loading = false));
	onDestroy(() => (loading = false));
</script>

<form method="post" enctype="multipart/form-data" on:submit={() => (loading = true)}>
	{#if loading}
		<Loading />
	{/if}
	{#if parent}
		<input type="hidden" name="runner.parent" value={parent.id} />
	{:else}
		<input
			placeholder="Adresse email"
			type="email"
			name="runner.email"
			on:change={(e) => setRunner({ email: (e.currentTarget.value ?? '').trim() })}
			required
		/>
	{/if}

	<SmartInput name="runnerId">
		<TwoCols>
			<input
				slot="left"
				placeholder="Prénom"
				required
				name="runner.firstname"
				bind:value={$run.runner.firstname}
			/>
			<input
				slot="right"
				placeholder="Nom de famille"
				required
				name="runner.lastname"
				bind:value={$run.runner.lastname}
			/>
		</TwoCols>
		<input type="hidden" name="run.runner" bind:value={$run.runner.id} />
	</SmartInput>

	<CheckInput name="run.walking" bind:value={$run.walking}>
		<p style="margin: 0;">{pronoun} marche</p>
		<small>(et {parent ? 's' : 'm'}'engage à ne pas courir sur l'ensemble du parcours)</small>
	</CheckInput>
	<CheckInput name="run.copyright" bind:value={$run.copyright} required>
		<p style="margin: 0;">{parent ? 'Il ' : "J'"}accepte le <a href="/assets/reglement.pdf" target="_blank">réglement de la course A Ton Allure</a></p>
	</CheckInput>

	{#if $needs.certificate}
		<label for="certificate">
			{parent ? 'S' : 'M'}on certificat médical datant d'il y a moins d'un an
			<FileInput name="files.certificate" required />
		</label>
	{/if}

	<Panel
		title={`${parent ? 'Il/elle est' : 'Je suis'} mineur-e et...`}
		bind:value={$run.runner.minor}
	>
		<div class="minor">
			<TwoCols>
				<RadioInput slot="left" name="runner.child" value={false} bind:group={$run.runner.child}>
					<small>{parent ? 'il/elle a' : "j'ai"} entre 16 et 18 ans</small>
				</RadioInput>
				<RadioInput slot="right" name="runner.child" value={true} bind:group={$run.runner.child}>
					<small>{parent ? 'il/elle a' : "j'ai"} moins de 16 ans</small>
				</RadioInput>
			</TwoCols>
			{#if $needs.authorization}
				<label for="authorization">
					{parent ? 'Son' : 'Mon'} autorisation parentale
					<FileInput name="files.authorization" required />
				</label>
			{:else if $needs.parents}
				<p class="alert">
					Les mineur-e-s de moins de 16 ans doivent impérativement être accompagné-e-s d'un adulte
					pendant toute la course !
				</p>
			{/if}
		</div>
	</Panel>

	<input type="hidden" name="run.race" value={race.id} />

	<button type="submit">{parent ? 'Confirmer' : "M'inscrire"}</button>
</form>

<style>
	form {
		width: 100%;
		position: relative;
		min-height: 420px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 1rem;
	}
	label,
	input {
		padding: 8px 16px;
		width: 100%;
		min-height: 3rem;
		box-sizing: border-box;
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
	div.minor {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		margin: 0.5rem 0;
	}
</style>
