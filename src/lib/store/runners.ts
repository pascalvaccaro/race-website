import { derived, writable } from 'svelte/store';

export const runners = writable<App.Runner[]>([]);
export const hasOptions = derived(runners, value => value.length > 1);
