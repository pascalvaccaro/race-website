<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: race = data.race as App.Race;
</script>

<div />
