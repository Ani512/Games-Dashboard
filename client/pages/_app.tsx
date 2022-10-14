import React, { createContext, useState } from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

type GlobalContextType = {
  userName: any;
  setUserName: any;
};

export const GlobalContext = createContext<GlobalContextType | any>({});

function MyApp({ Component, pageProps }: AppProps) {
  let user: any;

  if (typeof window !== "undefined") {
      user = localStorage.getItem("username");
  } 

  const [userName, setUserName] = useState(user);

  return (
    <GlobalContext.Provider value={{ userName, setUserName }}>
      <Head>
        <title>Games Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </GlobalContext.Provider>
  )
}

export default MyApp
