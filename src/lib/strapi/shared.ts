import { isDate } from '$lib/utils/date';
import type { StrapiObject, StrapiArray, StrapiPopulate, Scalar, StrapiResponse } from './typings';

export const parseStrapiData = <T>(
	data: StrapiObject<T> | StrapiArray<T> | StrapiPopulate<T> | Scalar
): T => {
	if (Array.isArray(data)) {
		return (data as unknown as StrapiArray<T>).map(parseStrapiData) as unknown as T;
	} else if (data && typeof data === 'object' && !isDate(data)) {
		return Object.entries(data).reduce((acc, [key, value]) => {
			if (key === 'id') return { ...acc, id: value };
			if (key === 'attributes') return { ...acc, ...parseStrapiData(value) };
			if (typeof value === 'object' && value !== null && 'data' in value)
				return { ...acc, [key]: parseStrapiData(value.data) };

			return { ...acc, [key]: value };
		}, {} as T);
	}
	return data as unknown as T;
};

export const handleStrapiResponse = async <T>(res: Response): Promise<T> => {
	const json = await res.json() as StrapiResponse<StrapiObject<T>>;
	if (json.error) throw json.error;
	return parseStrapiData<T>(json.data);
};

export const fetchFactory =
	(token: string, handler = handleStrapiResponse as any) =>
	async <T = unknown>(
		url: Parameters<typeof fetch>[0] | URL,
		options?: Parameters<typeof fetch>[1]
	): Promise<T> => {
		if (!options || typeof options !== 'object') options = {};
		options.headers = {
			'Content-Type': 'application/json',
			Authorization: `bearer ${token}`,
			...(options.headers ?? {})
		};
		return fetch(url.toString(), options).then<T>(handler);
	};
