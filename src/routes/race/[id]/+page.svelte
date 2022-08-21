<script lang="ts">
	import type { PageData } from './$types';
	
	import { getRaceStartDateTime } from '$lib/utils/date';
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import Form from '$lib/components/RegisterForm.svelte';
	
	export let data: PageData;
	$: race = data.race as App.Race;
	$: startTime = getRaceStartDateTime(race);
</script>

<Disclaimer>
	<h2 style="margin: 0;">La prochaine course a lieu le {startTime} au parc {race.park.name}</h2>
</Disclaimer>

<Form {race} />
