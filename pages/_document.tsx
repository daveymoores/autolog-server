import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Load Google Fonts with preconnect for better performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro&display=swap"
            rel="stylesheet"
          />

          {/* Add a fallback style that ensures fonts are applied */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
           /* Font fallback system */
           @font-face {
             font-family: 'Inter';
             font-style: normal;
             font-weight: 400;
             font-display: swap;
             src: local('Inter Regular'), local('Inter-Regular');
           }
           @font-face {
             font-family: 'Inter';
             font-style: normal;
             font-weight: 500;
             font-display: swap;
             src: local('Inter Medium'), local('Inter-Medium');
           }
           @font-face {
             font-family: 'Inter';
             font-style: normal;
             font-weight: 700;
             font-display: swap;
             src: local('Inter Bold'), local('Inter-Bold');
           }
           @font-face {
             font-family: 'Source Code Pro';
             font-style: normal;
             font-weight: 400;
             font-display: swap;
             src: local('Source Code Pro Regular'), local('SourceCodePro-Regular');
           }

           /* Force font usage in PDFs */
           @media print {
             body {
               font-family: 'Inter', sans-serif !important;
             }
             code, pre {
               font-family: 'Source Code Pro', monospace !important;
             }
           }
         `,
            }}
          />
        </Head>
        <body className="text-green-100 h-full antialiased bg-gradient-to-tl from-slate-900 to-slate-800">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
