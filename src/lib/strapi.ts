import type { FormData } from 'formdata-node';

export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const findRunnerByEmail = async (email: string): Promise<Array<App.Runner>> => {
	const endpoint = new URL('/api/runners', STRAPI_URL);
	endpoint.searchParams.append('filters[email][$eq]', email);
	endpoint.searchParams.append('populate', 'certificates,attestations');
	return fetch(endpoint.toString())
		.then((res) => res.json())
		.then((res) =>
			res.data.map(({ id, attributes }: { id: number; attributes: Omit<App.Runner, 'id'> }) => ({
				id,
				...attributes
			}))
		);
};

export const findNextPublicRace = async (): Promise<App.Race | null> => {
	const endpoint = new URL('/api/races', STRAPI_URL);
	endpoint.searchParams.append('filters[startDate][$gte]', new Date().toISOString().split('T')[0]);
	endpoint.searchParams.append('sort', 'startDate:asc');
	endpoint.searchParams.append('populate', 'parcours');

	return fetch(endpoint.toString())
		.then((res) => res.json())
		.then((res) => {
			const {
				data: [first]
			} = res;
			if (!first) return null;
			const { id, attributes } = first;
			const {
				parcours: {
					data: { attributes: parcours }
				},
				...race
			} = attributes;

			return {
				id,
				...race,
				parcours
			} as App.Race;
		});
};

export const registerRun = async (run: App.Run) => {
	const endpoint = new URL('/api/runs', STRAPI_URL);
	const data =  { ...run, runner: run.runner.id };
	const options = {
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ data }),
		method: 'POST'
	};
	return fetch(endpoint, options)
		.then((res) => res.json())
		.then((res) => res.data);
};

export const createRunner = async (body: FormData, method = "POST"): Promise<App.Runner> => {
	const endpoint = new URL('/api/runners', STRAPI_URL);
	const options = {
		method,
		body,
	};
	return fetch(endpoint, options as any)
		.then(async (res) => {
			if (!res.ok) throw new Error(await res.text());
			const json = await res.json();
			if (json.error) throw json.error;
			return json.data;
		})
		.then(({ id, attributes }) => ({ id, ...attributes }));
};
export const updateRunner = async (body: FormData, runnerId: string): Promise<App.Runner> => {
	const endpoint = new URL('/api/runners', STRAPI_URL);
	const options = {
		method: "PUT",
		body,
	};
	return fetch(endpoint + '/' + runnerId, options as any)
		.then(async (res) => {
			if (!res.ok) throw new Error(await res.text());
			const json = await res.json();
			if (json.error) throw json.error;
			return json.data;
		})
		.then(({ id, attributes }) => ({ id, ...attributes }));
};
