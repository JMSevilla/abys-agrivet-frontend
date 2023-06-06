import { ControlledBackdrop, ControlledGrid } from "@/components";
import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { UncontrolledCard } from "@/components";
import { useState, useEffect } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { ControlledTabs } from "@/components";
import { ServiceFormField } from "@/components/Forms/Services/ServicesForm";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useQuery } from "react-query";
import { CollapsibleTable } from "@/components/Table/CollapsibleTable";
import { TableSearchProps } from "@/utils/types";

const Services: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { checkAuthentication } = useAuthenticationContext();
  const [tabsValue, setTabsValue] = useState(0);
  const [pg, setpg] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [rpg, setrpg] = useState(5);
  const handleTabsValue = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  const { data } = useQuery({
    queryKey: "getAllServices",
    queryFn: () =>
      getAllServicesRequest.execute().then((response) => response.data),
  });
  const getAllServicesRequest = useApiCallBack((api) =>
    api.abys.getAllServices()
  );
  const handleChangePage = (event: any, newpage: any) => {
    setpg(newpage);
  };
  const globalSearch = (): TableSearchProps[] => {
    const filteredRepositories = data?.filter((value: any) => {
      return (
        value?.title?.toLowerCase().includes(searched?.toLowerCase()) ||
        value?.taskCode
          ?.toString()
          .toLowerCase()
          .includes(searched?.toLowerCase())
      );
    });
    return filteredRepositories;
  };
  const filterTableSearchList: TableSearchProps[] | [] = searched
    ? globalSearch()
    : data;
  const handleChangeRowsPerPage = (event: any) => {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  };
  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res == "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);

  const columns: any[] = [
    {
      field: "id",
      align: false,
    },
    {
      field: "serviceName",
      align: true,
    },
    {
      field: "serviceBranch",
      align: true,
    },
    {
      field: "serviceStatus",
      align: true,
    },
  ];
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <>
          <Container maxWidth="xl">
            <UncontrolledCard
              style={{
                borderRadius: "15px",
              }}
            >
              <Typography variant="inherit">
                Services Category Management
              </Typography>
              <ControlledTabs
                value={tabsValue}
                handleChange={handleTabsValue}
                style={{
                  marginTop: "10px",
                  padding: "10px",
                }}
                tabsinject={[
                  {
                    label: "SERVICES CREATION",
                  },
                  {
                    label: "SERVICES LIST",
                  },
                ]}
              >
                {tabsValue == 0 ? (
                  <>
                    <ControlledGrid>
                      <Grid item xs={6}>
                        <UncontrolledCard>
                          <Typography variant="caption">
                            Create new service category
                          </Typography>
                          <ServiceFormField />
                        </UncontrolledCard>
                      </Grid>
                      <Grid item xs={6}>
                        <img
                          src="https://www.istudiotech.in/wp-content/uploads/2021/01/3D-Animation-image-05.png"
                          style={{
                            width: "80%",
                            height: "auto",
                          }}
                          alt="newBranch"
                        />
                      </Grid>
                    </ControlledGrid>
                  </>
                ) : (
                  tabsValue == 1 && (
                    <>
                      <CollapsibleTable
                        data={data}
                        columns={columns}
                        pg={pg}
                        rpg={rpg}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </>
                  )
                )}
              </ControlledTabs>
            </UncontrolledCard>
          </Container>
        </>
      )}
    </>
  );
};

export default Services;
