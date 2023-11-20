import {
  UncontrolledCard,
  ControlledBackdrop,
  ControlledTabs,
  ControlledGrid,
  NormalButton,
} from "@/components";
import { Container, Typography, Grid, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { BranchFormField } from "@/components/Forms/Branch/BranchForm";
import { ProjectTable } from "@/components/Table/ProjectTable";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation, useQuery } from "react-query";
import ControlledModal from "@/components/Modal/Modal";
import {
  BaseModificationSchema,
  BranchModificationType,
} from "@/utils/schema/Branch/BranchSchema";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ControlledTextField } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { BranchModificationAtom } from "@/utils/hooks/useAtomic";
import { useToastContext } from "@/utils/context/Toast/ToastContext";

const BranchModificationForm = () => {
  const { control, setValue, watch } = useFormContext<BranchModificationType>();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="branchName"
            required
            shouldUnregister
            label="Branch name"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            name="branchKey"
            required
            shouldUnregister
            label="Branch key"
          />
        </Grid>
      </ControlledGrid>
    </>
  );
};
const Branch: React.FC = () => {
  const columns: any[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "branch_id",
      headerName: "Branch ID",
      width: 70,
    },
    {
      field: "branchName",
      headerName: "Branch",
      sortable: false,
      width: 260,
    },
    {
      field: "branchKey",
      headerName: "Branch Key",
      sortable: false,
      width: 130,
    },
    {
      field: "branchPath",
      headerName: "Branch Path",
      sortable: true,
      width: 130,
      renderCell: (params: any) => {
        const includeStr = params.row.branchPath.includes("admin");
        if (includeStr) {
          return (
            <Chip
              variant="filled"
              size="small"
              label="Administrator"
              color="success"
            />
          );
        } else {
          return (
            <Chip
              variant="filled"
              size="small"
              label="Managers"
              color="error"
            />
          );
        }
      },
    },
    {
      field: "branchStatus",
      headerName: "Status",
      sortable: false,
      width: 130,
      renderCell: (params: any) => {
        if (params.row.branchStatus == 1) {
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
              label="Inactive"
              color="error"
            />
          );
        }
      },
    },
    {
      headerName: "Actions",
      width: 260,
      renderCell: (params: any) => {
        return (
          <div style={{ display: "flex" }}>
            <NormalButton
              onClick={() =>
                OnOpenModifyModal(
                  params.row.id,
                  params.row.branchName,
                  params.row.branchKey,
                  "modification"
                )
              }
              children="MODIFY"
              variant="text"
              size="small"
            />
            {params.row.branchStatus == 1 ? (
              <NormalButton
                children="DEACTIVATE"
                variant="text"
                size="small"
                color="warning"
                onClick={() =>
                  OnOpenModifyModal(
                    params.row.id,
                    params.row.branchName,
                    params.row.branchKey,
                    "deactivate"
                  )
                }
              />
            ) : (
              <NormalButton
                children="ACTIVATE"
                variant="text"
                size="small"
                color="success"
                onClick={() =>
                  OnOpenModifyModal(
                    params.row.id,
                    params.row.branchName,
                    params.row.branchKey,
                    "activate"
                  )
                }
              />
            )}
            <NormalButton
              children="REMOVE"
              variant="text"
              size="small"
              color="error"
              onClick={() =>
                OnOpenModifyModal(
                  params.row.id,
                  params.row.branchName,
                  params.row.branchKey,
                  "deletion"
                )
              }
            />
          </div>
        );
      },
    },
  ];
  const [branchMod, setBranchMod] = useAtom(BranchModificationAtom);
  const groupBranchRequest = useApiCallBack(
    async (
      api,
      args?: {
        id: number | undefined;
        branchName: string | undefined;
        branchKey: string | undefined;
        type: string | undefined;
      }
    ) => {
      const result = await api.abys.GroupBranchActions(args);
      return result;
    }
  );
  const form = useForm<BranchModificationType>({
    mode: "all",
    resolver: zodResolver(BaseModificationSchema),
    defaultValues: branchMod,
  });
  const useGroupBranchRequest = () => {
    return useMutation(
      (data?: {
        id: number | undefined;
        branchName: string | undefined;
        branchKey: string | undefined;
        type: string | undefined;
      }) => groupBranchRequest.execute(data)
    );
  };

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = form;
  const { mutate } = useGroupBranchRequest();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { checkAuthentication } = useAuthenticationContext();
  const [tabsValue, setTabsValue] = useState(0);
  const [type, setType] = useState<any>(null);
  const [progress, setProgress] = useState(false);
  const findAllBranchesList = useApiCallBack((api) =>
    api.abys.findAllBranchesManagement()
  );
  const { handleOnToast } = useToastContext();
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res == "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);

  const handleFindAllBranches = () => {
    findAllBranchesList.execute().then((response) => {
      setBranches(response.data);
    });
  };
  useEffect(() => {
    handleFindAllBranches();
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  const OnOpenModifyModal = (
    id: number,
    branchName: string,
    branchKey: string,
    type: string
  ) => {
    setType(type);
    setBranchMod({ id: id, branchName: branchName, branchKey: branchKey });
    setValue("branchName", branchName);
    setValue("branchKey", branchKey);
    if (type == "modification") {
      setModalOpen(!modalOpen);
    }
    const objModification = {
      id: id,
      branchName: "null",
      branchKey: "null",
      type: type,
      branchPath: "auto-branch-path",
    };
    switch (type) {
      case "activate":
        var dialogConfig = window.confirm("Are you sure you want to activate?");
        if (dialogConfig) {
          setProgress(!progress);
          mutate(objModification, {
            onSuccess: (response: any) => {
              if (response?.data == 200) {
                handleOnToast(
                  "Successfully activated",
                  "top-right",
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  "dark",
                  "success"
                );
                setProgress(false);
                handleFindAllBranches();
              }
            },
          });
        }
        break;
      case "deactivate":
        var dialogConfig = window.confirm(
          "Are you sure you want to deactivate?"
        );
        if (dialogConfig) {
          setProgress(!progress);
          mutate(objModification, {
            onSuccess: (response: any) => {
              if (response?.data == 200) {
                handleOnToast(
                  "Successfully deactivated",
                  "top-right",
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  "dark",
                  "success"
                );
                setProgress(false);
                handleFindAllBranches();
              }
            },
          });
        }
        break;
      case "deletion":
        var dialogConfig = window.confirm(
          "Are you sure you want to delete this branch?"
        );
        if (dialogConfig) {
          setProgress(!progress);
          mutate(objModification, {
            onSuccess: (response: any) => {
              if (response?.data == 200) {
                handleOnToast(
                  "Successfully deleted",
                  "top-right",
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  "dark",
                  "success"
                );
                setProgress(false);
                handleFindAllBranches();
              }
            },
          });
        }
        break;
      default:
        console.log("no-type-included");
        break;
    }
  };
  const HandleModificationSubmission = () => {
    handleSubmit((values) => {
      const objModification = {
        id: branchMod?.id,
        branchName: values.branchName,
        branchKey: values.branchKey,
        type: "modify",
        branchPath: "auto-branch-path",
      };
      console.log(type);
      switch (type) {
        case "modification":
          setProgress(!progress);
          mutate(objModification, {
            onSuccess: (response: any) => {
              if (response?.data == 200) {
                handleOnToast(
                  "Successfully updated branch",
                  "top-right",
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  "dark",
                  "success"
                );
                setProgress(false);
                setModalOpen(false);
                handleFindAllBranches();
              }
            },
          });
          break;
        default:
          break;
      }
    })();
  };
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container>
          <UncontrolledCard
            style={{
              borderRadius: "15px",
            }}
          >
            <Typography variant="inherit">
              Branch Category Management
            </Typography>
            <ControlledTabs
              orientation="horizontal"
              value={tabsValue}
              handleChange={handleChange}
              style={{
                marginTop: "10px",
                padding: "10px",
              }}
              tabsinject={[
                {
                  label: "BRANCH CREATION",
                },
                {
                  label: "BRANCH LIST",
                },
              ]}
            >
              {tabsValue == 0 ? (
                <>
                  <ControlledGrid>
                    <Grid item xs={6}>
                      <UncontrolledCard>
                        <Typography variant="caption">
                          Create New Branch
                        </Typography>

                        <BranchFormField />
                      </UncontrolledCard>
                    </Grid>
                    <Grid item xs={6}>
                      <img
                        src="https://chasingwhereabouts.b-cdn.net/wp-content/uploads/2020/06/3658024-1024x683.jpg.webp"
                        style={{
                          width: "100%",
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
                    <NormalButton
                      children="REFRESH"
                      variant="outlined"
                      size="small"
                      sx={{
                        float: "right",
                        mt: 2,
                        mb: 2,
                      }}
                      onClick={handleFindAllBranches}
                    />
                    <ProjectTable
                      sx={{ mt: 7, width: "100%" }}
                      data={branches}
                      columns={columns}
                      pageSize={5}
                    />
                  </>
                )
              )}
            </ControlledTabs>
            <ControlledBackdrop open={progress} />
          </UncontrolledCard>
          <ControlledModal
            open={modalOpen}
            title="Modify branch"
            maxWidth={"md"}
            buttonTextAccept="SAVE"
            buttonTextDecline="CANCEL"
            disabled={!isValid}
            handleSubmit={HandleModificationSubmission}
            handleClose={() => setModalOpen(false)}
            handleDecline={() => setModalOpen(false)}
          >
            <Typography variant="caption">Branch modification</Typography>
            <FormProvider {...form}>
              <BranchModificationForm />
            </FormProvider>
          </ControlledModal>
        </Container>
      )}
    </>
  );
};

export default Branch;
