import { findRunnerByEmail } from '$lib/strapi';
import { derived, writable } from 'svelte/store';
import { runners } from './runners';

const defaultRun = {
	walking: false,
	copyright: true,
	runner: {
		child: false,
		minor: false
	} as App.Runner
} as App.Run;
export const run = writable<App.Run>(defaultRun);

export const setRunner = async (runner: Partial<App.Runner>) => {
	if (runner.email && (!runner.firstname || !runner.lastname)) {
		const entries = await findRunnerByEmail(runner.email);
		if (entries.length === 1) runner =  entries[0];
		else runners.set(entries);
	}
	run.update((state) => ({
		...state,
		runner: {
			...state.runner,
			...runner
		}
	}));
};

export const needs = derived(run, (value) => ({
	certificate:
		!value.walking &&
		(!value.runner.certificates?.length ||
			!value.runner.certificates.some(
				(certif) => new Date(certif.expiration as Date).getTime() > new Date().getTime()
			)),
  authorization: value.runner.minor && !value.runner.child,
	parents: value.runner.minor && value.runner.child,
}));
