import dayjs from 'dayjs';
import 'dayjs/locale/fr';

export const getRaceStartDateTime = (race: App.Race) =>
	dayjs(`${race.startDate}T${race.startTime}`).locale('fr').format('dddd D MMMM [à] H [heures]');
