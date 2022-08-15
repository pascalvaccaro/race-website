import FormData from 'form-data';
import { stringify } from 'qs';
import { env } from '$env/dynamic/private';
import { fetchFactory, parseStrapiData } from './strapi.shared';

const { STRAPI_URL, STRAPI_API_TOKEN } = env;
const authFetch = fetchFactory(STRAPI_API_TOKEN);

export const findRunnerByEmail = async (email: string) => {
	const endpoint = new URL('/api/runners', STRAPI_URL);
	endpoint.search = stringify({
		filters: { email },
		populate: ['attachments', 'attachments.file']
	});
	return authFetch<App.Runner[]>(endpoint);
};

export const findNextPublicRace = async () => {
	const endpoint = new URL('/api/races', STRAPI_URL);
	endpoint.search = stringify({
		filters: { startDate: { $gte: new Date().toISOString().split('T')[0] } },
		sort: 'startDate:asc',
		populate: ['park']
	});

	return authFetch<App.Race[]>(endpoint).then(([first]) => first ?? null);
};

export const registerRun = async (run: App.Run) => {
	const endpoint = new URL('/api/runs', STRAPI_URL);
	endpoint.search = stringify({
		populate: ['race', 'race.park', 'runner']
	});
	const data = { ...run, runner: run.runner.id };
	const options = {
		method: 'POST',
		body: JSON.stringify({ data })
	};
	return authFetch<App.Run>(endpoint, options);
};

export const createOrUpdateRunner = async (
	runner: Partial<App.Runner>,
	attachments: File[] = []
) => {
	const exists = Boolean(runner && 'id' in runner && typeof runner.id === 'number');
	const endpoint = new URL('/api/runners' + (exists ? `/${runner.id}` : ''), STRAPI_URL);
	endpoint.search = stringify({
		populate: ['attachments']
	});
	const body = new FormData();
	await Promise.all(
		attachments.map(async (file, the_index) => {
			const buffer = await file.arrayBuffer();
			body.append(`files.attachments[${the_index}].file`, Buffer.from(buffer), file.name);
		})
	);

	body.append('data', JSON.stringify(runner));

	const options = {
		method: exists ? 'PUT' : 'POST',
		protocol: endpoint.protocol as 'https:',
		hostname: endpoint.hostname,
		port: endpoint.port,
		path: endpoint.pathname + endpoint.search,
		headers: { Authorization: `bearer ${STRAPI_API_TOKEN}` }
	};

	return new Promise<App.Runner>((resolve, reject) =>
		body.submit(options, (err, res) => {
			if (err) return reject(err);
			const chunks = [] as string[];
			res.on('data', (chunk) => chunks.push(chunk));
			res.on('end', () => {
				try {
					const obj = JSON.parse(chunks.join(''));
					resolve(parseStrapiData<App.Runner>(obj.data));
				} catch (err) {
					reject(err);
				}
			});
			res.on('error', reject);
		})
	);
};

export const getRun = async (id: string | number) => {
	const endpoint = new URL('/api/runs/' + id, STRAPI_URL);
	endpoint.search = stringify({
		populate: ['race', 'race.park', 'runner']
	});
	return authFetch<App.Run>(endpoint);
};
