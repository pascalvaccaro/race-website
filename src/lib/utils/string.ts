export const capitalise = (str = '') => str.trim().slice(0, 1).toUpperCase() + str.trim().slice(1);
export const extractCookie = (cookie: string, key?: string) => {
  const cookieMap = cookie
		?.split(';')
		.map((v) => v.split('='))
		.reduce(
			(acc, v) => ({
				...acc,
				[decodeURIComponent(v[0].trim())]: decodeURIComponent((v[1] ?? '').trim())
			}),
			{} as Record<string, string>
		);

  if (key) return cookieMap[key] as string;
}