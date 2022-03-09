/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pp-financial.herokuapp.com'],
  },
  env: {
    NEXT_PUBLIC_DB_URL:
      'mongodb+srv://ppFinancial:j8p9ofdJEGALsfP6@cluster0.elllw.mongodb.net/ppFinancial?retryWrites=true&w=majority',
  },
};

module.exports = nextConfig;
