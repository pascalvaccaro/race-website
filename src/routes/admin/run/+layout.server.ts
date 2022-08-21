import type { LayoutServerLoad } from './$types';
import type { StrapiResponse } from '$lib/strapi/typings';
import { extractCookie } from '$lib/utils/string';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ request, url }) => {
	const cookies = request.headers.get('cookie') ?? '';
	const userToken = extractCookie(cookies, 'strapi_user-token');

	const { data: user, error: err } = await fetch(
		new URL('/admin/users/me', env.STRAPI_URL).toString(),
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userToken}`
			}
		}
	).then<StrapiResponse<App.AdminUser>>((res) => res.json());

	if (err?.status === 401) {
		const searchParams = new URLSearchParams({ redirectTo: url.pathname });
		const location = `/admin/login?${searchParams.toString()}`;
		throw redirect(307, location);
	}
	return { user };
};
