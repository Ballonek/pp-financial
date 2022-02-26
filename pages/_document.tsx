import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
      </Head>
      <body style={{ position: 'fixed' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
