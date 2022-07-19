<script lang="ts">
	import { run, setRunner, needs } from '$lib/store/run';
	import SmartInput from '$lib/components/SmartInput.svelte';
	import FileInput from '$lib/components/FileInput.svelte';

	export let race: App.Race;

	async function onChangeEmail(event: any) {
		const email = event.target.value;
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return;
		setRunner({ email });
	}
</script>

<form method="post">
	<h2 class="disclaimer">
		La prochaine course a lieu le {race.startDate} à {race.startTime} au parc {race.parcours.name}
	</h2>
	<input placeholder="Ton adresse email" type="email" name="runner.email" on:change={onChangeEmail} />

	<SmartInput name="runnerId">
		<div class="two-cols">
			<input placeholder="Ton prénom" name="runner.firstName" bind:value={$run.runner.firstName} />
			<input placeholder="Ton nom de famille" name="runner.lastName" bind:value={$run.runner.lastName} />
		</div>
		<input type="hidden" name="run.runner" bind:value={$run.runner.id} />
		<input type="hidden" name="runner.id" bind:value={$run.runner.id} />
	</SmartInput>

  <div class="two-cols">
    <label>
      Je marche (et promets de ne pas courir !)
      <input type="checkbox" name="run.walking" bind:checked={$run.walking} />
    </label>
    <label>
      Je donne mon droit à l'image
      <input type="checkbox" name="run.copyright" bind:checked={$run.copyright} />
    </label>
  </div>
  <div class="two-cols">
    <label>
      Je suis mineur
      <input type="checkbox" name="runner.minor" bind:checked={$run.runner.minor} />
    </label>
    <label>
      Je suis mineur et j'ai moins de 16 ans
      <input type="checkbox" name="runner.child" bind:checked={$run.runner.child} />
    </label>
  </div>

	{#if $needs.attestation}
		<label for="attestation">
			Mon attestation de marche
			<FileInput name="files.attestations" />
		</label>
	{:else if $needs.certificate}
		<label for="certificate">
			Mon certificat médical datant d'il y a moins d'un an
			<FileInput name="files.certificates" />
		</label>
	{/if}
	{#if $needs.authorization}
		<label for="authorization">
			Mon autorisation parentale
			<FileInput name="files.authorizations" />
		</label>
	{/if}

	<input type="hidden" name="run.race" value={race.id} />

	<button type="submit">M'inscrire</button>
</form>

<style>
	form {
		width: 420px;
		min-height: 600px;
		padding: 16px;
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;
		background-color: aquamarine;
		grid-gap: 1rem;
	}
  .disclaimer {
    margin: 0;
    text-align: center;
  }
	label,
	input {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		padding: 8px 16px;
		min-height: 1rem;
    box-shadow: 1px 1px 1px;
    outline: none;
    border-radius: 4px;
    border: 0;
	}
  input {
    max-height: 1.5rem;
    padding: 8px;
    font-size: 1.25rem;
  }
  input::placeholder {
    font-size: 1rem;
    font-style: italic;
    margin-bottom: 4px;
  }

	.two-cols {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
    width: 100%;
	}
	.two-cols > *:last-child {
		margin-left: 8px;
	}
	.two-cols > *:first-child {
		margin-right: 8px;
	}
	.two-cols > * {
		width: calc(50% - 32px);
	}

	button {
		height: 2.5rem;
		text-transform: uppercase;
		font-size: 1.25rem;
		font-weight: bold;
    background-color: black;
    color: white;
    cursor: pointer;
	}
</style>
