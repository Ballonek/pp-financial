import axios from 'axios';

export const baseApiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api';

export const axiosInstance = axios.create({ baseURL: baseApiUrl });

export const defaultDashboard = {
  welcomeText: 'Průměrní lidé všechno začnou, ale nic nedokončí.',
  thanksText: 'Děkujeme za vyplnění testu',
  thanksSubText: 'Do 48 hodin se na test podíváme a v případě úspěchu se ozveme',
};
