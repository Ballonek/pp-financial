import axios from 'axios';

export const axiosInstance = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API || ""}/api` });

export const defaultDashboard = {
  welcomeText: 'Průměrní lidé všechno začnou, ale nic nedokončí.',
  thanksText: 'Děkujeme za vyplnění testu',
  thanksSubText: 'Do 48 hodin se na test podíváme a v případě úspěchu se ozveme',
};
