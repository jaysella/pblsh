import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex" />
          <link
            href="https://fonts.googleapis.com/css2?family=Farro:wght@300;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Because sharing is caring. A new way to organize and share your content without the frills."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://pblsh.page/" />
          <meta property="og:title" content="Welcome to pblsh!" />
          <meta
            property="og:description"
            content="Because sharing is caring. A new way to organize and share your content without the frills."
          />
          <meta
            property="og:image"
            content="https://jps.fyi/m/image/upload/v1621284871/Pblsh_Meta_Image_qnnbix.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://pblsh.page/" />
          <meta property="twitter:title" content="Welcome to pblsh!" />
          <meta
            property="twitter:description"
            content="Because sharing is caring. A new way to organize and share your content without the frills."
          />
          <meta
            property="twitter:image"
            content="https://jps.fyi/m/image/upload/v1621284871/Pblsh_Meta_Image_qnnbix.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
