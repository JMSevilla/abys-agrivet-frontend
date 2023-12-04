import {
  Alert,
  Card,
  CardContent,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Popover,
  Switch,
  Typography,
} from "@mui/material";
import {
  ControlledBackdrop,
  ControlledCheckbox,
  ControlledGrid,
  ControlledMultipleSelectField,
  ControlledSelectField,
  ControlledTextField,
  NormalButton,
  UncontrolledCard,
} from "@/components";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { useForm, useFieldArray } from "react-hook-form";
import {
  WalkedInSchema,
  WalkedInType,
} from "@/utils/schema/Appointment/WalkedInAppointmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { WalkedInAtom } from "@/utils/hooks/useAtomic";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { useReferences } from "@/utils/hooks/useToken";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { ProjectTable } from "@/components/Table/ProjectTable";
import ControlledModal from "@/components/Modal/Modal";
import { ControlledRichTextField } from "@/components/TextField/RichTextField";
import { Timeline } from "@/components/Timeline/Timeline";
import { SchedulerCalendar } from "@/components/Calendar/Calendar";
import moment from "moment";
import { SlotInfo } from "react-big-calendar";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useMutation } from "react-query";
import { styled, css } from "@mui/material";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";
import { CreateNewAppointment, CreateNewLobbyAppointment } from "@/utils/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DatePicker } from "@mui/x-date-pickers";

