import { Typography } from "@mui/material";
import { UncontrolledCard, ControlledGrid } from "@/components";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { PlatformAtom } from "@/utils/hooks/useAtomic";
import { useAtom } from "jotai";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { useEffect } from "react";
import { usePlatform } from "@/utils/hooks/useToken";
export type PlatformProps = {
  platform: string;
};
const Platform = () => {
  const [storagePlatform, setStoragePlatform] = usePlatform();
  const router = useRouter();
  const [platformAtom, setPlatformAtom] = useAtom(PlatformAtom);
  const { checkAuthentication } = useAuthenticationContext();
  useEffect(() => {
    let savedPlatform;
    const savedPlatformStorage = sessionStorage.getItem("PF");
    if (typeof savedPlatformStorage == "string") {
      savedPlatform = JSON.parse(savedPlatformStorage);
    }

    if (!savedPlatform) {
      router.push("/platform");
    } else {
      checkAuthentication();
    }
  }, []);
  const handleNavigatePlatform = (path: string, key: string) => {
    setPlatformAtom({ platform: key });
    setStoragePlatform(key);
    router.push(path);
  };
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
              Sign in as
            </Typography>
          </div>
          <div className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <ControlledGrid>
                <Grid item xs={6}>
                  <UncontrolledCard
                    style={{
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    handleClick={() =>
                      handleNavigatePlatform("/login", "customer")
                    }
                  >
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_Customer-Rating-Testimonial-Client-256.png"
                        alt="customer"
                        style={{
                          width: "30%",
                          height: "auto",
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                      <Typography variant="button">Customer</Typography>
                    </div>
                  </UncontrolledCard>
                </Grid>
                <Grid item xs={6}>
                  <UncontrolledCard
                    style={{
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    handleClick={() =>
                      handleNavigatePlatform("/login", "employee")
                    }
                  >
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="https://cdn0.iconfinder.com/data/icons/find-a-job-and-interview-flat/512/employee_person_man_business_office_businessman_people_male_worker-256.png"
                        style={{
                          width: "30%",
                          height: "auto",
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                      <Typography variant="button">Employee</Typography>
                    </div>
                  </UncontrolledCard>
                </Grid>
              </ControlledGrid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Platform;
