<script lang="ts">
	import { getRaceStartDateTime } from '$lib/utils/date';
  import Disclaimer from '$lib/components/Disclaimer.svelte';
  import Panel from '$lib/components/Panel.svelte';
  import CopyButton from '$lib/components/CopyButton.svelte';
  import Form from '$lib/components/RegisterForm.svelte';
  
  export let run: App.Run;
  export let runner: App.Runner = run.runner;
  const panels = {
    registerOthers: false,
    registerChild: false,
    makeAGift: false,
    share: false,
  };
  let registerUrl = 'http://localhost:5173';
	const startTime = getRaceStartDateTime(run.race);
</script>

<Disclaimer>
  Merci {runner.firstname} !
  {#if runner.id === run.runner.id}
    Ton inscription
  {:else}
    L'inscription de {run.runner.firstname}
  {/if}
  est confirmée pour la course du {startTime} au parc {run.race.park.name}
</Disclaimer>

<div class="options">
  <Panel title="Je souhaite inscrire d'autres personnes..." bind:value={panels.registerOthers}>
    <Panel title="En l'inscrivant moi-même..." bind:value={panels.registerChild}>
      <Form raceId={run.race.id} parent={runner || run.runner} pronoun="Il/elle" />
    </Panel>
    <Panel title="En partageant la course sur les réseaux sociaux..." bind:value={panels.share}>
      TODO
    </Panel>
    <Panel>
      <p slot="title">
          En envoyant le <a href={registerUrl} target="_blank">lien d'inscription</a>
      </p>
      <CopyButton slot="action" value={registerUrl} />
    </Panel>
  </Panel>

  <Panel title="Je souhaite faire un don..." bind:value={panels.makeAGift}>
    TODO
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
    width: 100%;
  }
</style>