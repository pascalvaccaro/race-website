import { stringify } from 'qs';

export const STRAPI_URL = 'http://localhost:1337';
export const STRAPI_API_TOKEN =
	'991017012fa9f5b6a76cea6a2305b6e59c3f3f6ef4b87f8f3c2a160871651d5328682a181ae78da2e6b04876c34ca046ae9fa6a4dc20769a580ce2e4e97cceafc01768368ee5fa2a786c9172722cfa73af429a2b01b0d10a0ae3f43e1ba1b03cd969bb81efb30f03d12d34c3983d445b73c228eec7e91a729df019bc29210990';

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
	url: RequestInfo | URL,
	options?: RequestInit
): Promise<T> => {
	if (!options || typeof options !== 'object') options = {};
	options.headers = {
		...(options.headers ?? {}),
		Authorization: `bearer ${STRAPI_API_TOKEN}`
	};
	return fetch(url.toString(), options).then<T>(handleStrapiResponse);
};

export const findRunnerByEmail = async (email: string) => {
	const endpoint = new URL('/api/runners', STRAPI_URL);
	endpoint.search = stringify({
		filters: { email },
		populate: ['certificate']
	});
	return authFetch<App.Runner[]>(endpoint);
};

export const findNextPublicRace = async () => {
	const endpoint = new URL('/api/races', STRAPI_URL);
	endpoint.search = stringify({
		filters: { startDate: { $gte: new Date().toISOString() }},
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
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ data }),
		method: 'POST'
	};
	return authFetch<App.Run>(endpoint, options);
};

export const createOrUpdateRunner = async ({
	runner,
	attachments
}: {
	runner: Partial<App.Runner>;
	attachments?: string[];
}) => {
	const exists = Boolean(runner && 'id' in runner && typeof runner.id === 'number');
	const endpoint = new URL('/api/runners' + (exists ? `/${runner.id}` : ''), STRAPI_URL);
	const body = new URLSearchParams();
	body.append('data', JSON.stringify(runner));
	if (attachments && attachments.length)
		body.append(`files.file`, attachments[0] as string)

	const options = {
		method: exists ? 'PUT' : 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body,
	};
	return authFetch<App.Runner>(endpoint, options as RequestInit);
};

export const getRun = async (id: string | number) => {
	const endpoint = new URL('/api/runs/' + id, STRAPI_URL);
	endpoint.search = stringify({
		populate: ['race', 'race.park', 'runner']
	});
	return authFetch<App.Run>(endpoint);
};
