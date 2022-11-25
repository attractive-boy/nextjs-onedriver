import "../styles/globals.css";
import type { AppProps } from "next/app";
import 'antd/dist/antd.css'
import Head from "next/head";
import styles from "@/styles/home.module.css";

const App = ({ Component, pageProps }: AppProps) =>{
  return (
    <>
      <Head>
        <title>File</title>
        <meta name="description" content="share files from OneDrive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <footer className={styles.footer}>Powered by AttractiveBoy</footer>
    </>
  );
}

export default App;