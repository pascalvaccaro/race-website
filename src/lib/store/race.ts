import type { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import { derived, writable } from 'svelte/store';

type StoredRace = Omit<App.Race, 'startTime'> & { startTime: Dayjs | null };
const defaultRace = {} as StoredRace;

export const race = writable<StoredRace>(defaultRace);
export const startTime = derived(race, (values) => values.startTime);
export const setStartTime = (startTime: Dayjs | null) => {
	race.update((state) => ({ ...state, startTime }));
};
