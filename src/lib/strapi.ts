import { FormData } from 'formdata-node';

export const STRAPI_URL = 'http://localhost:1337';

async function handleStrapiResponse(res: Response) {
	const json = await res.json();
	if (json.error) throw new Error(json.error.message);
	return json.data;
}

export const findRunnerByEmail = async (email: string): Promise<Array<App.Runner>> => {
	const endpoint = new URL('/api/runners', STRAPI_URL);
	endpoint.searchParams.append('filters[email][$eq]', email);
	endpoint.searchParams.append('populate', 'certificates,attestations');
	return fetch(endpoint.toString())
		.then(handleStrapiResponse)
		.then((data) =>
			data.map(({ id, attributes }: { id: number; attributes: Omit<App.Runner, 'id'> }) => ({
				id,
				...attributes
			}))
		);
};

export const findNextPublicRace = async (): Promise<App.Race | null> => {
	const endpoint = new URL('/api/races', STRAPI_URL);
	endpoint.searchParams.append('filters[startDate][$gte]', new Date().toISOString().split('T')[0]);
	endpoint.searchParams.append('sort', 'startDate:asc');
	endpoint.searchParams.append('populate', 'park');

	return fetch(endpoint.toString())
		.then(handleStrapiResponse)
		.then((data) => {
			const [first] = data;
			if (!first) return null;
			const { id, attributes } = first;
			const {
				park: {
					data: { attributes: park }
				},
				...race
			} = attributes;

			return {
				id,
				...race,
				park
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
		.then(handleStrapiResponse)
		.then(({ id, attributes }) => ({
			id,
			...attributes,
		}));
};

export const createOrUpdateRunner = async ({ runner, attachments }: {
	runner: Partial<App.Runner>,
	attachments?: File[] 
}): Promise<App.Runner> => {
	const exists = Boolean(runner && 'id' in runner && typeof runner.id === 'number');
	const endpoint = new URL('/api/runners' + (exists ? `/${runner.id}` : ''), STRAPI_URL);
	const body = new FormData();
	body.append('data', JSON.stringify(runner));
	if (attachments && attachments.length) 
		attachments.forEach(
			(attachment, i) => body.append(`files.attachment[${i}]`, attachment, attachment.name)
		);

	const options = {
		method: exists ? 'PUT' : 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ data: runner }),
	};
	return fetch(endpoint, options as any)
		.then(handleStrapiResponse)
		.then(({ id, attributes }) => ({ id, ...attributes }));
};

export const getRun = async (id: string | number): Promise<App.Run> => {
	const endpoint = new URL('/api/runs/' + id, STRAPI_URL);
	endpoint.searchParams.append('populate[0]', 'race');
	endpoint.searchParams.append('populate[1]', 'race.park');
	endpoint.searchParams.append('populate[2]', 'runner');
	return fetch(endpoint.toString())
		.then(handleStrapiResponse)
		.then((data) => ({
			id: data.id, 
			...data.attributes,
			race: {
				id: data.attributes.race.data.id,
				...data.attributes.race.data.attributes,
				park: {
					id: data.attributes.race.data.attributes.park.data.id,
					...data.attributes.race.data.attributes.park.data.attributes,
				}
			},
			runner: {
				id: data.attributes.runner.data.id,
				...data.attributes.runner.data.attributes,
			}
		} as App.Run));
};
