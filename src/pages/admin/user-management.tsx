import { UAMFormAdditionalDetails } from "@/components/Forms/UserManagement";
import { useState, useEffect } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import {
  Chip,
  Container,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  ControlledBackdrop,
  ControlledGrid,
  NormalButton,
  UncontrolledCard,
} from "@/components";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useUserContext } from "@/utils/context/UserContext/UserContext";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useReferences } from "@/utils/hooks/useToken";

const UserManagement: React.FC = () => {
  const columns: any[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable",
      sortable: false,
      width: 160,
      valueGetter: (params: any) =>
        `${params.row.firstname || ""} ${params.row.middlename || ""} ${
          params.row.lastname || ""
        }`,
    },
    {
      field: "email",
      headerName: "Email",
      sortable: false,
      width: 250,
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 250,
      renderCell: (params: any) => {
        switch (params.row.branch) {
          case 1:
            return "Palo Alto Calamba City, Laguna";
          case 2:
            return "Halang Calamba City, Laguna";
          case 3:
            return "Tambo Lipa City, Batangas";
          case 4:
            return "Sabang Lipa City, Batangas";
          case 5:
            return "Batangas City";
          case 6:
            return "All Branch";
        }
      },
    },
    {
      field: "access_level",
      headerName: "AccessLevel",
      width: 130,
      renderCell: (params: any) => {
        if (params.row.access_level == 1) {
          return (
            <>
              <Chip
                variant="outlined"
                size="small"
                label="Administrator"
                color="primary"
              />
            </>
          );
        } else {
          return (
            <>
              <Chip
                variant="outlined"
                size="small"
                label="Manager"
                color="warning"
              />
            </>
          );
        }
      },
    },
    {
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params: any) => {
        if (params.row.email?.includes(references?.email)) {
          return;
        } else {
          return (
            <>
              <NormalButton
                variant="text"
                color="error"
                size="small"
                onClick={() => handleDeleteUser(params.row.id)}
              >
                DELETE
              </NormalButton>
            </>
          );
        }
      },
    },
  ];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const deleteUserUAM = useApiCallBack(
    async (api, id: number) => await api.users.UAMDeleteUser(id)
  );
  const requestToBeFilteredAccessLevel = useApiCallBack(
    async (api, access_level: number) =>
      await api.users.FilterAccessLevel(access_level)
  );
  const [searched, setSearched] = useState<string | null>(null);
  const { checkAuthentication } = useAuthenticationContext();
  const { lookAllUsersFromUAM } = useUserContext();
  const { handleOnToast } = useToastContext();
  const [preload, setPreLoad] = useState(false);
  const [references, setReferences] = useReferences();
  const [userAccess, setUserAccess] = useState<
    Array<{
      id: number;
      access_level: number;
      label: string;
    }>
  >([
    {
      id: 1,
      access_level: 0,
      label: "All Access Level",
    },
    {
      id: 2,
      access_level: 1,
      label: "Administrator",
    },
    {
      id: 3,
      access_level: 2,
      label: "Managers",
    },
    {
      id: 4,
      access_level: 3,
      label: "Customers",
    },
  ]);
  const globalSearch = (): Array<{
    id: number;
    firstname: string;
    lastname: string;
  }> => {
    const filteredOnSearch = users.filter((value: any) => {
      return (
        value?.firstname?.toLowerCase().includes(searched?.toLowerCase()) ||
        value?.lastname?.toLowerCase().includes(searched?.toLowerCase()) ||
        value?.id
          ?.toString()
          .toLowerCase()
          .includes(searched?.toLocaleUpperCase())
      );
    });
    return filteredOnSearch;
  };
  const filteredDistrubute:
    | Array<{ id: number; firstname: string; lastname: string }>
    | [] = searched ? globalSearch() : users;
  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res == "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);
  function FuncLoadUsers() {
    lookAllUsersFromUAM().then((res) => {
      setUsers(res);
    });
  }
  useEffect(() => {
    FuncLoadUsers();
  }, []);
  const handleDeleteUser = (id: number) => {
    var asks = window.confirm("Are you sure you want to delete this user?");
    if (asks) {
      setLoading(!loading);
      deleteUserUAM.execute(id).then((response) => {
        if (response?.data == 200) {
          handleOnToast(
            "Successfully deleted.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
          setLoading(false);
          FuncLoadUsers();
        }
      });
    }
  };
  const handleSelectUserAccess = (event: any) => {
    const accessLevel = event.target.value;
    setPreLoad(!preload);
    if (accessLevel != 0) {
      requestToBeFilteredAccessLevel.execute(accessLevel).then((response) => {
        setPreLoad(false);
        setUsers(response.data);
      });
    } else {
      FuncLoadUsers();
      setPreLoad(false);
    }
  };
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container>
          <UncontrolledCard>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <UAMFormAdditionalDetails />
          </UncontrolledCard>
          <UncontrolledCard style={{ marginTop: "10px" }}>
            <Typography variant="caption" gutterBottom>
              User Management List
            </Typography>
            <UncontrolledCard
              style={{
                marginBottom: "10px",
              }}
            >
              <Typography variant="caption">Filtering</Typography> <br />
              <ControlledGrid>
                <Grid item xs={6}>
                  <UncontrolledCard>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Select user access
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={handleSelectUserAccess}
                    >
                      {userAccess?.length > 0 &&
                        userAccess.map((item, index) => (
                          <FormControlLabel
                            key={index}
                            value={item.access_level}
                            control={<Radio />}
                            label={item.label}
                          />
                        ))}
                    </RadioGroup>
                  </UncontrolledCard>
                </Grid>
                <Grid item xs={6}>
                  <UncontrolledCard>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Search"
                      onChange={(e) => setSearched(e.target.value)}
                    ></TextField>
                  </UncontrolledCard>
                </Grid>
              </ControlledGrid>
            </UncontrolledCard>

            <ProjectTable
              pageSize={5}
              data={filteredDistrubute && filteredDistrubute}
              columns={columns}
            />
          </UncontrolledCard>
          <ControlledBackdrop open={preload} />
        </Container>
      )}
    </>
  );
};

export default UserManagement;
