import { FormData } from 'formdata-node';

export const STRAPI_URL = 'http://localhost:1337';

type StrapiResponse<T = Record<string, { data?: StrapiResponse } | string | number | boolean>> = {
	id: number;
	attributes: T;
}

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

export const registerRun = async (run: App.Run): Promise<App.Run> => {
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
		.then((res) => res.data)
		.then(({ id, attributes }) => ({
			id,
			...attributes,
		}));
};

export const createOrUpdateRunner = async ({ runner, attachments }: {
	runner: Partial<App.Runner>,
	attachments?: FormDataEntryValue[] 
}): Promise<App.Runner> => {
	const exists = Boolean(runner && 'id' in runner && typeof runner.id === 'number');
	const endpoint = new URL('/api/runners' + (exists ? `/${runner.id}` : ''), STRAPI_URL);
	const body = new FormData();
	body.append('data', JSON.stringify(runner));
	if (attachments && attachments.length) 
		body.append('files.attachment', attachments);

	const options = {
		method: exists ? 'PUT' : 'POST',
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

export const getRun = async (id: string | number): Promise<App.Run> => {
	const endpoint = new URL('/api/runs/' + id, STRAPI_URL);
	endpoint.searchParams.append('populate[0]', 'race');
	endpoint.searchParams.append('populate[1]', 'race.parcours');
	endpoint.searchParams.append('populate[2]', 'runner');
	return fetch(endpoint.toString())
		.then((res) => res.json())
		.then((res) => ({
			id: res.data.id, 
			...res.data.attributes,
			race: {
				id: res.data.attributes.race.data.id,
				...res.data.attributes.race.data.attributes,
				parcours: {
					id: res.data.attributes.race.data.attributes.parcours.data.id,
					...res.data.attributes.race.data.attributes.parcours.data.attributes,
				}
			},
			runner: {
				id: res.data.attributes.runner.data.id,
				...res.data.attributes.runner.data.attributes,
			}
		} as App.Run));
};
