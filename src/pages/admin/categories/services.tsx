import { ControlledBackdrop, ControlledGrid } from "@/components";
import {
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
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
  const [radioBranches, setRadioBranches] = useState([])
  const [preload, setPreLoad] = useState(false)
  const [data, setData] = useState([])
  const handleTabsValue = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  const { handleOnToast } = useToastContext()
  const deleteService = useApiCallBack(
    async (api, id: number) => await api.abys.DeleteService(id)
  )
  const findAllBranchesList = useApiCallBack((api) =>
    api.abys.findAllBranchesManagement()
  );
  const getAllServicesRequest = useApiCallBack((api) =>
    api.abys.getAllServices()
  );
  const handleChangePage = (event: any, newpage: any) => {
    setpg(newpage);
  };
  const FilteredServices = useApiCallBack(
    async (api, branch_id: number) => await api.users.FilterServices(branch_id)
  )
  const globalSearch = (): TableSearchProps[] => {
    const filteredRepositories = data?.filter((value: any) => {
      return (
        value?.serviceName?.toLowerCase().includes(searched?.toLowerCase()) ||
        value?.id
          ?.toString()
          .toLowerCase()
          .includes(searched?.toLowerCase())
      );
    });
    return filteredRepositories;
  };
  function FuncGetAllBranchesToBeMapOnRadio() {
    findAllBranchesList.execute()
    .then((res) => {
      setRadioBranches(res.data)
    })
  }
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
  function FuncFindAllServices() {
    getAllServicesRequest.execute().then((response) => {
      setData(response.data)
    })
  }
  useEffect(() => {
    FuncGetAllBranchesToBeMapOnRadio()
    FuncFindAllServices()
  }, [])
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
  const DeleteService = (id: number) => {
    setLoading(!loading)
    deleteService.execute(id)
    .then((res) => {
      if(res.data == 200) {
        handleOnToast(
          "Successfully started the session.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
      );
      setLoading(false)
      }
    })
  }
  const handleSelectedBranches = (event: any) => {
    const branchId = event.target.value;
    // setPreLoad(!preload)
    const filteredReportServices = data?.length > 0 && data?.filter((item: any) => {
      const parsedData = JSON.parse(item?.serviceBranch)
      return parsedData?.some((second: any) => second?.branch_id === branchId)
    })
    console.log(filteredReportServices)
  }
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
                    <UncontrolledCard
                    style={{
                      marginTop: '10px',
                      marginBottom: '10px'
                    }}
                    >
                      <UncontrolledCard>
                        <Typography variant='caption'>Search</Typography>
                      <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Search services"
                      onChange={(e) => setSearched(e.target.value)}
                      ></TextField>
                        </UncontrolledCard>
                    </UncontrolledCard>
                      <CollapsibleTable
                        data={filterTableSearchList && filterTableSearchList}
                        columns={columns}
                        pg={pg}
                        rpg={rpg}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        handleChangeDeletion={DeleteService}
                      />
                    </>
                  )
                )}
              </ControlledTabs>
            </UncontrolledCard>
            <ControlledBackdrop open={preload} />
          </Container>
        </>
      )}
    </>
  );
};

export default Services;

