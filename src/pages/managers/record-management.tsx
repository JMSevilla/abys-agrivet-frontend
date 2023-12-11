import {
  ControlledBackdrop,
  ControlledGrid,
  ControlledTabs,
  NormalButton,
  UncontrolledCard,
} from "@/components";
import ControlledModal from "@/components/Modal/Modal";
import { FollowUpCollapsibleTable } from "@/components/Table/FollowUpCollapsibleTable";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useReferences } from "@/utils/hooks/useToken";
import {
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import PageviewIcon from "@mui/icons-material/Pageview";
import { AxiosResponse } from "axios";

const RecordManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [preload, setPreLoad] = useState(false);
  const { checkAuthentication } = useAuthenticationContext();
  const [feed, setFeed] = useState([]);
  const [references, setReferences] = useReferences();
  const [viewMoreModal, setViewMoreModal] = useState(false);
  const [load, setLoad] = useState(false);
  const [searched, setSearched] = useState<string>("");
  const [followupFeed, setFollowUpFeed] = useState([]);
  const [radioBranches, setRadioBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [pg, setpg] = useState(0);
  const [rpg, setrpg] = useState(5);
  const [primaryAppointments, setPrimaryAppointments] = useState([]);
  const [petInfoViewMore, setPetInfoViewMore] = useState<boolean>(false);
  const [savedReferences, setSavedReferences] = useState<any>({
    id: null,
    service: null,
    customerName: "",
    branchName: "",
    petInfo: null,
    branch_id: 0,
    session: 0,
    managersId: 0,
    managersData: {},
  });
  const [tabsValue, setTabsValue] = useState<number>(0);
  const findAllRecordPerBranch = useApiCallBack(
    async (api, branch_id: number) =>
      await api.abys.FindAllRecordPerBranch(branch_id)
  );
  const findAllRecordAllBranch = useApiCallBack((api) =>
    api.abys.GetAllRecordAllBranch()
  );
  const findByUserByManagerId = useApiCallBack(
    async (api, manager_id: number) =>
      await api.abys.FindUserByManagerId(manager_id)
  );
  const findFollowUpsByAPId = useApiCallBack(
    async (api, id: number) => await api.abys.FindFollowUpsByAPId(id)
  );
  const findPrimaryAppointmentsById = useApiCallBack(
    async (api, id: number) => await api.abys.FindPrimaryAppointments(id)
  );
  const findAllBranchesList = useApiCallBack((api) =>
    api.abys.findAllBranchesManagement()
  );
  const apiDeleteRecords = useApiCallBack(
    async (api, id: number) => await api.abys.deleteRecords(id)
  );
  const filterRecordsByBranch = useApiCallBack(
    async (api, branch_id: number) =>
      await api.abys.FilterRecordsByBranch(branch_id)
  );
  const { handleOnToast } = useToastContext();
  function FuncGetAllBranchesToBeMapOnRadio() {
    findAllBranchesList.execute().then((res) => {
      setRadioBranches(res.data);
    });
  }
  const globalSearch = (): Array<{ id: number; customerName: string }> => {
    const filteredFollowUps = feed?.filter((value: any) => {
      return (
        value?.fullName?.toLowerCase().includes(searched?.toLowerCase()) ||
        value?.id?.toString().toLowerCase().includes(searched?.toLowerCase())
      );
    });
    return filteredFollowUps;
  };

  const globalSearchFollowUps = (): Array<{
    id: number;
    customerName: string;
  }> => {
    const filteredFollowUps = followupFeed?.filter((value: any) => {
      return (
        value?.customerName?.toLowerCase().includes(search?.toLowerCase()) ||
        value?.id?.toString().toLowerCase().includes(search?.toLowerCase())
      );
    });
    return filteredFollowUps;
  };

  const filteredDistributedFollowUps:
    | Array<{ id: number; customerName: string }>
    | [] = searched ? globalSearch() : feed;

  const filteredFollowUps: Array<{ id: number; customerName: string }> | [] =
    searched ? globalSearch() : followupFeed;

  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res === "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);
  const handleViewAllFollowUpsByApId = (id: number) => {
    setLoad(!load);
    findFollowUpsByAPId.execute(id).then((response) => {
      setFollowUpFeed(response?.data);
    });
  };
  const handeViewAllPrimaryAppointments = (id: number) => {
    setLoad(!load);
    findPrimaryAppointmentsById.execute(id).then((response) => {
      const result =
        response.data?.length > 0 &&
        response.data.map((item: any) => {
          const toBeParsed = JSON.parse(item.appointmentSchedule);
          return toBeParsed;
        });
      if (result) {
        setPrimaryAppointments(result[0]);
      }
    });
  };
  function FuncFindAllRecordsPerBranch() {
    findAllRecordAllBranch
      .execute()
      .then((response: AxiosResponse | undefined) => {
        // setFeed(response?.data);
        console.log(response?.data);
      });
  }
  useEffect(() => {
    // FuncFindAllRecordsPerBranch();
    FuncGetAllBranchesToBeMapOnRadio();
  }, []);
  const columns: any[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "fullName",
      headerName: "CUSTOMER NAME",
      sortable: false,
      width: 400,
    },
    {
      field: "reminderType",
      headerName: "REMINDER",
      width: 150,
      renderCell: (params: any) => {
        switch (params.row.reminderType) {
          case 1:
            return (
              <Chip
                variant="filled"
                size="small"
                label="EMAIL"
                color="success"
              />
            );
          case 0:
            return (
              <Chip variant="filled" size="small" label="SMS" color="warning" />
            );
        }
      },
    },
    {
      headerName: "ACTIONS",
      width: 450,
      renderCell: (params: any) => {
        return (
          <>
            <div style={{ display: "flex" }}>
              <NormalButton
                size="small"
                variant="outlined"
                onClick={() =>
                  handleViewMore(
                    params.row.id,
                    params.row.service_id,
                    params.row.fullName,
                    params.row.branch_id,
                    params.row.petInfo,
                    params.row.isSessionStarted,
                    params.row.managersId,
                    params.row.email,
                    params.row.phoneNumber
                  )
                }
              >
                View more
              </NormalButton>
              &nbsp;
              <NormalButton
                variant="outlined"
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </NormalButton>
            </div>
          </>
        );
      },
    },
  ];
  const gridPrimaryList = useMemo(() => {
    const primaryColumns: any = [
      {
        field: "id",
        headerName: "ID",
        width: 80,
      },
      {
        field: "title",
        headerName: "Title",
        width: 120,
        sortable: false,
      },
      {
        field: "isHoliday",
        headerName: "Holiday",
        sortable: false,
        width: 120,
        renderCell: (params: any) => {
          if (params.row.isHoliday) {
            return <Chip size="small" color="error" label="Holiday" />;
          } else {
            return <Chip size="small" color="success" label="Normal Day" />;
          }
        },
      },
      {
        field: "start",
        headerName: "Appointment Start",
        sortable: false,
        width: 180,
        valueGetter: (params: any) => `${moment(params.row.start).calendar()}`,
      },
      {
        field: "end",
        headerName: "Appointment End",
        sortable: false,
        width: 180,
        valueGetter: (params: any) => `${moment(params.row.end).calendar()}`,
      },
    ];
    return (
      <>
        <ProjectTable
          columns={primaryColumns}
          data={primaryAppointments ?? primaryAppointments}
          sx={{ width: "100%" }}
          pageSize={10}
        />
      </>
    );
  }, [primaryAppointments]);
  const followUpAppointmentList = useMemo(() => {}, [followupFeed]);
  const handleDelete = (id: number) => {
    setPreLoad(!preload);
    apiDeleteRecords.execute(id).then((res) => {
      if (res.data == 200) {
        handleOnToast(
          "Successfully moved to archive.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
        );
        FuncFindAllRecordsPerBranch();
        setPreLoad(false);
      }
    });
  };
  const branchIdentifier = (branch_id: number) => {
    switch (branch_id) {
      case 1:
        return "Palo-Alto Calamba City, Laguna";
      case 2:
        return "Halang Calamba City, Laguna";
      case 3:
        return "Tambo Lipa City, Batangas";
      case 4:
        return "Sabang Lipa City, Batangas";
      case 5:
        return "Batangas City";
    }
  };
  const handleViewMore = (
    id: number,
    services: any,
    fullName: string,
    branch_id: number,
    petInfo: any,
    session: number,
    managersId: number,
    email: string,
    phoneNumber: number
  ) => {
    findByUserByManagerId.execute(managersId).then((response) => {
      const newSavedReferences = {
        ...savedReferences,
        id: id,
        service: JSON.parse(services),
        customerName: fullName,
        branchName: branchIdentifier(branch_id),
        petInfo: JSON.parse(petInfo),
        branch_id: branch_id,
        session: session,
        managersId: managersId,
        managersData: response.data,
        email: email,
        phone: phoneNumber,
      };
      console.log(JSON.parse(petInfo));
      handeViewAllPrimaryAppointments(id);
      handleViewAllFollowUpsByApId(id);
      setSavedReferences(newSavedReferences);
      setViewMoreModal(!viewMoreModal);
    });
  };
  const handleChange = (event: any) => {
    const value = event.currentTarget.value;
    setSearched(value);
  };
  const handleSelectedBranches = (event: any) => {
    const branchId = event.target.value;
    setPreLoad(!preload);
    filterRecordsByBranch.execute(branchId).then((response) => {
      setPreLoad(false);
      setFeed(response.data);
    });
  };
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  const handleViewMorePetInfo = () => {
    setPetInfoViewMore(!petInfoViewMore);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  };
  const handleSearch = (event: any) => {
    const values = event.currentTarget.value;
    setSearch(values);
  };
  const handleChangePage = (event: any, newpage: any) => {
    setpg(newpage);
  };
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <>
          <ControlledTabs
            orientation="vertical"
            handleChange={handleChangeTabs}
            value={tabsValue}
            tabsinject={[
              {
                label: "Client Records",
              },
            ]}
          >
            {tabsValue == 0 && (
              <Container>
                <UncontrolledCard>
                  <Typography variant="overline">Record Management</Typography>
                  <UncontrolledCard style={{ marginTop: "10px" }}>
                    <ControlledGrid>
                      <Grid item xs={6}>
                        <UncontrolledCard>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Select Branches
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              onChange={handleSelectedBranches}
                            >
                              {radioBranches?.length > 0 &&
                                radioBranches?.map((item: any, index) => (
                                  <FormControlLabel
                                    key={index}
                                    value={item?.branch_id}
                                    control={<Radio />}
                                    label={item?.branchName}
                                  />
                                ))}
                            </RadioGroup>
                          </FormControl>
                        </UncontrolledCard>
                      </Grid>
                      <Grid item xs={6}>
                        <UncontrolledCard>
                          <TextField
                            placeholder="Search"
                            variant="filled"
                            onChange={handleChange}
                            fullWidth
                          ></TextField>
                        </UncontrolledCard>
                      </Grid>
                    </ControlledGrid>
                  </UncontrolledCard>
                  <ProjectTable
                    pageSize={5}
                    columns={columns}
                    data={filteredDistributedFollowUps ?? feed}
                    sx={{ mt: 3 }}
                  />
                </UncontrolledCard>
                <ControlledModal
                  open={viewMoreModal}
                  title="View more details"
                  hideAgreeButton
                  buttonTextDecline="CLOSE"
                  maxWidth="lg"
                  handleClose={() => {
                    setViewMoreModal(false),
                      setFollowUpFeed([]),
                      setPetInfoViewMore(false);
                  }}
                  handleDecline={() => {
                    setViewMoreModal(false),
                      setFollowUpFeed([]),
                      setPetInfoViewMore(false);
                  }}
                >
                  <Typography variant="overline">
                    This appointment handled by :{" "}
                    {savedReferences?.managersData?.firstname}
                  </Typography>
                  <ControlledGrid>
                    <Grid item xs={4}>
                      <UncontrolledCard>
                        <Typography variant="button" gutterBottom>
                          Basic Informations
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Name"
                              secondary={savedReferences?.customerName}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Email"
                              secondary={savedReferences?.email}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Contact #"
                              secondary={savedReferences?.phone}
                            />
                          </ListItem>
                        </List>
                      </UncontrolledCard>
                    </Grid>
                    <Grid item xs={8}>
                      <UncontrolledCard>
                        <Typography variant="button" gutterBottom>
                          Pets List
                        </Typography>
                        {savedReferences?.petInfo?.length > 0 &&
                          savedReferences?.petInfo.map(
                            (item: any, index: any) => (
                              <List sx={{ bgcolor: "lightgrey" }} key={index}>
                                <ListItem
                                  key={index}
                                  secondaryAction={
                                    <IconButton
                                      onClick={handleViewMorePetInfo}
                                      edge="end"
                                      aria-label="View more"
                                    >
                                      <PageviewIcon />
                                    </IconButton>
                                  }
                                >
                                  <ListItemText
                                    primary={item.petName}
                                    secondary={item.petType}
                                  />
                                </ListItem>
                              </List>
                            )
                          )}
                      </UncontrolledCard>
                      {petInfoViewMore && (
                        <>
                          <UncontrolledCard style={{ marginTop: "10px" }}>
                            <Typography variant="button">
                              Services info
                            </Typography>
                            <hr />
                            {savedReferences?.service?.length > 0 &&
                              savedReferences?.service.map((serv: any) => {
                                const breakdown = JSON.parse(
                                  serv.serviceBranch
                                );
                                return (
                                  <>
                                    {breakdown?.length > 0 &&
                                      breakdown.map((bk: any, index: any) => (
                                        <List
                                          sx={{ bgcolor: "lightgrey" }}
                                          key={index}
                                        >
                                          <ListItem>
                                            <ListItemText
                                              primary={serv.serviceName}
                                              secondary={bk.branchName}
                                            />
                                          </ListItem>
                                        </List>
                                      ))}
                                  </>
                                );
                              })}
                          </UncontrolledCard>
                          <UncontrolledCard style={{ marginTop: "10px" }}>
                            <Typography variant="button">
                              Pet other info
                            </Typography>
                            <hr />
                            {savedReferences?.petInfo?.length > 0 &&
                              savedReferences.petInfo.map(
                                (serv: any, index: any) => {
                                  return (
                                    <List
                                      key={index}
                                      sx={{ bgcolor: "lightgrey" }}
                                    >
                                      <ListItem>
                                        <ListItemText
                                          primary={serv.petType}
                                          secondary={serv.breed}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary={"Gender"}
                                          secondary={serv.gender}
                                        />
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText
                                          primary={"Birthdate"}
                                          secondary={moment(serv.birthdate)
                                            .subtract(1, "day")
                                            .format("MMM Do YY")}
                                        />
                                      </ListItem>
                                    </List>
                                  );
                                }
                              )}
                          </UncontrolledCard>
                        </>
                      )}
                    </Grid>
                  </ControlledGrid>
                  <UncontrolledCard
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <Typography variant="caption" gutterBottom>
                      Follow-up appointment
                    </Typography>
                    <div style={{ display: "inline" }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search"
                        fullWidth
                        sx={{ mb: 2 }}
                        onChange={handleSearch}
                      ></TextField>
                    </div>
                    <FollowUpCollapsibleTable
                      data={filteredFollowUps}
                      columns={columns}
                      pg={pg}
                      rpg={rpg}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      handleFollowUpSessions={() => {}}
                    />
                  </UncontrolledCard>
                  <UncontrolledCard
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <Typography gutterBottom variant="caption">
                      Appointment
                    </Typography>
                    {gridPrimaryList}
                  </UncontrolledCard>
                </ControlledModal>
              </Container>
            )}
          </ControlledTabs>
        </>
      )}
    </>
  );
};

export default RecordManagement;