const WalkedIn: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { checkAuthentication } = useAuthenticationContext();
  const [walkedin, setWalkedIn] = useAtom(WalkedInAtom);
  const [references, setReferences] = useReferences();
  const [services, setServices] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [removeId, setRemoveId] = useState(0);
  const [removeModal, setRemoveModal] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [asks, setAsks] = useState(false);
  const [isLobby, setIsLobby] = useState(false);
  const [viewLobby, setViewLobby] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const pageSize = 5;
  const handleCardSelected = (cardId: any) => {
    setSelectedCard(cardId);
  };
  const handlePopOver = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCollapsePopOver = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const GetAllSchedulePerBranch = useApiCallBack(
    async (
      api,
      args: {
        branch: number;
        userid?: number;
      }
    ) => await api.abys.findAllSchedulePerBranch(args)
  );
  const checkIfDayPropsIsHoliday = useApiCallBack(
    async (api, id: number) => await api.abys.CheckIfDayPropIsHoliday(id)
  );
  const checkBeforeRemoving = useApiCallBack(
    async (api, id: number) => await api.abys.checkBeforeRemovingSchedule(id)
  );
  const deleteSelectedEvent = useApiCallBack(
    async (api, id: number) => await api.abys.handleSelectedSchedule(id)
  );
  const useDeleteSelectedEvent = () => {
    return useMutation((id: number) => deleteSelectedEvent.execute(id));
  };
  const createNewAppointment = useApiCallBack(
    async (api, args: CreateNewAppointment) =>
      await api.abys.CreateNewAppointment(args)
  );
  const useCreateNewAppoinment = useMutation((data: CreateNewAppointment) =>
    createNewAppointment.execute(data)
  );
  const preventEventDeletionWhenSavedOnDatabase = useApiCallBack(
    async (api, id: number) => await api.abys.CheckSavedEventOnDB(id)
  );
  const createAppointmentToLobby = useApiCallBack(
    async (api, args: CreateNewLobbyAppointment) =>
      await api.abys.newLobbyAppointment(args)
  );
  const deleteFromLobby = useApiCallBack(
    async (api, id: number) => await api.abys.DeleteAfterProceedFromLobby(id)
  );
  const findAllInLobbies = useApiCallBack(
    async (api, branch_id: number) =>
      await api.abys.FindAllWalkedInLobbies(branch_id)
  );
  const cancelAppointmentLobby = useApiCallBack(
    async (api, id: number) => await api.abys.CancelAppointmentOnLobby(id)
  );
  const checkAffectedAppointments = useApiCallBack(
    async (api, args: { start: Date; end: Date }) =>
      await api.abys.findAffectedSchedules(args)
  );
  const { mutate } = useDeleteSelectedEvent();
  const getHighestID = useApiCallBack((api) => api.abys.getHighestID());
  const [feed, setFeed] = useState<
    Array<{
      id: number;
      title: string;
      start: Date;
      end: Date;
      isHoliday?: boolean | undefined;
    }>
  >([]);
  const [pets, setPets] = useState<
    Array<{
      name: string;
      label: string;
      value: string;
    }>
  >([
    {
      label: "Dog",
      name: "Dog",
      value: "dog",
    },
    {
      label: "Cat",
      name: "Cat",
      value: "cat",
    },
    {
      label: "Others",
      name: "Others",
      value: "Others",
    },
  ]);
  const [lobbyList, setLobbyList] = useState([]);
  const [backdrop, setBackdrop] = useState(false);
  const FuncFindAllWalkedInFromLobbies = () => {
    findAllInLobbies.execute(references?.branch).then((response) => {
      setLobbyList(response?.data);
    });
  };
  const getAllSchedulePerBranches = () => {
    GetAllSchedulePerBranch.execute({
      branch: references?.branch ?? 0,
      userid: 0,
    }).then((response) => {
      if (response?.data?.length > 0) {
        var chk = response?.data?.map((item: any) => {
          return {
            id: item?.id,
            title: item?.title,
            start: item?.start,
            end: item?.end,
            isHoliday: item?.isHoliday,
          };
        });
        setFeed(chk);
      } else {
        setFeed([]);
      }
    });
  };
  useEffect(() => {
    getAllSchedulePerBranches();
    FuncFindAllWalkedInFromLobbies();
  }, []);
  const { handleOnToast } = useToastContext();
  const form = useForm<WalkedInType>({
    mode: "all",
    resolver: zodResolver(WalkedInSchema),
    defaultValues: walkedin ?? { hasNoMiddleName: false },
  });
  const {
    control,
    watch,
    trigger,
    resetField,
    setValue,
    getValues,
    formState: { isValid },
    reset,
  } = form;
  const getAllServices = useApiCallBack((api) => api.abys.getAllServices());
  const hasNoMiddleName = watch("hasNoMiddleName");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);
  const [gender, setGender] = useState<
    Array<{
      name: string;
      label: string;
      value: string;
    }>
  >([
    {
      label: "Male",
      name: "Male",
      value: "male",
    },
    {
      label: "Female",
      name: "Female",
      value: "female",
    },
  ]);
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
  const { fields, append, remove } = useFieldArray({
    name: "petInfo",
    control,
  });
  const addNewPetInformation = () => {
    append({
      petName: "",
      petType: "",
      otherConcerns: "",
      birthdate: new Date(),
      breed: "",
      gender: "",
    });
  };
  const handleCancelAppointment = (id: number) => {
    cancelAppointmentLobby.execute(id).then((response) => {
      if (response.data == 200) {
        FuncFindAllWalkedInFromLobbies();
      }
    });
  };
  useEffect(() => {
    setValue("branchName", branchIdentifier(references?.branch));
    setValue("branch_id", references?.branch);
    getAllServices.execute().then((response) => {
      const filtered =
        response?.data?.length > 0 &&
        response?.data?.filter((o: any) => {
          let preFiltered = JSON.parse(o?.serviceBranch);
          return preFiltered.some(
            (nested: any) => nested.branch_id == references?.branch
          );
        });
      setServices(filtered);
    });
  }, []);
  useEffect(() => {
    resetField("middlename");
    if (hasNoMiddleNamePrevValue) {
      trigger("middlename");
    }
  }, [hasNoMiddleName, hasNoMiddleNamePrevValue, trigger, resetField]);
  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res == "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);
  const reverseFields = [...fields].reverse();
  const handleScheduleSelection = ({ start, end }: SlotInfo) => {
    setBackdrop(!backdrop);
    const selectedEvents = feed.filter((event) => {
      const eventStart = moment(event.start).add(1, "day");
      const eventEndDate = moment(event.end).subtract(1, "day");

      return (
        eventStart.isSameOrBefore(end) && eventEndDate.isSameOrAfter(start)
      );
    });
    const values = getValues();
    const eventStartDate = new Date(start);
    if (eventStartDate < new Date() && !moment(start).isSame(moment(), "day")) {
      setBackdrop(false);
      return;
    } else {
      checkAffectedAppointments
        .execute({
          start: new Date(start),
          end: new Date(start),
        })
        .then((reps) => {
          if (reps?.data?.length > 0) {
            setAsks(!asks);
            setBackdrop(false);
            if (isLobby) {
              if (values.appointmentSchedule?.length > 0) {
                handleOnToast(
                  "You already drop your appointment today. Delete the first one and appoint again.",
                  "top-right",
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  "dark",
                  "error"
                );
                setBackdrop(false);
                return;
              } else {
                if (selectedEvents?.length > 0) {
                  selectedEvents.map((item) => {
                    checkIfDayPropsIsHoliday.execute(item.id).then((res) => {
                      if (res?.data == 200) {
                        handleOnToast(
                          "Sorry but you cannot drop an appointment for this day because it is holiday.",
                          "top-right",
                          false,
                          true,
                          true,
                          true,
                          undefined,
                          "dark",
                          "error"
                        );
                        setBackdrop(false);
                      } else if (res?.data == 202) {
                        handleOnToast(
                          "Sorry but the schedule you want is planned to close.",
                          "top-right",
                          false,
                          true,
                          true,
                          true,
                          undefined,
                          "dark",
                          "error"
                        );
                        setBackdrop(false);
                      } else {
                        const prompt = window.prompt("Schedule title");
                        if (prompt) {
                          getHighestID.execute().then((repository) => {
                            const id =
                              repository?.data == null || repository?.data == ""
                                ? lastId + 1
                                : repository?.data?.id + 1;
                            const title = prompt;
                            const isHoliday = false;
                            const newSchedule = [
                              {
                                id,
                                start,
                                end: start,
                                title,
                                isHoliday,
                              },
                            ];
                            setBackdrop(false);
                            setFeed((prevState) => [
                              ...prevState,
                              ...newSchedule,
                            ]);
                            setValue("appointmentSchedule", newSchedule);
                            setValue("start", new Date(start));
                            setValue("end", new Date(start));
                            setLastId(lastId + 1);
                            setRemoveId(id);
                            setAsks(false);
                          });
                        } else {
                          setAsks(false);
                          setBackdrop(false);
                        }
                      }
                    });
                  });
                } else {
                  const prompt = window.prompt("Schedule title");
                  if (prompt) {
                    getHighestID.execute().then((repository) => {
                      const id =
                        repository?.data == null || repository?.data == ""
                          ? lastId + 1
                          : repository?.data?.id + 1;
                      const title = prompt;
                      const isHoliday = false;
                      const newSchedule = [
                        {
                          id,
                          start,
                          end: start,
                          title,
                          isHoliday,
                        },
                      ];
                      setBackdrop(false);
                      setFeed((prevState) => [...prevState, ...newSchedule]);
                      setValue("appointmentSchedule", newSchedule);
                      setValue("start", new Date(start));
                      setValue("end", new Date(start));
                      setLastId(lastId + 1);
                      setRemoveId(id);
                      setAsks(false);
                    });
                  } else {
                    setAsks(false);
                    setBackdrop(false);
                  }
                }
              }
            } else {
              setIsLobby(false);
            }
          } else {
            if (values.appointmentSchedule?.length > 0) {
              handleOnToast(
                "You already drop your appointment today. Delete the first one and appoint again.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setBackdrop(false);
              return;
            } else {
              if (selectedEvents?.length > 0) {
                selectedEvents.map((item) => {
                  checkIfDayPropsIsHoliday.execute(item.id).then((res) => {
                    if (res?.data == 200) {
                      handleOnToast(
                        "Sorry but you cannot drop an appointment for this day because it is holiday.",
                        "top-right",
                        false,
                        true,
                        true,
                        true,
                        undefined,
                        "dark",
                        "error"
                      );
                      setBackdrop(false);
                    } else if (res?.data == 202) {
                      handleOnToast(
                        "Sorry but the schedule you want is planned to close.",
                        "top-right",
                        false,
                        true,
                        true,
                        true,
                        undefined,
                        "dark",
                        "error"
                      );
                      setBackdrop(false);
                    } else {
                      const prompt = window.prompt("Schedule title");
                      if (prompt) {
                        getHighestID.execute().then((repository) => {
                          const id =
                            repository?.data == null || repository?.data == ""
                              ? lastId + 1
                              : repository?.data?.id + 1;
                          const title = prompt;
                          const isHoliday = false;
                          const newSchedule = [
                            {
                              id,
                              start,
                              end: start,
                              title,
                              isHoliday,
                            },
                          ];
                          setBackdrop(false);
                          setFeed((prevState) => [
                            ...prevState,
                            ...newSchedule,
                          ]);
                          setValue("appointmentSchedule", newSchedule);
                          setValue("start", new Date(start));
                          setValue("end", new Date(start));
                          setLastId(lastId + 1);
                          setRemoveId(id);
                        });
                      } else {
                        setBackdrop(false);
                      }
                    }
                  });
                });
              } else {
                const prompt = window.prompt("Schedule title");
                if (prompt) {
                  getHighestID.execute().then((repository) => {
                    const id =
                      repository?.data == null || repository?.data == ""
                        ? lastId + 1
                        : repository?.data?.id + 1;
                    const title = prompt;
                    const isHoliday = false;
                    const newSchedule = [
                      {
                        id,
                        start,
                        end: start,
                        title,
                        isHoliday,
                      },
                    ];
                    setBackdrop(false);
                    setFeed((prevState) => [...prevState, ...newSchedule]);
                    setValue("appointmentSchedule", newSchedule);
                    setValue("start", new Date(start));
                    setValue("end", new Date(end));
                    setLastId(lastId + 1);
                    setRemoveId(id);
                  });
                } else {
                  setBackdrop(false);
                }
              }
            }
          }
        });
    }
  };
  const handleSelectedEvent = (event: any) => {
    const closedCaseSensitive = event.title.toLowerCase();
    const closedIncludes =
      closedCaseSensitive.includes("closing") ||
      closedCaseSensitive.includes("closed") ||
      closedCaseSensitive.includes("store closed") ||
      closedCaseSensitive.includes("store closing");
    const eventStart = new Date(event?.start);
    const isPastDate = eventStart < new Date();
    if (isPastDate && !moment(event.start).isSame(moment(), "day")) {
      return;
    } else {
      if (event.isHoliday || closedIncludes) {
        return;
      } else {
        preventEventDeletionWhenSavedOnDatabase
          .execute(event.id)
          .then((response) => {
            if (response.data == 200) {
              handleOnToast(
                "This can't be deleted here. Unless it will marked as cancel appointment",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "warning"
              );
            } else {
              setRemoveId(event?.id);
              setRemoveModal(!removeModal);
            }
          });
      }
    }
  };
  const handleRemove = () => {
    setRemoveModal(false);
    setBackdrop(!backdrop);
    const index = feed.findIndex((item) => item.id == removeId);
    if (index !== -1) {
      const update = [...feed.slice(0, index), ...feed.slice(index + 1)];
      setFeed(update);
      setValue("appointmentSchedule", []);
      setIsLobby(false);
    }
    setBackdrop(false);
    checkBeforeRemoving.execute(removeId).then((res) => {
      if (res.data == 200) {
        mutate(removeId, {
          onSuccess: (response: any) => {
            if (response.data == 200) {
              handleOnToast(
                "Successfully Removed.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              getAllSchedulePerBranches();
              setBackdrop(false);
              setIsLobby(false);
            }
          },
        });
      } else {
        const index = feed.findIndex((item) => item.id == removeId);
        if (index !== -1) {
          const update = [...feed.slice(0, index), ...feed.slice(index + 1)];
          setFeed(update);
          setValue("appointmentSchedule", []);
          setIsLobby(false);
        }
        setBackdrop(false);
      }
    });
  };
  const isCardSelected = (cardId: any) => {
    return selectedCard === cardId;
  };
  const handleAppoint = () => {
    const values = getValues();
    setBackdrop(!backdrop);
    const obj = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      firstname: values.firstname,
      middlename: hasNoMiddleName ? values.middlename : "",
      lastname: values.lastname,
      fullName:
        values.firstname + " " + values.middlename + " " + values.lastname,
      branch_id: references?.branch,
      service_id: JSON.stringify(values.service_id),
      petInfo: JSON.stringify(values.petInfo),
      appointmentSchedule: JSON.stringify(values.appointmentSchedule),
      status: isLobby ? 0 : 1,
      isWalkedIn: 1,
      notify: 0,
      reminderType: selectedCard == 1 ? 1 : 0,
      isSessionStarted: 0,
      managersId: 0,
      created_at: values.start,
      updated_at: values.start,
    };
    if (!values) {
      handleOnToast(
        "Successfully created an appointment.",
        "top-right",
        false,
        true,
        true,
        true,
        undefined,
        "dark",
        "success"
      );
    } else {
      if (isLobby) {
        createAppointmentToLobby
          .execute(obj)
          .then((repo) => {
            if (repo.data == 200) {
              handleOnToast(
                "Successfully created an appointment to lobby.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setBackdrop(false);
              setIsLobby(false);
              reset({});
              FuncFindAllWalkedInFromLobbies();
              getAllSchedulePerBranches();
            } else {
              handleOnToast(
                "Something went wrong.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setBackdrop(false);
            }
          })
          .catch((err) => {
            handleOnToast(
              "There is something went wrong. Kindly please check the form.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setBackdrop(false);
          });
      } else {
        useCreateNewAppoinment.mutate(obj, {
          onSuccess: (response) => {
            if (response?.data == 200) {
              handleOnToast(
                "Successfully created an appointment.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setBackdrop(false);
            }
          },
          onError: (error) => {
            console.log(error);
            handleOnToast(
              "There is something went wrong. Kindly please check the form.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setBackdrop(false);
            reset({});
          },
        });
      }
    }
  };
  const handleYesToLobby = () => {
    setIsLobby(!isLobby);
    setAsks(false);
  };
  const lobbyColumns: any[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "fullName",
      headerName: "Customer name",
      sortable: false,
      width: 250,
      valueGetter: (params: any) => `${params.row.fullName}`,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      width: 250,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: any) => {
        if (params.row.status == 0) {
          return (
            <Chip
              variant="outlined"
              size="small"
              color="warning"
              label="Waiting"
            />
          );
        }
      },
    },
    {
      headerName: "actions",
      width: 150,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <IconButton
              aria-describedby={id}
              onClick={handlePopOver}
              aria-label="more-actions"
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCollapsePopOver}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <NormalButton
                variant="text"
                size="medium"
                color="success"
                fullWidth
                children="Proceed appointment"
                onClick={() =>
                  handleProceedAppointment(
                    params.row.id,
                    params.row.email,
                    params.row.phoneNumber,
                    params.row.fullName,
                    params.row.branch_id,
                    params.row.service_id,
                    params.row.petInfo,
                    params.row.appointmentSchedule,
                    params.row.status,
                    params.row.isWalkedIn,
                    params.row.notify,
                    params.row.reminderType,
                    params.row.isSessionStarted,
                    params.row.managersId,
                    params.row.created_at,
                    params.row.updated_at
                  )
                }
              />{" "}
              <br />
              <NormalButton
                variant="text"
                size="medium"
                color="error"
                fullWidth
                children="Cancel appointment"
                onClick={() => handleCancelAppointment(params.row.id)}
              />
            </Popover>
          </>
        );
      },
    },
  ];
  const handleProceedAppointment = (
    id: number,
    email: string,
    phoneNumber: string,
    fullName: string,
    branch_id: number,
    service_id: any,
    petInfo: any,
    appointmentSchedule: any,
    status: number,
    isWalkedIn: number,
    notify: number,
    reminderType: number,
    isSessionStarted: number,
    managersId: number,
    created_at: any,
    updated_at: any
  ) => {
    const obj = {
      email: email,
      phoneNumber: phoneNumber,
      fullName: fullName,
      branch_id: branch_id,
      service_id: service_id,
      petInfo: petInfo,
      appointmentSchedule: appointmentSchedule,
      status: 1,
      isWalkedIn: isWalkedIn,
      notify: notify,
      reminderType: reminderType,
      isSessionStarted: isSessionStarted,
      managersId: managersId,
      created_at: created_at,
      updated_at: updated_at,
    };
    setBackdrop(!backdrop);
    setViewLobby(false);
    useCreateNewAppoinment.mutate(obj, {
      onSuccess: (response) => {
        if (response?.data == 200) {
          deleteFromLobby.execute(id).then((deleteResponse) => {
            if (deleteResponse.data == 200) {
              handleOnToast(
                "Successfully created an appointment.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setBackdrop(false);
              FuncFindAllWalkedInFromLobbies();
              getAllSchedulePerBranches();
            } else {
              return;
            }
          });
        }
      },
      onError: (error) => {
        handleOnToast(
          "There is something went wrong. Kindly please check the form.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
        setBackdrop(false);
      },
    });
  };
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container maxWidth="xl">
          {isLobby && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
              }}
            >
              <Alert severity="info">
                This walk-in appointment will proceed to waiting lobby.
              </Alert>
            </div>
          )}
          <UncontrolledCard>
            <Typography variant="button">Walk-In Appointment Form</Typography>{" "}
            <br />
            <Typography variant="caption">
              Here you can add new appointment as walk-in customer
            </Typography>
            <div
              style={{
                float: "right",
                display: "inline",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isLobby}
                    onChange={() => setIsLobby(!isLobby)}
                    color="primary"
                  />
                }
                label={
                  !isLobby ? "Proceed to waiting lobby" : "Proceed to service"
                }
              />
              |
              <NormalButton
                size="small"
                variant="text"
                color="success"
                children="View lobby"
                onClick={() => setViewLobby(!viewLobby)}
              />
            </div>
            {/* walk in appointment form */}
            <UncontrolledCard style={{ marginTop: "20px" }}>
              <Typography variant="overline">
                Drop customer preferred schedule
              </Typography>
              <NormalButton
                sx={{
                  float: "right",
                }}
                size="small"
                variant="text"
                children={showSchedule ? "Hide Calendar" : "Show Calendar"}
                color={showSchedule ? "error" : "info"}
                onClick={() => setShowSchedule(!showSchedule)}
              />
              <hr />
              {showSchedule && (
                <SchedulerCalendar
                  appointments={feed}
                  handleSelection={handleScheduleSelection}
                  views={["day", "agenda", "week", "month"]}
                  handleSelectedEvent={handleSelectedEvent}
                />
              )}
            </UncontrolledCard>
            <ControlledGrid>
              <Grid item xs={6}>
                <UncontrolledCard>
                  <Typography variant="overline">Basic Information</Typography>
                  <hr />
                  <ControlledGrid>
                    <Grid item xs={4}>
                      <ControlledTextField
                        control={control}
                        required
                        shouldUnregister
                        label="Firstname"
                        name="firstname"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <ControlledTextField
                        control={control}
                        disabled={hasNoMiddleName}
                        name="middlename"
                        required={!hasNoMiddleName}
                        label="Middlename"
                        shouldUnregister
                      />
                      <ControlledCheckbox
                        control={control}
                        name="hasNoMiddleName"
                        label="I do not have a middlename"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <ControlledTextField
                        control={control}
                        required
                        shouldUnregister
                        label="Lastname"
                        name="lastname"
                      />
                    </Grid>
                  </ControlledGrid>
                  <ControlledGrid>
                    <Grid item xs={6}>
                      <ControlledTextField
                        control={control}
                        name="email"
                        required
                        shouldUnregister
                        label="Customer email"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ControlledMobileNumberField
                        control={control}
                        required
                        name="phoneNumber"
                        shouldUnregister
                        label="Customer phone number"
                      />
                    </Grid>
                  </ControlledGrid>
                </UncontrolledCard>
              </Grid>
              <Grid item xs={6}>
                <UncontrolledCard>
                  <Typography variant="overline">Branch & Services</Typography>
                  <hr />
                  <ControlledGrid>
                    <Grid item xs={6}>
                      <ControlledTextField
                        control={control}
                        name="branchName"
                        required
                        disabled
                        shouldUnregister
                        label="Branch name"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ControlledMultipleSelectField
                        control={control}
                        name="service_id"
                        options={services}
                        label="Appointment Services"
                        shouldUnregister
                        required
                      />
                    </Grid>
                  </ControlledGrid>
                </UncontrolledCard>
              </Grid>
            </ControlledGrid>
            <UncontrolledCard style={{ marginTop: "10px" }}>
              <Typography variant="overline">Pet Information & List</Typography>
              <hr />
              <NormalButton
                size="small"
                variant="text"
                children="Add new pet"
                sx={{
                  float: "right",
                  mt: 2,
                  mb: 2,
                }}
                onClick={addNewPetInformation}
              />
              {reverseFields.map((item, i) => (
                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <Timeline>
                    <div key={i}>
                      <UncontrolledCard
                        style={{
                          marginBottom: "10px",
                          borderRadius: "20px",
                          width: "100%",
                        }}
                      >
                        <NormalButton
                          sx={{ float: "right", mt: 2, mb: 2 }}
                          variant="outlined"
                          size="small"
                          color="error"
                          children="REMOVE"
                          onClick={() => remove(i)}
                        />
                        <Typography variant="overline">
                          Kindly complete the pet information form.
                        </Typography>
                        <ControlledGrid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name={`petInfo.${i}.petName`}
                              required
                              shouldUnregister
                              label="Name of your pet"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledSelectField
                              control={control}
                              name={`petInfo.${i}.petType`}
                              options={pets}
                              required
                              shouldUnregister
                              label="What pet do you have?"
                            />
                          </Grid>
                        </ControlledGrid>
                        <ControlledGrid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name={`petInfo.${i}.vetName`}
                              shouldUnregister
                              label="Veterinarian name (Optional)"
                              sx={{ mb: 2 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledRichTextField
                              handleChange={(e) =>
                                setValue(
                                  `petInfo.${i}.otherConcerns`,
                                  JSON.stringify(e)
                                )
                              }
                            />
                          </Grid>
                        </ControlledGrid>
                        <ControlledTextField
                          control={control}
                          name={`petInfo.${i}.breed`}
                          shouldUnregister
                          label="Pet breed"
                          sx={{ mb: 2 }}
                          required
                        />
                        <ControlledSelectField
                          control={control}
                          name={`petInfo.${i}.gender`}
                          options={gender}
                          label="Select pet gender"
                          required
                          shouldUnregister
                        />
                        <DatePicker
                          onChange={(e: any) =>
                            setValue(
                              `petInfo.${i}.birthdate`,
                              moment(e).add(1, "day")
                            )
                          }
                          label="Birthdate"
                          sx={{
                            mb: 2,
                            mr: 1,
                            mt: 3,
                            width: "100%",
                            padding: "15px",
                          }}
                        />
                      </UncontrolledCard>
                    </div>
                  </Timeline>
                </div>
              ))}
            </UncontrolledCard>
            <UncontrolledCard style={{ marginTop: "10px" }}>
              <Typography variant="overline">
                Notification Type Selection
              </Typography>
              <hr />
              <ControlledGrid>
                <Grid item xs={6}>
                  <Card
                    onClick={() => handleCardSelected(1)}
                    sx={{
                      backgroundColor: isCardSelected(1) ? "#f0f0f0" : "white",
                      boxShadow: isCardSelected(1)
                        ? "0 0 5px 2px #3f51b5"
                        : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                      cursor: "pointer",
                      borderRadius: "20px",
                    }}
                  >
                    <CardContent>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="https://email.uplers.com/blog/wp-content/uploads/2022/07/1-Signatures-blog.gif"
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: "50px",
                          }}
                        />
                        <Typography variant="overline">
                          Choose <strong>Email</strong> Service for appointment
                          reminder
                        </Typography>{" "}
                        <br />
                        <Typography variant="caption">
                          You will received an email notification regarding your
                          appointment
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    onClick={() => handleCardSelected(2)}
                    sx={{
                      backgroundColor: isCardSelected(2) ? "#f0f0f0" : "white",
                      boxShadow: isCardSelected(2)
                        ? "0 0 5px 2px #3f51b5"
                        : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                      cursor: "pointer",
                      borderRadius: "20px",
                    }}
                  >
                    <CardContent>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="https://i.pinimg.com/originals/fe/c2/39/fec23921611cc3abb6db1774e284a251.gif"
                          style={{
                            width: "54%",
                            height: "auto",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: "50px",
                          }}
                        />
                        <Typography variant="overline">
                          Choose <strong>SMS</strong> Service for appointment
                          reminder
                        </Typography>{" "}
                        <br />
                        <Typography variant="caption">
                          You will received an sms notification regarding your
                          appointment
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </ControlledGrid>
            </UncontrolledCard>
            <ControlledModal
              open={removeModal}
              handleClose={() => setRemoveModal(false)}
              handleDecline={() => setRemoveModal(false)}
              buttonTextAccept="REMOVE"
              buttonTextDecline="NOTHING"
              color="error"
              handleSubmit={handleRemove}
            >
              <Typography variant="overline">Appointment Removal</Typography>
              <hr />
              <Typography variant="button">
                What do you want to do with this event ?
              </Typography>
            </ControlledModal>
            <ControlledBackdrop open={backdrop} />
            <NormalButton
              sx={{
                float: "right",
                mt: 2,
                mb: 2,
              }}
              size="small"
              variant="outlined"
              children="APPOINT"
              onClick={handleAppoint}
            />
            <ControlledModal
              open={asks}
              buttonTextAccept="YES"
              buttonTextDecline="NO"
              handleClose={() => {
                setAsks(false), setBackdrop(false), setIsLobby(false);
              }}
              handleDecline={() => {
                setAsks(false), setBackdrop(false), setIsLobby(false);
              }}
              maxWidth="md"
              title="Existing appointment detected"
              handleSubmit={handleYesToLobby}
            >
              <Typography variant="button">
                There is an existing appointment on this day. Would the customer
                like to wait?
              </Typography>
            </ControlledModal>
            <ControlledModal
              open={viewLobby}
              hideAgreeButton
              buttonTextDecline="CLOSE"
              handleClose={() => setViewLobby(false)}
              handleDecline={() => setViewLobby(false)}
              maxWidth="lg"
              title="Appointment Lobby"
            >
              <Typography variant="button">View Appointment Lobby</Typography>
              <UncontrolledCard
                style={{
                  marginTop: "10px",
                }}
              >
                <Typography variant="overline">Waiting lobby</Typography>
                <ProjectTable
                  pageSize={pageSize}
                  columns={lobbyColumns}
                  data={lobbyList}
                  sx={{ mt: 2 }}
                />
              </UncontrolledCard>
            </ControlledModal>
          </UncontrolledCard>
        </Container>
      )}
    </>
  );
};

export default WalkedIn;
