import { SchedulerCalendar } from "@/components/Calendar/Calendar";
import { UncontrolledCard } from "@/components/Card/Card";
import { Grid, Typography } from "@mui/material";
import { useAtom } from "jotai";
import {
  AppointmentSchedulingAtom,
  AppointmentServicesAtom,
} from "@/utils/hooks/useAtomic";
import {
  APSchedulingSchema,
  AppointmentSchedulingType,
} from "@/utils/schema/Appointment/AppointmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import moment from "moment";
import { SlotInfo } from "react-big-calendar";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useEffect, useState } from "react";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";

import ControlledModal from "@/components/Modal/Modal";
import { MAX_APPOINTMENT_STEPS } from "..";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { CreateNewScheduleProps } from "@/utils/types";
import { useMutation, useQuery } from "react-query";
import { useReferences } from "@/utils/hooks/useToken";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { TextField } from "@/components/TextField/TextField";
import { ControlledGrid } from "@/components/Grid/Grid";

import { TimePicker } from "@mui/x-date-pickers";

const APSchedulingForm = () => {
  const [services, setServices] = useAtom(AppointmentServicesAtom);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [references, setReferences] = useReferences();
  const [appointmentDetails, setAppointmentDetails] = useState(false);
  const initialTime = moment().set({ hour: 9, minute: 0, second: 0 });
  const [scheduleDetails, setScheduleDetails] = useState({
    scheduleTitle: "",
    scheduleTime: initialTime,
  });
  const GetAllSchedulePerBranch = useApiCallBack(
    async (
      api,
      args: {
        branch: number;
        userid: number;
      }
    ) => await api.abys.findAllSchedulePerBranch(args)
  );
  const deleteSelectedSchedule = useApiCallBack(
    async (api, id: number) => await api.abys.handleSelectedSchedule(id)
  );
  const useDeleteSelectedSchedule = () => {
    return useMutation((id: number) => deleteSelectedSchedule.execute(id));
  };
  const checkBeforeRemoving = useApiCallBack(
    async (api, id: number) => await api.abys.checkBeforeRemovingSchedule(id)
  );
  const getHighestID = useApiCallBack((api) => api.abys.getHighestID());
  const { mutate } = useDeleteSelectedSchedule();
  const { control, setValue, getValues, watch } =
    useFormContext<AppointmentSchedulingType>();
  const [removeId, setRemoveId] = useState(0);
  const [feed, setFeed] = useState<
    Array<{
      id: number;
      title: string;
      start: Date;
      end: Date;
      isHoliday?: boolean | undefined;
    }>
  >([]);
  const appointmentSchedules = watch("appointmentSchedule");
  const { handleOnToast } = useToastContext();
  const [lastId, setLastId] = useState(0);
  const checkIfDayPropsIsHoliday = useApiCallBack(
    async (api, id: number) => await api.abys.CheckIfDayPropIsHoliday(id)
  );
  const checkTimeAvailability = useApiCallBack(
    async (
      api,
      args: {
        checkTime: any;
      }
    ) => await api.abys.checkSchedulingTime(args)
  );
  const getallscheduleperbranches = () => {
    GetAllSchedulePerBranch.execute({
      branch: services?.branch_id ?? 0,
      userid: references?.id,
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
    getallscheduleperbranches();
  }, []);
  useEffect(() => {}, [appointmentSchedules]);
  const [slot, setSlot] = useState<any>({ start: new Date(), end: new Date() });

  const handleScheduleSelection = ({ start, end }: SlotInfo) => {
    setLoading(!loading);
    const selectedEvents = feed.filter((event) => {
      const eventStartDate = moment(event.start).add(1, "day");
      const eventEndDate = moment(event.end).subtract(1, "day");

      return (
        eventStartDate.isSameOrBefore(end) && eventEndDate.isSameOrAfter(start)
      );
    });
    const values = getValues();
    const eventStartDate = new Date(start);
    if (eventStartDate < new Date() && !moment(start).isSame(moment(), "day")) {
      return;
    } else {
      /**@function checkHolidayDates */
      if (values.appointmentSchedule?.length > 0) {
        /**@function handleToast */
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
        setLoading(false);
        return;
      } else {
        if (selectedEvents.length > 0) {
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
                setLoading(false);
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
                setLoading(false);
              } else {
                const test = window.prompt("Schedule title");
                if (test) {
                  getHighestID.execute().then((re) => {
                    const id =
                      re?.data == null || re?.data == ""
                        ? lastId + 1
                        : re.data?.id + 1;

                    const title = test;
                    const isHoliday = false;
                    const newSched = [
                      {
                        id,
                        start: moment(start).add(1, "day").toDate(),
                        end: moment(start).add(1, "day").toDate(),
                        title,
                        isHoliday,
                      },
                    ];
                    setLoading(false);
                    setFeed((prevState) => [...prevState, ...newSched]);
                    setValue("appointmentSchedule", newSched);
                    setValue("start", moment(start).add(1, "day").toDate());
                    setValue("end", moment(start).add(1, "day").toDate());
                    setLastId(lastId + 1);
                    setRemoveId(id);
                  });
                } else {
                  setLoading(false);
                }
              }
            });
          });
        } else {
          setAppointmentDetails(!appointmentDetails);
          setSlot({
            ...slot,
            start: start,
            end: end,
          });
        }
      }
    }
  };
  const scheduleTitleOnChange = (event: any) => {
    const value = event.target.value;
    setScheduleDetails({
      ...scheduleDetails,
      scheduleTitle: value,
    });
  };

  const scheduleDetailsOnSave = () => {
    getHighestID.execute().then((re) => {
      const id =
        re?.data == null || re?.data == "" ? lastId + 1 : re.data?.id + 1;

      const title = scheduleDetails.scheduleTitle;
      const isHoliday = false;
      const combinedStartTime = moment(slot.start)
        .set({
          hour: scheduleDetails.scheduleTime.hour(),
          minute: scheduleDetails.scheduleTime.minute(),
          second: 0,
        })
        .toDate();

      const newSched = [
        {
          id,
          start: combinedStartTime,
          end: slot.end,
          title,
          isHoliday,
        },
      ];
      console.log(newSched);
      setLoading(false);
      setFeed((prevState) => [...prevState, ...newSched]);
      setValue("appointmentSchedule", newSched);
      setValue("start", moment(slot.start).add(1, "day").toDate());
      setValue("end", moment(slot.end).add(1, "day").toDate());
      setLastId(lastId + 1);
      setRemoveId(id);
      setAppointmentDetails(false);
      const momentStart = moment(combinedStartTime);
      const formattedStart = momentStart.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      checkTimeAvailability
        .execute({ checkTime: formattedStart })
        .then((res) => console.log(res));
    });
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
        setRemoveId(event?.id);
        setOpenModal(!openModal);
      }
    }
  };
  const handleRemove = () => {
    setOpenModal(false);
    setLoading(!loading);
    checkBeforeRemoving.execute(removeId).then((res) => {
      if (res.data == 200) {
        mutate(removeId, {
          onSuccess: (response: any) => {
            console.log(response);
            if (response?.data == 200) {
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
              getallscheduleperbranches();
              setLoading(false);
            }
          },
        });
      } else {
        const index = feed.findIndex((item) => item.id === removeId);
        if (index !== -1) {
          const values = getValues();
          const update = [...feed.slice(0, index), ...feed.slice(index + 1)];
          setFeed(update);
          setValue("appointmentSchedule", []);
        }
        setLoading(false);
      }
    });
  };

  const timePickOnChange = (newTime: any) => {
    setScheduleDetails({
      ...scheduleDetails,
      scheduleTime: newTime,
    });
  };
  return (
    <>
      <UncontrolledCard style={{ marginTop: "10px" }}>
        <SchedulerCalendar
          appointments={feed}
          handleSelection={handleScheduleSelection}
          views={["month", "day"]}
          handleSelectedEvent={handleSelectedEvent}
        />
        <ControlledModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          handleDecline={() => setOpenModal(false)}
          buttonTextAccept="REMOVE"
          buttonTextDecline="NOTHING"
          color="error"
          handleSubmit={handleRemove}
        >
          <Typography variant="caption">Appointment</Typography>
          <hr />
          <Typography variant="button">
            What do you want to do with this event ?
          </Typography>
        </ControlledModal>
        <ControlledBackdrop open={loading} />
        <ControlledModal
          open={appointmentDetails}
          handleClose={() => setAppointmentDetails(false)}
          handleDecline={() => setAppointmentDetails(false)}
          buttonTextAccept="SAVE"
          buttonTextDecline="CANCEL"
          color="success"
          handleSubmit={scheduleDetailsOnSave}
          maxWidth="md"
        >
          <Typography variant="button">Appointment Details</Typography>
          <ControlledGrid>
            <Grid item xs={6}>
              <TextField
                label="Schedule Title"
                value={scheduleDetails.scheduleTitle}
                onChange={scheduleTitleOnChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                sx={{
                  mt: 4,
                  width: "100%",
                }}
                value={scheduleDetails.scheduleTime}
                onChange={timePickOnChange}
              />
            </Grid>
          </ControlledGrid>
        </ControlledModal>
      </UncontrolledCard>
    </>
  );
};

