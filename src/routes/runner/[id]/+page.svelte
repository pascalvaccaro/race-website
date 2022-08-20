<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/env';
	import dayjs from 'dayjs';
	import 'dayjs/locale/fr';
	import Highcharts, { type HTMLDOMElement, type Options } from 'highcharts';

	// Add dependencies
	export let data: PageData;
	$: runner = data.runner as App.Runner;
	$: runs =
		runner?.runs
			?.sort((a, b) => dayjs(a.race.startDate).diff(b.race.startDate))
			.map(({ chrono, race }) => {
				const start = dayjs(race.startDate + 'T' + race.startTime + 'Z');
				const input = chrono.split(':');
				let millis,
					hours,
					minutes,
					seconds = '';
				if (input.length === 3) {
					hours = input[0];
					minutes = input[1];
					seconds = input[2];
				} else if (input.length === 2) {
					hours = '00';
					minutes = input[0];
					seconds = input[1];
				}
				[seconds, millis] = seconds.split('.');
				const finish = start
					.add(Number(hours), 'hour')
					.add(Number(minutes), 'minute')
					.add(Number(seconds), 'second')
					.add(Number(millis), 'millisecond');
				return [start, finish] as const;
			}) ?? [];

	const highcharts = (node: HTMLDOMElement, config: Options) => {
		const redraw = true;
		const oneToOne = true;
		const chart = Highcharts.chart(node, config);

		return {
			update(config: Options) {
				chart.update(config, redraw, oneToOne);
			},
			destroy() {
				chart.destroy();
			}
		};
	};
	$: config = {
		title: {
			text: 'Évolution du chronomètre'
		},

		subtitle: {
			text: runner?.fullname
		},

		yAxis: {
			title: {
				text: 'Temps réalisé'
			},
			labels: {
				formatter: function () {
					return dayjs(this.value).toISOString().split('T')[1].slice(0, -5);
				}
			}
		},

		xAxis: {
			type: 'datetime',
			accessibility: {
				rangeDescription: 'Date de la course'
			},
			categories: runs?.map(([start]) => start.format('DD-MM-YYYY')) ?? []
		},

		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				}
			}
		},
		tooltip: {
			formatter: function () {
				return dayjs(this.y).toISOString().split('T')[1].slice(0, -5);
			}
		},

		series: [
			{
				type: 'line',
				name: runner?.fullname ?? 'Coureur',
				data: runs?.map(([start, finish]) => finish.diff(start)) ?? []
			}
		]
	} as Options;
</script>

{#if browser}
	<div class="chart" use:highcharts={config} />
{/if}

<style>
	.chart {
		max-width: 60%;
		overflow: auto;
	}
</style>
