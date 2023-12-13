import { ControlledGrid } from "@/components/Grid/Grid";
import { ProjectTable } from "@/components/Table/ProjectTable";
import {
  BaseHolidayStartEndSchema,
  HolidayStartEndType,
} from "@/utils/schema/Appointment/HolidaySchema";
import { Chip, Grid, Typography } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { DateRangePicker } from "react-date-range";
import { useAtom } from "jotai";
import {
  HolidayPickAtom,
  HolidayStartEndAtom,
  HolidayTitleAtom,
} from "@/utils/hooks/useAtomic";
import { zodResolver } from "@hookform/resolvers/zod";
import { UncontrolledCard } from "@/components/Card/Card";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { MAX_SETTINGS_STEPS } from ".";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { NormalButton } from "@/components/Button/NormalButton";
import moment from "moment";
import { CreateNewScheduleProps } from "@/utils/types";
import { useMutation } from "react-query";
import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
import { useReferences } from "@/utils/hooks/useToken";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";

const SettingsHolidayStartEndForm = () => {
  const { setValue } = useFormContext<HolidayStartEndType>();
  const [state, setState] = useState<
    Array<{
      startDate: Date;
      endDate: Date;
      key: string;
    }>
  >([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const { handleOnToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const removeAffectedSchedules = useApiCallBack(
    async (api, args: { id: number; userid: number }) =>
      await api.abys.removeAffectedSchedules(args)
  );
  const affectedSchedules = useApiCallBack(
    async (api, args: { start: Date; end: Date }) =>
      await api.abys.findAffectedSchedules(args)
  );
  const holidaySchedules = useApiCallBack(
    async (api, args: { start: Date; end: Date }) =>
      await api.abys.findHolidaySchedules(args)
  );
  const [affectedsched, setAffectedSched] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [tempDateSaved, setTempDateSaved] = useState<any>({
    start: null,
    end: null,
  });
  const handleSelectionRange = (item: any) => {
    setState([item.selection]);
    const obj = {
      start: new Date(item.selection?.startDate),
      end: new Date(item.selection?.endDate),
    };
    const newObj = {
      ...tempDateSaved,
      start: new Date(item.selection?.startDate),
      end: new Date(item.selection?.endDate),
    };
    setTempDateSaved(newObj);
    affectedSchedules.execute(obj).then((response) => {
      holidaySchedules.execute(obj).then((res) => {
        setHolidays(res.data);
        setAffectedSched(response?.data);
        setValue("affectedSchedules", response?.data);
      });
    });
    setValue("selection", item.selection);
  };
  const columns: any[] = [
    { field: "id", headerName: "ID", width: 30 },
    {
      field: "title",
      headerName: "Title",
      width: 130,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 150,
      renderCell: (params: any) => {
        if (params.row.status == "1") {
          return (
            <Chip
              variant="filled"
              size="small"
              label="Active"
              color="success"
            />
          );
        } else {
          return (
            <Chip
              variant="filled"
              size="small"
              color="error"
              label="Inactive"
            />
          );
        }
      },
    },
    {
      field: "branch",
      sortable: false,
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
      field: "start",
      sortable: false,
      headerName: "Appointment Date",
      width: 180,
      renderCell: (params: any) => {
        return moment(params.row.start).format("MMMM Do YYYY");
      },
    },
    {
      field: "isHoliday",
      sortable: true,
      headerName: "Day Status",
      width: 180,
      renderCell: (params: any) => {
        const closedCaseSensitive = params.row.title.toLowerCase();
        const closedIncludes =
          closedCaseSensitive.includes("closing") ||
          closedCaseSensitive.includes("closed") ||
          closedCaseSensitive.includes("store closed") ||
          closedCaseSensitive.includes("store closing");
        if (params.row.isHoliday == 1) {
          return (
            <Chip variant="filled" size="small" color="error" label="HOLIDAY" />
          );
        } else if (closedIncludes) {
          return (
            <Chip
              variant="filled"
              size="small"
              color="warning"
              label="CLOSED"
            />
          );
        } else {
          return (
            <Chip
              variant="filled"
              size="small"
              color="success"
              label="CUSTOMER SCHEDULE"
            />
          );
        }
      },
    },
    {
      headerName: "Actions",
      sortable: false,
      width: 250,
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: "flex",
            }}
          >
            <NormalButton
              size="small"
              variant="outlined"
              color="error"
              onClick={() =>
                handleRemoveAffectedSchedules(params.row.id, params.row.userid)
              }
            >
              REMOVE SCHEDULE
            </NormalButton>
          </div>
        );
      },
    },
  ];
  const handleRemoveAffectedSchedules = (id: number, userid: number) => {
    setLoading(!loading);
    const obj = {
      id: id,
      userid: userid,
    };
    removeAffectedSchedules.execute(obj).then((res) => {
      if (res.data == 200) {
        setLoading(false);
        handleOnToast(
          "Successfully removed",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
        );
        affectedSchedules.execute(tempDateSaved).then((response) => {
          holidaySchedules.execute(tempDateSaved).then((res) => {
            setAffectedSched(response?.data);
            setValue("affectedSchedules", response?.data);
            setHolidays(res.data);
          });
        });
      } else {
        handleOnToast(
          "Something went wrong",
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
      }
    });
  };
  return (
    <>
      <UncontrolledCard>
        <DateRangePicker
          onChange={(item: any) => handleSelectionRange(item)}
          ranges={state}
          direction="horizontal"
          moveRangeOnFirstSelection={false}
          months={1}
        />
      </UncontrolledCard>
      <UncontrolledCard
        style={{
          marginTop: "10px",
        }}
      >
        <Typography variant="button">Affected Schedules</Typography>
        <ProjectTable pageSize={5} columns={columns} data={affectedsched} />
        <ControlledBackdrop open={loading} />
      </UncontrolledCard>
      <UncontrolledCard
        style={{
          marginTop: "10px",
        }}
      >
        <Typography variant="button">Holidays & Closing Schedules</Typography>
        <ProjectTable pageSize={5} columns={columns} data={holidays} />
        <ControlledBackdrop open={loading} />
      </UncontrolledCard>
    </>
  );
};

