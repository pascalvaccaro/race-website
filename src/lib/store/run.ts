import { derived, writable } from 'svelte/store';
import { capitalise } from '$lib/utils/string';
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

const updateRunner = (runner: Partial<App.Runner>) => (state: App.Run) => ({
	...state,
	runner: {
		...state.runner,
		...runner
	}
});

export const setRunner = async (payload: Partial<App.Runner>) => {
	if (payload.email || payload.fullname) {
		const search = new URLSearchParams(payload as Record<string, string>);
		const entries = await fetch('/runner?' + search.toString(), {
			headers: { 'Content-Type': 'application/json' }
		}).then<App.Runner[]>((res) => res.json());
		if (entries.length === 1) payload = entries[0];
		else runners.set(entries);
	}

	run.update(updateRunner(payload));
};

run.subscribe((updated) => {
	const { runner } = updated;
	const fullname = capitalise(runner.firstname) + ' ' + capitalise(runner.lastname);
	if (runner.fullname === fullname) return;
	if (runner.lastname && runner.firstname)
		setRunner({ fullname }).catch(() => run.update(updateRunner({ fullname })));
});

export const needs = derived(run, (value) => ({
	certificate:
		!value.walking &&
		(!value.runner.attachments?.length ||
			!value.runner.attachments?.some(
				(attachment) =>
					attachment.name.includes('certificate') &&
					attachment.valid &&
					new Date(attachment.expiry as Date).getTime() > new Date().getTime()
			)),
	authorization:
		value.runner.minor &&
		!value.runner.child &&
		(!value.runner.attachments?.length ||
			!value.runner.attachments.some(
				(attachment) => attachment.name.includes('authorization') && attachment.valid
			)),
	parents: value.runner.child
}));
