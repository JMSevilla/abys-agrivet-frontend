import { useState, useEffect } from "react";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { ControlledGrid, ControlledBackdrop, NormalButton } from "@/components";
import { Grid, Typography } from "@mui/material";
import { ControlledTextField } from "@/components";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import {
  BranchModificationType,
  BranchType,
} from "@/utils/schema/Branch/BranchSchema";
import { BranchAtom, BranchModificationAtom } from "@/utils/hooks/useAtomic";
import { useAtom } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseBranchSchema } from "@/utils/schema/Branch/BranchSchema";
import { ControlledSelectField } from "@/components";
import { BranchProps } from "@/utils/types";
const BranchForm = () => {
  const { control, getValues, watch, setValue } = useFormContext<BranchType>();
  const findHighestBranchId = useApiCallBack((api) =>
    api.abys.FindHighestBranchId()
  );
  const { data } = useQuery({
    queryKey: "findHighestBranchId",
    queryFn: () =>
      findHighestBranchId.execute().then((response) => response.data),
  });
  const branchId = watch("branch_id");
  useEffect(() => {
    let num = data + 1;
    setValue("branch_id", num);
  }, [data, branchId]);
  return (
    <>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="branch_id"
            disabled
            required
            shouldUnregister
            label="Branch ID"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="branchName"
            required
            shouldUnregister
            label="New branch name"
          />
        </Grid>
      </ControlledGrid>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="branchKey"
            required
            shouldUnregister
            label="New branch key"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelectField
            control={control}
            name="branchPath"
            required
            shouldUnregister
            label="Select role for this branch"
            options={[
              {
                label: "Administrator",
                value: "/admin/dashboard",
                name: "Administrator",
              },
              {
                label: "Managers",
                value: "/managers/dashboard",
                name: "Managers",
              },
            ]}
          />
        </Grid>
      </ControlledGrid>
    </>
  );
};

export const BranchFormField = () => {
  const [branchDetails, setBranchDetails] = useAtom(BranchAtom);
  const [branchMod, setBranchMod] = useAtom(BranchModificationAtom);
  const [loading, setLoading] = useState(false);
  const saveNewBranch = useApiCallBack(
    async (api, args: BranchProps) => await api.abys.saveNewBranch(args)
  );
  const findHighestBranchId = useApiCallBack((api) =>
    api.abys.FindHighestBranchId()
  );

  const useSaveNewBranch = () => {
    return useMutation((data: BranchProps) => saveNewBranch.execute(data));
  };
  const { mutate } = useSaveNewBranch();
  const form = useForm<BranchType>({
    mode: "all",
    resolver: zodResolver(BaseBranchSchema),
    defaultValues: branchDetails,
  });
  const {
    formState: { isValid },
    handleSubmit,
    watch,
    setValue,
  } = form;
  const { data } = useQuery({
    queryKey: "findHighestBranchId",
    queryFn: () =>
      findHighestBranchId.execute().then((response) => response.data),
  });
  const { handleOnToast } = useToastContext();
  const handleContinue = () => {
    handleSubmit((values) => {
      setLoading(!loading);
      const obj = {
        branch_id: values.branch_id,
        branchName: values.branchName,
        branchKey: values.branchKey,
        branchPath: values.branchPath,
        branchStatus: "0",
      };
      mutate(obj, {
        onSuccess: (response: any) => {
          if (response?.data == 200) {
            setLoading(false);
            handleOnToast(
              "Successfully created new branch",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            let num = data + 1;
            setValue("branch_id", num);
          } else {
            setLoading(false);
            handleOnToast(
              "This branch is already exists",
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
        },
      });
    })();
  };
  return (
    <FormProvider {...form}>
      <BranchForm />
      <NormalButton
        sx={{
          float: "right",
          mt: 2,
          mb: 2,
        }}
        variant="outlined"
        size="small"
        onClick={handleContinue}
      >
        SAVE
      </NormalButton>
      <ControlledBackdrop open={loading} />
    </FormProvider>
  );
};
