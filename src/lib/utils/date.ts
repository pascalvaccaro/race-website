import dayjs from 'dayjs';
import 'dayjs/locale/fr';

export const getRaceStartDateTime = (race: App.Race) =>
	dayjs(`${race.startDate}T${race.startTime}`).locale('fr').format('dddd D MMMM [à] H [heures]');

export const isDate = (date: unknown): date is Date => {
	try {
		new Date(date as string).toISOString();
		return true;
	} catch (err) {
		return false;
	}
};
