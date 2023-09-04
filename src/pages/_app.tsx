import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { AppProps } from "next/app";
import { GetServerSideProps, NextPage } from "next";
import { ReactElement, ReactNode, useState } from "react";
import { CssBaseline } from "@mui/material";
import "./index.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import "@/components/PasswordStrengthMeter/PasswordStrengthMeter.css";
import {
  sidebarList,
  sidebarExpand,
  sidebarCustomerExpand,
  sidebarCustomerList,
  sidebarManagersList,
  sidebarManagersExpand
} from "@/components/Layout/Sidebar/SidebarConfig";
import { SetupProvider } from "@/utils/context/SetupContext/SetupContext";
import ToastContext from "@/utils/context/Toast/ToastContext";
import { useAccessToken, useUserType } from "@/utils/hooks/useToken";
import { QueryClient, QueryClientProvider } from "react-query";
import ControlledToast from "@/components/Toast/Toast";
import { useRefreshTokenHandler } from "@/utils/hooks/useRefreshTokenHandler";
import { AuthenticationProvider } from "@/utils/context/AuthContext/AuthContext";
import DashboardLayout from "@/components/Layout";
import React, { useEffect } from "react";
import { UserProvider } from "@/utils/context/UserContext/UserContext";
import { ControlledBackdrop } from "@/components";
import { GlobalsProvider } from "@/utils/context/HelperContext/HelperContext";
import "react-quill/dist/quill.snow.css";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'react-vertical-timeline-component/style.min.css';
import { useApiCallBack } from "@/utils/hooks/useApi";
import { SMSVerificationProps } from "@/utils/types";
/**@deprecated this library has no good UI */
// import "react-datepicker/dist/react-datepicker.css";
export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiTextField : {
      styleOverrides: {
        root: {
          '&.Mui-disabled' : {
            cursor: 'not-allowed'
          }
        }
      }
    }
  },
  
});
const queryClient = new QueryClient({});



export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [accessToken, setAccessToken] = useAccessToken();
  const [userType, setUserType] = useUserType();
  const [loading, setLoading] = useState(false);
  const [storedValue, setStoredValue] = useState<string | undefined>(undefined);
  const [storedType, setStoredType] = useState<number | undefined>(undefined);
  const notifyAppointmentFeature = useApiCallBack(api => api.abys.getNotifyOnPageReload())
  const sendsmtpservice = useApiCallBack(async (api, args: SMSVerificationProps) =>
  await api.abys.SendSMSVerification(args))
  const sendReminder = useApiCallBack(
    async (api, args: {
      type: number,
      id: number,
      email: string,
      phoneNumber: string
    }) => await api.abys.reminderSystem(args)
  )
  useRefreshTokenHandler();
  useEffect(() => {
    setLoading(!loading);
    let savedAuthenticationStorage;
    let savedUserType;
    const savedUserTypeStorage = sessionStorage.getItem("UT");
    const savedAuthStorage = sessionStorage.getItem("AT");
    if (
      typeof savedAuthStorage == "string" &&
      typeof savedUserTypeStorage == "string"
    ) {
      savedAuthenticationStorage = JSON.parse(savedAuthStorage);
      savedUserType = JSON.parse(savedUserTypeStorage);
    }

    if (!accessToken || accessToken == undefined) {
      setLoading(false);
      setStoredValue(savedAuthenticationStorage);
      setStoredType(savedUserType);
    } else {
      setLoading(false);
      setStoredValue(accessToken);
      setStoredType(savedUserType);
    }
  }, [accessToken, userType]);

  useEffect(() => {
    notifyAppointmentFeature.execute()
    .then((response) => {
      if(response?.data?.length > 0) {
        response.data?.map((item: any) => {
            const obj = {
              type: item?.reminderType,
              id: item?.id,
              email: item?.email,
              phoneNumber: item?.phoneNumber 
            }
            if(item?.notify == 0) {
              sendReminder.execute(obj)
            }
        })
      }
    })
  }, [])

  return (
    <>
       <GlobalsProvider globals={{storedValue : storedValue, storedType: storedType}}>
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
                  <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  >
                    {loading && !storedValue ? (
                    <ControlledBackdrop open={loading} />
                  ) : storedValue ? (
                    <DashboardLayout
                      sidebarConfig={
                        storedType == 1 ? sidebarList : storedType == 2 ? sidebarManagersList : sidebarCustomerList
                      }
                      subsidebarConfig={
                        storedType == 1 ? sidebarExpand : storedType == 2 ? sidebarManagersExpand : sidebarCustomerExpand
                      }
                    >
                      {getLayout(<Component {...pageProps} />)}
                    </DashboardLayout>
                  ) : (
                    <>{getLayout(<Component {...pageProps} />)}</>
                  )}
                  </LocalizationProvider>
                </UserProvider>
              </AuthenticationProvider>
            </ToastContext>
          </SetupProvider>
        </ThemeProvider>
      </QueryClientProvider>
      </GlobalsProvider>
    </>
  );
}


