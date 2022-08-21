import type { StrapiResponse } from '$lib/strapi/typings';
import { env } from '$env/dynamic/private';
import type { Action } from './$types';

export const POST: Action = async ({ request, setHeaders }) => {
	const form = await request.formData();
	const email = form.get('email');
	const password = form.get('password');
	if (!email || !password)
		return {
			status: 400,
			errors: { message: 'Formulaire invalide' }
		};

	const { data, error } = await fetch(new URL('/admin/login', env.STRAPI_URL).toString(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	}).then<StrapiResponse<{ token: string; user: App.AdminUser }>>((res) => res.json());
	if (error || !data)
		return {
			status: error.status,
			errors: error || { message: 'no user found' }
		} as const;
	setHeaders({ 'set-cookie': `strapi_user-token=${data.token}` });

	return {
		location: form.get('redirectTo')?.toString() ?? '/admin/run/checkin'
	};
};
