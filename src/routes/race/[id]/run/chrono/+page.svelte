<script lang="ts">
	import dayjs, { type Dayjs } from 'dayjs';
	import 'dayjs/locale/fr';
	import { startTime, setStartTime } from '$lib/store/race';
	import Loading from '$lib/components/Loading.svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
	$: race = data.race as App.Race;
	let throttleTime: Dayjs | null;
	let timesMap: Map<number, number[]> = new Map<number, number[]>();
	let lastRuns: Array<Partial<App.Run>> = [];

	let inputVal = '';
	let interval: number;
	const defaultChrono = '00:00.000';
	let chrono = defaultChrono;
	let loading = false;

	const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', '<'];

	function onReset() {
		if (interval >= 0) clearInterval(interval);
		setStartTime(null);
		chrono = defaultChrono;
	}
	function onStart() {
		onReset();
		timesMap.clear();
		lastRuns = [];
		setStartTime(dayjs());
		chrono = defaultChrono;
		interval = setInterval(() => {
			const now = dayjs();
			const time = now.diff($startTime);
			chrono = dayjs(time).format('mm:ss.SSS');
		}, 100) as unknown as number;
	}
	async function onStop(doExportRuns?: boolean) {
		if (doExportRuns) await exportRuns(race);
		onReset();
	}

	async function exportRuns(race: App.Race) {
		loading = true;
		const { runs, id } = race;
		const data = [] as Pick<App.Run, 'chrono' | 'numberSign'>[];
		for (const [numberSign, times] of timesMap.entries()) {
			if (!times || !times.length) continue;
			const lastTime = times[times.length - 1];
			if (!lastTime || lastTime <= 0) continue;
			const run = runs.find((r) => r.numberSign === numberSign);
			const chrono = dayjs(lastTime).format('mm:ss.SSS');
			if (!run) data.push({ numberSign, chrono });
			else data.push({ ...run, chrono });
		}
		await fetch(`/race/${id}/chrono`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ data })
		});
		loading = false;
		timesMap = new Map<number, number[]>();
	}

	function registerTime() {
		const now = dayjs();
		return (numberSign: number) => {
			if (!$startTime) throw new Error('no start time set');
			if (!numberSign || isNaN(numberSign)) throw new Error('invalid number sign');
			const time = now.diff($startTime.add(now.diff(throttleTime ?? now)));
			const chrono = dayjs(time).format('mm:ss.SSS');
			const times = timesMap.get(numberSign) ?? [];
			timesMap = timesMap.set(numberSign, [...times, time]);
			lastRuns = [{ numberSign, chrono }, ...lastRuns];
		};
	}

	function onSubmit() {
		if (!$startTime) throw new Error('no start time set');
		inputVal.split(',').filter(Boolean).map(Number).forEach(registerTime());
		inputVal = '';
		throttleTime = null;
	}
	function onInputDigit(digit: string) {
		if (!$startTime) return;
		if (!digits.includes(digit)) return;

		if (inputVal.length === 0) {
			if (digit === ',') return;
			throttleTime = dayjs();
		}
		if (digit === '<') inputVal = inputVal.slice(0, -1);
		else inputVal += digit;
	}
	function onRemove(run: Partial<App.Run>) {
		return () => {
			if (!run || !run.numberSign) return;
			lastRuns = lastRuns.filter(
				(l) => !(l.chrono === run.chrono && l.numberSign === run.numberSign)
			);
			const times = timesMap.get(run.numberSign) ?? [];
			timesMap.set(
				run.numberSign,
				times.filter((t) => dayjs(t).format('mm:ss.SSS') !== run.chrono)
			);
		};
	}
</script>

<div class="container">
	<section>
		<ul class="scores">
			{#each lastRuns as run}
				<li>
					<p>#{run.numberSign} {run.chrono}</p>
					<button class="red" on:click={onRemove(run)}>X</button>
				</li>
			{/each}
		</ul>
		<div class="chrono">
			{#if inputVal}
				{#each inputVal.split(',') as input}
					<span class="badge">{input}</span>
				{/each}
			{/if}
			{chrono}
		</div>
		<div class="digits">
			{#each digits as digit}
				<button class="digit" on:click={() => onInputDigit(digit)}>{digit}</button>
			{/each}
		</div>

		{#if loading}
			<Loading />
		{:else if chrono !== defaultChrono}
			<button class="fullWidth" on:click={onSubmit}>Enregistrer</button>
		{:else if timesMap.size > 0}
			<button class="fullWidth" on:click={() => onStop(true)}>Terminer</button>
		{:else}
			<button class="fullWidth" on:click={onStart}>Démarrer</button>
		{/if}
	</section>

	<footer class="operations">
		{#if chrono !== defaultChrono}
			<button on:click={() => onStop()}>Stop</button>
		{:else if timesMap.size > 0}
			<button on:click={onStart}>Redémarrer</button>
		{/if}
	</footer>
</div>

<style>
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.container > *,
	.container > section > * {
		width: 100%;
		margin: 0.5rem 0;
	}
	.container * {
		box-sizing: border-box;
	}
	.container > section {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 6rem);
	}
	.scores {
		flex-grow: 1;
		width: 100%;
		list-style: none;
		list-style-type: none;
		padding: 1rem;
		padding-bottom: 2rem;
		overflow-y: auto;
		background-color: rgba(255, 255, 255, 0.65);
	}
	.scores > li {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin: 0;
		margin-bottom: 0.25rem;
		border-bottom: 1px dashed black;
		padding: 0.5rem;
	}
	.scores > li > p {
		background-color: white;
		padding: 0.25rem;
		border-radius: 8px;
		margin: 0;
	}
	.scores > li > button {
		width: 1.5rem;
		height: 1.5rem;
		margin-left: 0.5rem;
		box-shadow: none;
		border-radius: 50%;
		flex-shrink: 1;
	}
	div.chrono {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem 1rem;
		margin: 0;
		min-height: 2.75rem;
		background-color: black;
		color: white;
	}
	.badge {
		border-radius: 25%;
		background-color: white;
		color: black;
		padding: 4px;
		margin-right: 8px;
	}
	.digits {
		display: grid;
		grid-template-rows: repeat(4, 1fr);
		grid-template-columns: repeat(3, 1fr);
		grid-column-gap: 0.5rem;
		grid-row-gap: 0.25rem;
		width: 100%;
	}
	.digits > button.digit {
		width: 100%;
		min-height: 4rem;
		margin: 0;
		padding: 0;
		font-size: 2rem;
		font-weight: bold;
	}
	button.digit:active {
		background-color: blue;
		color: white;
	}

	button.fullWidth {
		height: 4rem;
		width: 100%;
		padding: 1rem;
		background-color: blue;
		color: white;
		font-size: 2rem;
		font-weight: bold;
	}

	.operations {
		width: 100%;
		min-height: 5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.operations > button {
		width: 50%;
		height: 3rem;
		padding: 0.5rem 1rem;
		border: 1px solid white;
		text-align: center;
		color: black;
		font-size: large;
		font-weight: 500;
		background-color: lightgray;
		text-transform: uppercase;
		margin-bottom: 2rem;
	}
	.red {
		color: red;
	}
</style>
