<script lang="ts">
	import dayjs from 'dayjs';
	import 'dayjs/locale/fr';
	import { run, setRunner, needs } from '$lib/store/run';
	import SmartInput from '$lib/components/SmartInput.svelte';
	import FileInput from '$lib/components/FileInput.svelte';
	import CheckInput from '$lib/components/CheckInput.svelte';
	import RadioInput from '$lib/components/RadioInput.svelte';
	import Panel from '$lib/components/Panel.svelte';

	export let race: App.Race;
	let startTime = dayjs(`${race.startDate}T${race.startTime}`).locale('fr').format('dddd D MMMM [à] H [heures]');

	async function onChangeEmail(event: any) {
		const email = event.target.value;
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return;
		setRunner({ email });
	}
</script>

<form method="post">
	<h2 class="disclaimer">
		La prochaine course a lieu le {startTime} au parc {race.parcours.name}
	</h2>
	<input placeholder="Adresse email" type="email" required name="runner.email" on:change={onChangeEmail} />

	<SmartInput name="runnerId">
		<div class="two-cols">
			<input placeholder="Prénom" required name="runner.firstName" bind:value={$run.runner.firstName} />
			<input placeholder="Nom de famille" required name="runner.lastName" bind:value={$run.runner.lastName} />
		</div>
		<input type="hidden" name="run.runner" bind:value={$run.runner.id} />
		<input type="hidden" name="runner.id" bind:value={$run.runner.id} />
	</SmartInput>

  <div class="two-cols">
    <CheckInput name="run.walking" bind:value={$run.walking}>
      <span>Je marche <br/> <small>(et promets de ne pas courir !)</small></span>
		</CheckInput>
    <CheckInput name="run.copyright" bind:value={$run.copyright}>
      Je donne mon droit à l'image
		</CheckInput>
  </div>

	{#if $needs.certificate}
		<label for="certificate">
			Mon certificat médical datant d'il y a moins d'un an
			<FileInput name="files.certificates" required />
		</label>
	{/if}

	<Panel title="Je suis mineur et..." bind:value={$run.runner.minor}>
		<div class="two-cols">
			<RadioInput name="runner.child" value={false} bind:group={$run.runner.child}>
				j'ai entre 16 et 18 ans
			</RadioInput>
			<RadioInput name="runner.child" value={true} bind:group={$run.runner.child}>
				j'ai moins de 16 ans
			</RadioInput>
		</div>
		{#if $needs.authorization}
			<label for="authorization">
				Mon autorisation parentale
				<FileInput name="files.authorizations" required />
			</label>
		{:else if $needs.parents}
			<p class="alert">
				Les mineur-es de moins de 16 ans doivent impérativement être accompagné-es d'un adulte pendant toute la course !
			</p>
		{/if}
	</Panel>

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
	label, input {
		padding: 8px 16px;
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
