import { useState, useEffect } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import {
  ControlledGrid,
  ControlledBackdrop,
  NormalButton,
  ControlledMultipleSelectField,
  SelectOption,
  MultipleOption,
} from "@/components";
import { Grid } from "@mui/material";
import { ControlledTextField } from "@/components";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";

import { useAtom } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceAtom } from "@/utils/hooks/useAtomic";
import {
  ServiceBaseSchema,
  ServiceCreation,
} from "@/utils/schema/Services/ServiceSchema";

const ServiceForm = () => {
  const FindAllBranchesRequest = useApiCallBack((api) =>
    api.abys.GetAllBranches()
  );
  const [branch, setBranch] = useState<MultipleOption[]>([]);

  useEffect(() => {
    FindAllBranchesRequest.execute().then((response) => {
      const { data }: any = response;
      if (data.length > 0) {
        const newBranch = [...data];
        newBranch.splice(5, 1);
        setBranch(newBranch);
      } else {
        setBranch([]);
      }
    });
  }, []);
  const { control } = useFormContext<ServiceCreation>();
  return (
    <ControlledGrid>
      <Grid item xs={6}>
        <ControlledTextField
          control={control}
          name="serviceName"
          required
          shouldUnregister
          label="Service Name"
        />
      </Grid>
      <Grid item xs={6}>
        <ControlledMultipleSelectField
          control={control}
          name="serviceBranch"
          options={branch}
          required
          shouldUnregister
          label="Select multiple branch"
        />
      </Grid>
    </ControlledGrid>
  );
};

export const ServiceFormField = () => {
  const [serviceAtom, setServiceAtom] = useAtom(ServiceAtom);
  const [loading, setLoading] = useState(false);
  const { handleOnToast } = useToastContext();
  const createNewServices = useApiCallBack(
    async (
      api,
      args: {
        serviceName: string | undefined;
        serviceBranch: string | undefined;
      }
    ) => await api.abys.createNewServices(args)
  );
  const useCreateNewServices = () => {
    return useMutation(
      (data: {
        serviceName: string | undefined;
        serviceBranch: string | undefined;
      }) => createNewServices.execute(data)
    );
  };
  const { mutate } = useCreateNewServices();
  const form = useForm<ServiceCreation>({
    mode: "all",
    resolver: zodResolver(ServiceBaseSchema),
    defaultValues: serviceAtom,
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const handleContinue = () => {
    handleSubmit((values) => {
      const obj = {
        serviceName: values.serviceName,
        serviceBranch: JSON.stringify(values.serviceBranch),
      };
      setLoading(!loading);
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == 200) {
            handleOnToast(
              "Successfully Added Services",
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
          }
        },
      });
    })();
  };
  return (
    <FormProvider {...form}>
      <ServiceForm />
      <NormalButton
        sx={{
          float: "right",
          mt: 2,
          mb: 2,
        }}
        children="SAVE"
        variant="outlined"
        size="small"
        disabled={!isValid}
        onClick={handleContinue}
      />
      <ControlledBackdrop open={loading} />
    </FormProvider>
  );
};
