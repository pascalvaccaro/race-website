<script lang="ts">
	import { browser } from '$app/env';
	import { getRaceStartDateTime } from '$lib/utils/date';
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import Panel from '$lib/components/Panel.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Form from '$lib/components/RegisterForm.svelte';
	import PaymentForm from '$lib/components/PaymentForm.svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
	$: run = data.run as App.Run;
	$: runner = data.runner ?? run.runner;

	const panels = {
		registerOthers: false,
		registerChild: false,
		makeAGift: false,
		share: false
	};
	const registerUrl = browser ? (globalThis.location ?? {}).origin + '/race/next' : '';
	$: startTime = getRaceStartDateTime(run.race as App.Race);
</script>

<Disclaimer>
	<h2 style="margin: 0;">
		Merci {runner.firstname} !
	</h2>
	<p style="margin: 0;">
		{#if runner.id === run.runner.id}
			Ton inscription
		{:else}
			L'inscription de {run.runner.firstname}
		{/if}
		est confirmée pour la course du {startTime} au parc {run.race.park.name}
	</p>
</Disclaimer>

<div class="options">
	<Panel title="Je souhaite inscrire d'autres personnes..." bind:value={panels.registerOthers}>
		<Panel title="En l'inscrivant moi-même..." bind:value={panels.registerChild}>
			<Form race={run.race} parent={runner} />
		</Panel>
		<Panel title="En partageant la course sur les réseaux sociaux..." bind:value={panels.share}>
			TODO
		</Panel>
		<Panel value={true}>
			<p slot="title">
				En envoyant le <a href={registerUrl} target="_blank">lien d'inscription</a>
			</p>
			<CopyButton slot="action" value={registerUrl} />
		</Panel>
	</Panel>

	<Panel title="Je souhaite faire un don..." bind:value={panels.makeAGift}>
		<PaymentForm />
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
