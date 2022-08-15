<script lang="ts">
	import { run, setRunner, needs } from '$lib/store/run';
  import SmartInput from './SmartInput.svelte';
	import FileInput from './FileInput.svelte';
	import CheckInput from './CheckInput.svelte';
	import RadioInput from './RadioInput.svelte';
	import Panel from './Panel.svelte';

  export let race: App.Race;
  export let parent: App.Runner | null = null;
	const pronoun = parent ? 'Il/elle' : 'Je';
  
  async function onChangeEmail(event: any) {
		const email = event.target.value;
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return;
		setRunner({ email });
	}
</script>

<form method="post" enctype="multipart/form-data">
  {#if parent}
	  <input type="hidden" name="runner.parent" value={parent.id} />
  {:else}
	  <input placeholder="Adresse email" type="email" name="runner.email" on:change={onChangeEmail} required />
  {/if}

	<SmartInput name="runnerId">
		<div class="two-cols">
			<input placeholder="Prénom" required name="runner.firstname" bind:value={$run.runner.firstname} />
			<input placeholder="Nom de famille" required name="runner.lastname" bind:value={$run.runner.lastname} />
		</div>
		<input type="hidden" name="run.runner" bind:value={$run.runner.id} />
		<input type="hidden" name="runner.id" bind:value={$run.runner.id} />
	</SmartInput>

  <div class="two-cols">
    <CheckInput name="run.walking" bind:value={$run.walking}>
      <span>{pronoun} marche <br/> <small>(et promet{parent ? '' : 's'} de ne pas courir !)</small></span>
		</CheckInput>
    <CheckInput name="run.copyright" bind:value={$run.copyright}>
      {pronoun} donne {parent ? 's' : 'm'}on droit à l'image
		</CheckInput>
  </div>

	{#if $needs.certificate}
		<label for="certificate">
			{parent ? 'S' : 'M'}on certificat médical datant d'il y a moins d'un an
			<FileInput name="files.certificate" required />
		</label>
	{/if}

	<Panel title={`${parent ? 'Il/elle est' : 'Je suis'} mineur-e et...`} bind:value={$run.runner.minor}>
		<div class="minor">
			<div class="two-cols">
				<RadioInput name="runner.child" value={false} bind:group={$run.runner.child}>
					{parent ? 'a' : 'ai'} entre 16 et 18 ans
				</RadioInput>
				<RadioInput name="runner.child" value={true} bind:group={$run.runner.child}>
					{parent ? 'a' : 'ai'} moins de 16 ans
				</RadioInput>
			</div>
			{#if $needs.authorization}
				<label for="authorization">
					{parent ? 'Son' : 'Mon'} autorisation parentale
					<FileInput name="files.authorization" required />
				</label>
			{:else if $needs.parents}
				<p class="alert">
					Les mineur-e-s de moins de 16 ans doivent impérativement être accompagné-e-s d'un adulte pendant toute la course !
				</p>
			{/if}
		</div>
	</Panel>

	<input type="hidden" name="run.race" value={race.id} />

	<button type="submit">{parent ? 'Confirmer' : "M'inscrire"}</button>
</form>

<style>
	form {
		min-height: 420px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}
	form > * {
		margin: 1rem 0;
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
