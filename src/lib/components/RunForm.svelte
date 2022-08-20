<script lang="ts">
	import SmartInput from './SmartInput.svelte';
	import CheckInput from './CheckInput.svelte';
	import Panel from './Panel.svelte';
	import RadioInput from './RadioInput.svelte';
	import Loading from './Loading.svelte';
	import { run, setRunner } from '$lib/store/run';

	export let race: App.Race;
	let loading = false;
</script>

<form method="post" on:submit={() => (loading = true)}>
	{#if loading}
		<Loading />
	{/if}
	<input
		placeholder="Adresse email"
		type="email"
		name="runner.email"
		on:change={(e) => setRunner({ email: (e.currentTarget.value ?? '').trim() })}
		required
	/>

	<SmartInput name="runnerId">
		<div class="two-cols">
			<input
				placeholder="Prénom"
				required
				name="runner.firstname"
				bind:value={$run.runner.firstname}
			/>
			<input
				placeholder="Nom de famille"
				required
				name="runner.lastname"
				bind:value={$run.runner.lastname}
			/>
		</div>
		<input type="hidden" name="run.runner" bind:value={$run.runner.id} />
	</SmartInput>

  <input type="hidden" name="run.race" value={race.id} />
	<div class="two-cols">
		<CheckInput name="run.walking" bind:value={$run.walking}>
			<span>Marche</span>
    </CheckInput>
		<CheckInput name="run.copyright" bind:value={$run.copyright}>
			Droit à l'image
		</CheckInput>
	</div>

	<Panel
		title="Mineur..."
		bind:value={$run.runner.minor}
	>
		<div class="minor">
			<div class="two-cols">
				<RadioInput name="runner.child" value={false} bind:group={$run.runner.child}>
					entre 16 et 18 ans
				</RadioInput>
				<RadioInput name="runner.child" value={true} bind:group={$run.runner.child}>
					moins de 16 ans
				</RadioInput>
			</div>
		</div>
	</Panel>

	<button type="submit">Confirmer</button>
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
	div.minor > * {
		margin-bottom: 0.5rem;
	}
	div.minor {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
