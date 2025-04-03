import "../styles/global.css";

import App from "next/app";
import Head from "next/head";
import React from "react";
import { Toaster } from "react-hot-toast";

import Layout from "../components/Layout/Layout";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout>
        <Head>
          <title>Autolog – Effortless Timesheets from Your Git History</title>
          <meta
            name="description"
            content="Autolog scans your Git commits to identify worked days, helping you track client projects without manual time logging. Generate timesheets in seconds."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Open Graph (Facebook, LinkedIn) */}
          <meta
            property="og:title"
            content="Autolog – Effortless Timesheets from Your Git History"
          />
          <meta
            property="og:description"
            content="Autolog scans your Git commits to identify worked days across multiple repositories and clients. Generate timesheets in seconds."
          />
          <meta
            property="og:image"
            content="https://autolog.dev/autolog-preview.png"
          />
          <meta property="og:url" content="https://autolog.dev" />
          <meta property="og:type" content="website" />
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Autolog – Effortless Timesheets from Your Git History"
          />
          <meta
            name="twitter:description"
            content="Track worked days across multiple repositories and clients using your Git history. Generate timesheets in seconds."
          />
          <meta
            name="twitter:image"
            content="https://autolog.dev/autolog-preview.png"
          />
          <meta name="theme-color" content="#16A34A" />
        </Head>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
