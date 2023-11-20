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
import { useState, useEffect, ChangeEventHandler } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { ControlledTabs } from "@/components";
import { ServiceFormField } from "@/components/Forms/Services/ServicesForm";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useQuery } from "react-query";
import { CollapsibleTable } from "@/components/Table/CollapsibleTable";
import { TableSearchProps } from "@/utils/types";
import ControlledModal from "@/components/Modal/Modal";
import BasicSelectField from "@/components/SelectField/BasicSelectField";

const Services: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { checkAuthentication } = useAuthenticationContext();
  const [tabsValue, setTabsValue] = useState(0);
  const [pg, setpg] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [servicesModify, setServicesModify] = useState<any>({})
  const [modifyModal, setModifyModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [rpg, setrpg] = useState(5);
  const [radioBranches, setRadioBranches] = useState([])
  const [preload, setPreLoad] = useState(false)
  const [data, setData] = useState([])
  const handleTabsValue = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  const [branch, setBranch] = useState<any>([]);

  const { handleOnToast } = useToastContext()
  const deleteService = useApiCallBack(
    async (api, id: number) => await api.abys.DeleteService(id)
  )
  const modifyPrimaryDetails = useApiCallBack(
    async (api, args: { id: number, serviceName: string }) => await api.abys.modifyPrimaryServiceDetails(args)
  )
  const findAllBranchesList = useApiCallBack((api) =>
    api.abys.findAllBranchesManagement()
  );
  const getAllServicesRequest = useApiCallBack((api) =>
    api.abys.getAllServices()
  );
  const activateServices = useApiCallBack(
    async (api, args: {id: number, type: string}) => await api.abys.activateServices(args)
  )
  const handleChangePage = (event: any, newpage: any) => {
    setpg(newpage);
  };
  const FilteredServices = useApiCallBack(
    async (api, branch_id: number) => await api.users.FilterServices(branch_id)
  )
  const FindAllBranchesRequest = useApiCallBack((api) =>
    api.abys.GetAllBranches()
  );
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
  useEffect(() => {
    FindAllBranchesRequest.execute().then((response) => {
      const { data }: any = response;
      if (data.length > 0) {
        const newBranch = [...data];
        newBranch.splice(5, 1);
        console.log(newBranch)
        setBranch(newBranch);
      } else {
        setBranch([]);
      }
    });
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
  }
  const handleChangeEdit = (row: any) => {
    setServicesModify(row)
    setModifyModal(!modifyModal)
  }
  const handleActivation = (id: number, services: number) => {
    setLoading(!loading)
    activateServices.execute({
      id: id,
      type: services == 1 ? 'deactivate': 'activate'
    }).then(res => {
      if(res.data == 200) {
        handleOnToast(
          "Successfully activated/deactivated services.",
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
      FuncGetAllBranchesToBeMapOnRadio()
      FuncFindAllServices()
      }
    })
  }
  const handleChangeServicesName = (event: any) => {
    const value = event.target.value;
    setServicesModify((prevState: any) => ({
      ...prevState,
      serviceName: value
    }))
  }
  const handleSaveModification = () => {
    setLoading(!loading)
    modifyPrimaryDetails.execute({
      id: servicesModify.id,
      serviceName: servicesModify.serviceName
    }).then(res => {
      if(res.data === 200) {
        handleOnToast(
            "Successfully modify.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
        );
        setModifyModal(false)
        setLoading(false)
        FuncGetAllBranchesToBeMapOnRadio()
        FuncFindAllServices()
      }
    })
  }
  const handleOpenAddBranch = () => {
    setAddModal(!addModal)
  }
  const handleChangeBranch = (value: any) => {
    console.log(value)
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
                        handleChangeActivation={handleActivation}
                        handleChangeEdit={handleChangeEdit}
                        handleAddNewBranch={handleOpenAddBranch}
                      />
                      <ControlledModal
                        open={modifyModal}
                        buttonTextAccept="SAVE"
                        buttonTextDecline="CANCEL"
                        handleClose={() => setModifyModal(false)}
                        handleDecline={() => setModifyModal(false)}
                        title="Services Modification"
                        handleSubmit={handleSaveModification}
                      >
                        <Typography variant='button'>
                          Services Modification
                        </Typography> <br />
                        <TextField 
                          value={servicesModify.serviceName}
                          variant='outlined'
                          size='small'
                          label='Service Name'
                          sx={{ width: '100%', mt:2 }}
                          onChange={handleChangeServicesName}
                        />
                      </ControlledModal>
                      <ControlledModal
                        open={addModal}
                        buttonTextAccept="SAVE"
                        buttonTextDecline="CANCEL"
                        handleClose={() => setAddModal(false)}
                        handleDecline={() => setAddModal(false)}
                        title="Branch Modification"
                        handleSubmit={() => {}}
                      >
                         <Typography variant='button'>
                          Adding branch
                        </Typography> <br />
                        <BasicSelectField 
                          label="Select branch"
                          options={branch}
                          onChange={handleChangeBranch}
                          value={''}
                          
                        />
                      </ControlledModal> 
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