/**
 *
 * @author JM
 * 9-10 AM > 1st customer > if second customer select 9-10AM it should validate > filter mechanism
 *
 *
 */

export const APScheduling = () => {
  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useAtom(AppointmentSchedulingAtom);
  const [services, setServices] = useAtom(AppointmentServicesAtom);
  const [references, setReferences] = useReferences();
  const form = useForm<AppointmentSchedulingType>({
    mode: "all",
    resolver: zodResolver(APSchedulingSchema),
    defaultValues: scheduling,
  });
  const createNewSchedule = useApiCallBack(
    async (api, args: CreateNewScheduleProps) =>
      await api.abys.createNewSchedule(args)
  );
  const useCreateNewSchedule = () => {
    return useMutation((data: CreateNewScheduleProps) =>
      createNewSchedule.execute(data)
    );
  };
  const { mutate } = useCreateNewSchedule();
  const { next } = useActiveSteps(MAX_APPOINTMENT_STEPS);
  const { handleOnToast } = useToastContext();
  const {
    formState: { isDirty },
    handleSubmit,
    getValues,
  } = form;
  const handleContinue = () => {
    const values = getValues();
    if (values.appointmentSchedule?.length > 0) {
      values.appointmentSchedule.map((item) => {
        const momentStart = moment(item.start);
        const formattedStart = momentStart.format("YYYY-MM-DDTHH:mm:ss.SSSZ"); // Format in ISO 8601

        const obj: any = {
          userid: references?.id,
          branch: services?.branch_id,
          mockSchedule: JSON.stringify(values),
          status: 1,
          isHoliday: item.isHoliday ? 1 : 0,
          start: formattedStart,
          title: item.title,
          end: item.start,
        };
        setLoading(!loading);
        console.log(obj);
        mutate(obj, {
          onSuccess: (response) => {
            if (response?.data == 200) {
              handleOnToast(
                "Successfully drop a schedule.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setScheduling(values);
              next();
              setLoading(false);
            }
          },
        });
      });
    } else {
      handleOnToast(
        "Kindly drop your appointment schedule.",
        "top-right",
        false,
        true,
        true,
        true,
        undefined,
        "dark",
        "error"
      );
    }
  };
  return (
    <FormProvider {...form}>
      <APSchedulingForm />
      <BottomButtonGroup
        max_array_length={MAX_APPOINTMENT_STEPS}
        onContinue={handleContinue}
      />
      <ControlledBackdrop open={loading} />
    </FormProvider>
  );
};
