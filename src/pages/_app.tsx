import { ThemeProvider, createTheme } from '@mui/material/styles'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import { NextPage } from 'next';
import { ReactElement, ReactNode, useState } from 'react';
import { CssBaseline } from '@mui/material';
import "./index.css";
import "react-big-calendar/lib/css/react-big-calendar.css";


import "@/components/PasswordStrengthMeter/PasswordStrengthMeter.css"
import { sidebarList } from '@/components/Layout/Sidebar/SidebarConfig';
import { SetupProvider } from '@/utils/context/SetupContext/SetupContext';
import ToastContext from '@/utils/context/Toast/ToastContext';
import { useAccessToken } from '@/utils/hooks/useToken';
import { QueryClient, QueryClientProvider } from 'react-query'
import ControlledToast from '@/components/Toast/Toast';
import { useRefreshTokenHandler } from '@/utils/hooks/useRefreshTokenHandler';
import { AuthenticationProvider } from '@/utils/context/AuthContext/AuthContext';
import DashboardLayout from '@/components/Layout';
import React, {useEffect} from 'react';
import { UserProvider } from '@/utils/context/UserContext/UserContext';
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
const queryClient = new QueryClient({});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)
    const [accessToken, setAccessToken] = useAccessToken()
    const [storedValue, setStoredValue] = useState<string | undefined>(undefined)
    useRefreshTokenHandler()
    useEffect(() => {
      let savedAuthenticationStorage;
      const savedAuthStorage = localStorage.getItem('AT')
      if(typeof savedAuthStorage == "string"){
        savedAuthenticationStorage = JSON.parse(savedAuthStorage)
      }

      if(!accessToken || accessToken == undefined) {
        setStoredValue(savedAuthenticationStorage)
      } else{
        setStoredValue(accessToken)
      }
    }, [accessToken])
    return (
      <>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <SetupProvider>
       <ToastContext>
        <AuthenticationProvider>
          <UserProvider>
          <ControlledToast
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
          {
            storedValue ? 
            <DashboardLayout
            sidebarConfig={sidebarList}
            subsidebarConfig={[]}
            >
              {getLayout(<Component {...pageProps} />)}
            </DashboardLayout>
            :
            <>
            {getLayout(<Component {...pageProps} />)}
            </>
          }
          </UserProvider>
        </AuthenticationProvider>
       </ToastContext>
      </SetupProvider>
    </ThemeProvider>
    </QueryClientProvider>
      </>
    )
}
