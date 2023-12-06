import Document, { Html, Head, Main, NextScript } from 'next/document'
const measurement_id = process.env.GA_MEASUREMENT_ID || "G-3MJE40VCJT"

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
            {/* <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${measurement_id}`}
            />
            <script
                dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${measurement_id}', {
                page_path: window.location.pathname,
                });
            `,
                }}
            /> */}
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}