<script lang="ts">
	import { getRaceStartDateTime } from '$lib/utils/date';
  import Disclaimer from '$lib/components/Disclaimer.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import Form from '$lib/components/RegisterForm.svelte';
  
  export let run: App.Run;
  export let runner: App.Runner = run.runner;
  let registerChild = false;
  let makeAGift = false;
	const startTime = getRaceStartDateTime(run.race);
</script>

<Disclaimer>
  Merci {runner.firstName || run.runner.firstName} ! Ton inscription est confirmée pour la course du {startTime} au parc {run.race.parcours.name}
</Disclaimer>

<div class="options">
  <Panel title="Je souhaite inscrire une autre personne..." bind:value={registerChild}>
    <Form raceId={run.race.id} parent={runner || run.runner} />
  </Panel>

  <Panel title="Je souhaite faire un don..." bind:value={makeAGift}>
    to do
  </Panel>
</div>

<style>
  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 1;
    max-height: 65%;
    padding: 8px 16px;
  }
</style>