export const SettingsHolidayStartEnd = () => {
  const [holiday, setHoliday] = useAtom(HolidayStartEndAtom);
  const [title, setTitle] = useAtom(HolidayTitleAtom);
  const [pick, setPick] = useAtom(HolidayPickAtom);
  const [isEnable, setIsEnable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [references, setReferences] = useReferences();
  const form = useForm<HolidayStartEndType>({
    mode: "all",
    resolver: zodResolver(BaseHolidayStartEndSchema),
    defaultValues: holiday,
  });
  const postnewholiday = useApiCallBack(
    async (api, args: CreateNewScheduleProps) =>
      await api.abys.postNewHoliday(args)
  );
  const usePostNewHoliday = () => {
    return useMutation((data: CreateNewScheduleProps) =>
      postnewholiday.execute(data)
    );
  };
  const { mutate } = usePostNewHoliday();
  const {
    formState: { isValid },
    handleSubmit,
    getValues,
    watch,
  } = form;
  const { handleOnToast } = useToastContext();
  const selected = watch("selection");
  const affected = watch("affectedSchedules");
  useEffect(() => {
    if (getValues().affectedSchedules?.length > 0) {
      getValues().affectedSchedules.some((item: any) => {
        if (item?.isHoliday == 1) {
          setIsEnable(false);
        } else {
          setIsEnable(true);
        }
      });
    } else {
      if (!getValues().selection) {
        setIsEnable(true);
      } else {
        setIsEnable(false);
      }
    }
  }, [selected, affected]);
  const { setActiveStep } = useActiveSteps(MAX_SETTINGS_STEPS);
  const handleContinue = () => {
    const values = getValues();
    setLoading(!loading);
    const obj = {
      userid: references?.id,
      branch: pick?.branch_id,
      mockSchedule: "no-mock-schedule-holiday",
      status: 1,
      isHoliday: pick?.value == "holiday" ? 1 : 2,
      start: new Date(values.selection.startDate),
      end: new Date(values.selection.startDate),
      title: title?.title,
    };
    mutate(obj, {
      onSuccess: (response: any) => {
        const { data }: any = response;
        if (data == 200) {
          handleOnToast(
            "Successfully set a holiday",
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
          setHoliday(undefined);
          setPick(undefined);
          setTitle(undefined);
          setActiveStep(0);
        }
      },
    });
  };
  return (
    <FormProvider {...form}>
      <SettingsHolidayStartEndForm />
      <BottomButtonGroup
        disabledContinue={isEnable}
        max_array_length={MAX_SETTINGS_STEPS}
        onContinue={handleContinue}
      />
      <ControlledBackdrop open={loading} />
    </FormProvider>
  );
};
