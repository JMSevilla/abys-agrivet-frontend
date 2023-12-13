import { ControlledBackdrop, SingleOption } from "@/components";
import { Typography, setRef } from "@mui/material";
import { useState, useEffect, PropsWithChildren, useRef } from "react";
import { ControlledTextField } from "@/components";
import { ControlledSelectField } from "@/components";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/router";
import { useAtom, useSetAtom } from "jotai";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import {
  LoginType,
  baseLoginSchema,
} from "@/utils/schema/Account/AdminRegistrationSchema";
import { useMutation, useQuery } from "react-query";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { AccountLoginWithJWT, JWTAccountCreationProps } from "@/utils/types";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginAccountAtom } from "@/utils/hooks/useAtomic";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import { useApiCallBack } from "@/utils/hooks/useApi";
import {
  useAccessToken,
  useRefreshToken,
  useBranchPath,
  usePlatform,
  useUserType,
  useUserId,
  useReferences,
} from "@/utils/hooks/useToken";
import { encrypt } from "@/utils/config/encryptor";
import { PlatformAtom } from "@/utils/hooks/useAtomic";
const LoginForm: React.FC<
  PropsWithChildren<{}> & { handleContinue: () => void }
> = ({ children, handleContinue }) => {
  const { control, getValues, watch } = useFormContext<LoginType>();
  const GetBranchAvailable = useApiCallBack((api) => api.abys.GetAllBranches());
  const router = useRouter();
  const [branch, setBranch] = useState<SingleOption[]>([]);
  const [storageChecker, setStorageChecker] = useState<any>(null);
  const [platformStorage, setPlatformStorage] = usePlatform();
  const [platformState, setPlatformState] = useState<any>(null)
  const { data } = useQuery({
    queryKey: "FetchAllBranches",
    queryFn: () =>
      GetBranchAvailable.execute().then((response) => response.data),
  });
  useEffect(() => {
    setBranch(data);
  }, [data]);
  const handleChangeSignType = (e: any, path: string) => {
    sessionStorage.clear();
    router.push(path);
  };
  const enterKeyTrigger = (event: any) => {
    const values = getValues();
    if (event.key === "Enter") {
      if (values.password != "") {
        handleContinue();
      }
    }
  };
  useEffect(() => {
    let savedPlatform;
    const savedPlatformStorage = sessionStorage.getItem("PF");
    if (typeof savedPlatformStorage == "string") {
      savedPlatform = JSON.parse(savedPlatformStorage);
    }
    setPlatformState(savedPlatform)
    if (!savedPlatform) {
      setStorageChecker(null);
    } else {
      setStorageChecker(savedPlatformStorage);
    }
  }, [platformStorage]);
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="/agrivet.png"
              alt="Your Company"
              style={{ width: "25%", height: "auto" }}
            />
            <Typography className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </Typography>
            {
               <p className="mt-2 text-center text-sm text-gray-600">
               Or{" "}
               <a
                 href={"/customer-registration"}
                 className="font-medium text-indigo-600 hover:text-indigo-500"
               >
                 start creating your account
               </a>
             </p>
            }
          </div>
          <div className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <ControlledTextField
                  control={control}
                  name="email"
                  required
                  label="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <ControlledTextField
                  control={control}
                  name="password"
                  required
                  type="password"
                  label="Password"
                  onKeyPress={enterKeyTrigger}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {/* <a
                 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a> */}
                <Link
                  href={
                    {
                      pathname: "/forgot-password",
                    }
                  }
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm">
                <Link
                  href={
                    {
                      pathname: "/",
                    }
                  }
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Back<span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
      {/* <ControlledBackdrop open={open} /> */}
    </>
  );
};

export const LoginAdditionalForm = () => {
  const [loginAtom, setLoginAtom] = useAtom(LoginAccountAtom);
  const [open, setOpen] = useState(false);
  const form = useForm<LoginType>({
    mode: "all",
    resolver: zodResolver(baseLoginSchema),
    defaultValues: loginAtom,
  });
  const [accessToken, setAccessToken] = useAccessToken();
  const [refreshToken, setRefreshToken] = useRefreshToken();
  const [userType, setUserType] = useUserType();
  const [branchPath, setBranchPath] = useBranchPath();
  const [references, setReferences] = useReferences()
  const [uid, setUid] = useUserId()
  const loginRequest = useApiCallBack(
    async (api, args: AccountLoginWithJWT) =>
      await api.authentication.Login(args)
  );
  const [storagePlatform, setStoragePlatform] = usePlatform();
  const [platformSaved, setPlatformSaved] = useState<any>(null)
  const useLogin = () => {
    return useMutation((data: AccountLoginWithJWT) =>
      loginRequest.execute(data)
    );
  };
  useEffect(() => {
    let savedplatform;
    const savedStoragePlatform = sessionStorage.getItem('PF')
    if(typeof savedStoragePlatform == 'string'){
      savedplatform = JSON.parse(savedStoragePlatform)
    }
    setPlatformSaved(savedplatform)
  }, [storagePlatform])
  const router = useRouter();
  const { handleOnToast } = useToastContext();
  const { mutate } = useLogin();
  const handleContinue = () => {
    handleSubmit((values) => {
      setOpen(!open);
      const obj = {
        email: values.email,
        password: values.password
      };
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == "INVALID_PASSWORD") {
            setOpen(false);
            handleOnToast(
              "Invalid Email or Password",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
          } else if (data == "ACCOUNT_NOT_EXISTS_ON_THIS_BRANCH") {
            setOpen(false);
            handleOnToast(
              "There is no account associated with that branch",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
          } else if(data == 'NO_ACCOUNT_ON_THIS_BRANCH') {
            handleOnToast(
              "No account associated on this email",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setOpen(false)
          } else if(data == 'BRANCH_NOT_WORKING') {
            handleOnToast(
              "Invalid credentials. Please check again",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setOpen(false)
          } else {
            setOpen(false);
            handleOnToast(
              "Successfully Logged In",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            setAccessToken(data?.TokenInfo.token);
            setRefreshToken(data?.TokenInfo.refreshToken);
            if (data?.usertype == 1) {
              setBranchPath(encrypt(data?.branchPath))
              setUserType(data?.usertype)
              setUid(encrypt(data?.uid?.toString()))
              setReferences(data?.references)
              router.push(data?.branchPath);
            } else if(data?.usertype == 3) {
              setUid(encrypt(data?.uid?.toString()))
              setUserType(data?.usertype)
              setReferences(data?.references)
              setBranchPath(encrypt("/customer/dashboard"))
              router.push("/customer/dashboard");
            } else {
              setBranchPath(encrypt(data?.branchPath))
              setUid(encrypt(data?.uid?.toString()))
              setUserType(data?.usertype)
              setReferences(data?.references)
              router.push(data?.branchPath);
            }
          }
        },
        onError: (error: any) => {
          handleOnToast(
            "Something went wrong. Please check credentials",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "error"
          );
          setOpen(false)
        }
      });
    })();
  };
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  return (
    <FormProvider {...form}>
      <LoginForm handleContinue={handleContinue}>
        <div>
          <button
            disabled={!isValid}
            onClick={handleContinue}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            Sign in
          </button>
        </div>
      </LoginForm>
      <ControlledBackdrop open={open} />
    </FormProvider>
  );
};