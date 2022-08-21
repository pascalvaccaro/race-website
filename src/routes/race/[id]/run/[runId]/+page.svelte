<script lang="ts">
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: run = data.run as App.Run;
</script>

<Disclaimer>
	<h3>{run.runner.fullname} a le numéro</h3>
	<h1>{run.numberSign}</h1>
</Disclaimer>
<a href={`/race/${run.race.id}/run/checkin`}>Retour au scanner</a>

<style>
	h3, h1 {
		padding: 0.5rem 1rem;
	}
	h1 {
		font-size: 60px;
		margin: 4rem 0;
	}

	a {
		text-decoration: none;
		margin: 1rem;
		border-radius: 0.5rem;
		color: black;
		background: lightgray;
		padding: 1rem 2rem;
		width: calc(100% - 6rem);
		text-align: center;
		position: absolute;
		bottom: 0;
		margin-bottom: 2rem;
	}

</style>
