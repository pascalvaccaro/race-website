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

export const updateRun =
	(race: string | number) => async (run: App.Run) => {
		const endpoint = new URL('/api/runs/' + run.id, STRAPI_URL);
		const options = {
			method: 'PUT',
			body: JSON.stringify({ data: { ...run, race } })
		};
		return authFetch<App.Run>(endpoint, options);
	};
