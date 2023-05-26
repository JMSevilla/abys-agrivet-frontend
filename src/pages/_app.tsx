import { ThemeProvider, createTheme } from '@mui/material/styles'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import "./index.css";

import { SetupProvider } from '@/utils/context/SetupContext/SetupContext';

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})


export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SetupProvider>
         {getLayout(<Component {...pageProps} />)}
        </SetupProvider>
      </ThemeProvider>
    )
}
