import FormData from 'form-data';
import { stringify } from 'qs';

export const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

type Scalar = string | number | boolean | null | undefined | Date;
type StrapiPopulate<B, T = Omit<B, 'id'>> = {
	[K in keyof T]: T[K] extends Scalar ? T[K] : { data: StrapiObject<T[K]> };
};

type StrapiObject<T> = T extends Array<unknown>
	? T
	: {
			id: number;
			attributes: StrapiPopulate<T>;
	  };
type StrapiArray<T> = Array<StrapiObject<T>>;

const isDate = (date: unknown): date is Date => {
	try {
		new Date(date as string).toISOString();
		return true;
	} catch (err) {
		return false;
	}
};

const parseStrapiData = <T>(
	data: StrapiObject<T> | StrapiArray<T> | StrapiPopulate<T> | Scalar
): T => {
	if (Array.isArray(data)) {
		return (data as StrapiArray<T>).map(parseStrapiData) as T;
	} else if (data && typeof data === 'object' && !isDate(data)) {
		return Object.entries(data).reduce((acc, [key, value]) => {
			if (key === 'id') return { ...acc, id: value };
			if (key === 'attributes') return { ...acc, ...parseStrapiData(value) };
			if (typeof value === 'object' && value !== null && 'data' in value)
				return { ...acc, [key]: parseStrapiData(value.data) };

			return { ...acc, [key]: value };
		}, {} as T);
	}
	return data as T;
};
const handleStrapiResponse = async <T>(res: Response): Promise<T> => {
	const json = await res.json();
	if (json.error) throw new Error(json.error.message);
	return parseStrapiData<T>(json.data as StrapiObject<T>);
};

const authFetch = async <T = unknown>(
	url: Parameters<typeof fetch>[0],
	options?: Parameters<typeof fetch>[1]
): Promise<T> => {
	if (!options || typeof options !== 'object') options = {};
	options.headers = {
		'Content-Type': 'application/json',
		Authorization: `bearer ${STRAPI_API_TOKEN}`,
		...(options.headers ?? {}),
	};
	return fetch(url.toString(), options).then<T>(handleStrapiResponse);
};

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
		filters: { startDate: { $gte: new Date().toISOString().split('T')[0] }},
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
		body: JSON.stringify({ data }),
	};
	return authFetch<App.Run>(endpoint, options);
};

export const createOrUpdateRunner = async ({
	runner,
	attachments
}: {
	runner: Partial<App.Runner>;
	attachments: File[];
}) => {
	const exists = Boolean(runner && 'id' in runner && typeof runner.id === 'number');
	const endpoint = new URL('/api/runners' + (exists ? `/${runner.id}` : ''), STRAPI_URL);
	endpoint.search = stringify({
		populate: ['attachments']
	})
	const body = new FormData();
	await Promise.all(attachments.map(async (file, the_index) => {
		const buffer = await file.arrayBuffer();
		body.append(`files.attachments[${the_index}].file`, Buffer.from(buffer), file.name);
	}));
	body.append('data', JSON.stringify(runner));
	
	const options = {
		protocol: endpoint.protocol as 'http:',
		hostname: endpoint.hostname,
		port: endpoint.port,
		path: endpoint.pathname + endpoint.search,
		method: exists ? 'PUT' : 'POST',
		headers: { Authorization: `bearer ${STRAPI_API_TOKEN}` },
	};
	return new Promise<App.Runner>((resolve, reject) => body.submit(options, (err, res) => {
		if (err) return reject(err);
		const chunks = [] as string[];
		res.on('data', (chunk) => chunks.push(chunk));
		res.on('end', () => {
			try {
				const str = chunks.join('');
				const obj = JSON.parse(str);
				const result = parseStrapiData<App.Runner>(obj.data);
				resolve(result);
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
		res.on('error', reject);
	}));
};

export const getRun = async (id: string | number) => {
	const endpoint = new URL('/api/runs/' + id, STRAPI_URL);
	endpoint.search = stringify({
		populate: ['race', 'race.park', 'runner']
	});
	return authFetch<App.Run>(endpoint);
};
