import { stringify } from 'qs';
import { env } from '$env/dynamic/private';
import { fetchFactory } from './shared';

const { STRAPI_URL, STRAPI_API_TOKEN } = env;
const authFetch = fetchFactory(STRAPI_API_TOKEN);

export const getRace = async (id: string) => {
	const endpoint = new URL('/api/races/' + id, STRAPI_URL);
	endpoint.search = stringify({
		populate: ['runs', 'runs.runner', 'park']
	});
	return authFetch<App.Race>(endpoint);
};

export const createRun =
	(race: string | number) => async (run: Pick<App.Run, 'numberSign' | 'chrono'>) => {
		const endpoint = new URL('/api/runs', STRAPI_URL);
		const options = {
			method: 'POST',
			body: JSON.stringify({ data: { ...run, race } })
		};
		return authFetch<App.Run>(endpoint, options);
	};

export const updateRun = (race: string | number) => async (run: App.Run) => {
	const endpoint = new URL('/api/runs/' + run.id, STRAPI_URL);
	const options = {
		method: 'PUT',
		body: JSON.stringify({ data: { ...run, race } })
	};
	return authFetch<App.Run>(endpoint, options);
};

export const findRuns = async (race: string | number) => {
	const endpoint = new URL('/api/runs', STRAPI_URL);
	endpoint.search = stringify({
		populate: ['race'],
		filters: { race }
	});
	return authFetch<App.Run[]>(endpoint);
};

export const findNextAvailableNumberSign = async (run: App.Run) => {
	if (run.numberSign > 0) return run.numberSign;
	const { race } = run;
	const runs = await findRuns(race.id);
	const numbers = runs.map(({ numberSign }) => numberSign);
	let numberSign = 1;
	while (numbers.includes(numberSign)) numberSign++;
	return numberSign;
};
