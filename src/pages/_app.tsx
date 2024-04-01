import "@/styles/globals.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
//MUST import before using any mantine components !!!
import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
//MUST import before using any toastify components !!!
import "react-toastify/dist/ReactToastify.css";

import { SWRConfig } from "swr";
import { fetcher } from "@/utils/swr_fetcher";
import { RouterTransition } from "@/components/common/router_transition";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  //Mantine Theme
  const theme = createTheme({
    /** Put your mantine theme override here */
  });

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <SWRConfig value={{ refreshInterval: 30000, fetcher }}>
          <RouterTransition />
          <Component {...pageProps} />
        </SWRConfig>
      </MantineProvider>
    </SessionProvider>
  );
}
