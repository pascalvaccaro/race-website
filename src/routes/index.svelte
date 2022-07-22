<script lang="ts">
	import { getRaceStartDateTime } from '$lib/utils/date';
	import Disclaimer from '$lib/components/Disclaimer.svelte';
	import Form from '$lib/components/RegisterForm.svelte';
	
	export let race: App.Race;
	const startTime = getRaceStartDateTime(race);
</script>

<Disclaimer>
	La prochaine course a lieu le {startTime} au parc {race.parcours.name}
</Disclaimer>

<Form raceId={race.id} />
