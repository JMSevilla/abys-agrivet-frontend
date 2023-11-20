import { ControlledSelectField, SingleOption } from "@/components/SelectField";
import { ControlledGrid } from "@/components/Grid/Grid";
import { Grid } from "@mui/material";

import { useEffect, useState } from "react";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { useAtom } from "jotai";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { useApiCallBack } from "@/utils/hooks/useApi";

import { MAX_APPOINTMENT_STEPS } from "..";
import { AppointmentServicesAtom } from "@/utils/hooks/useAtomic";
import {
  APServicesSchema,
  AppointmentServiceType,
} from "@/utils/schema/Appointment/AppointmentSchema";
import { ControlledMultipleSelectField } from "@/components/SelectField/MultipleSelection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "react-query";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
const ServicesForm = () => {
  const { control, getValues, watch, setValue, resetField } =
    useFormContext<AppointmentServiceType>();
  const [branches, setBranches] = useState<any>([]);
  const [services, setServices] = useState<any>([]);
  const [mockServices, setMockServices] = useState<any>([]);
  const [disableBranch, setDisableBranch] = useState(false);
  const getAllBranches = useApiCallBack((api) =>
    api.abys.branchOnServicesExceptAllBranch()
  );
  const getAllServices = useApiCallBack((api) => api.abys.getAllServices());
  const { data } = useQuery({
    queryKey: "GetAllBranchExceptBranch",
    queryFn: () => getAllBranches.execute().then((response) => response.data),
  });
  const branchChange = watch("branch_id");
  const servicesChange = watch("service_id");

  useEffect(() => {
    setBranches(data);
  }, [data]);
  useEffect(() => {
    getAllServices.execute().then((response) => {
      const values = getValues();
      const filtered =
        response?.data?.length > 0 &&
        response?.data?.filter((o: any) => {
          let test = JSON.parse(o?.serviceBranch);
          return test.some(
            (nested: any) => nested.branch_id == values.branch_id
          );
        });
      if (getValues().service_id?.length > 0) {
        setValue("service_id", null);
        setServices([]);
      } else {
        setServices(filtered);
      }
    });
  }, [branchChange]);
  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ControlledSelectField
            control={control}
            name="branch_id"
            label="Select Abys-Agrivet branch"
            options={branches}
            shouldUnregister
            disabled={getValues().service_id?.length > 0}
            required
          />
          <ControlledMultipleSelectField
            control={control}
            name="service_id"
            options={services}
            label="Select services"
            shouldUnregister
            required
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </ControlledGrid>
    </>
  );
};

export const Services = () => {
  const [services, setServices] = useAtom(AppointmentServicesAtom);
  const form = useForm<AppointmentServiceType>({
    mode: "all",
    resolver: zodResolver(APServicesSchema),
    defaultValues: services,
  });
  const { next } = useActiveSteps(MAX_APPOINTMENT_STEPS);
  const {
    formState: { isValid },
    handleSubmit,
    getValues,
  } = form;
  const { handleOnToast } = useToastContext();
  const handleContinue = () => {
    const values = getValues();
    console.log(values);
    if (values.service_id?.length <= 0 || values.service_id == undefined) {
      handleOnToast(
        "Kindly select services",
        "top-right",
        false,
        true,
        true,
        true,
        undefined,
        "dark",
        "error"
      );
      return false;
    } else {
      setServices(values);
      next();
    }
  };
  return (
    <FormProvider {...form}>
      <ServicesForm />
      <BottomButtonGroup
        max_array_length={MAX_APPOINTMENT_STEPS}
        disabledContinue={!isValid}
        onContinue={handleContinue}
      />
    </FormProvider>
  );
};
