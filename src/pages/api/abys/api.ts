import { AxiosInstance } from "axios";
import { BranchProps, SMSVerificationProps } from "@/utils/types";
export class AbysApi {
  constructor(private readonly axios: AxiosInstance) {}

  public GetAllBranches() {
    return this.axios.get("/api/implbranch/get-all-branches");
  }
  public SendSMSVerification(props: SMSVerificationProps) {
    return this.axios.post(
      `/api/implverification/send-verification-code-sms/${props.verificationCredentials.email}/${props.verificationCredentials.phoneNumber}`,
      props
    );
  }
  public CheckSMSVerification(props: {
    code: string;
    email: string | undefined;
  }) {
    return this.axios.post(
      `/api/implverification/check-verification-code/${props.code}/${props.email}`
    );
  }
  public ResendSMS(props: { type: string; email: string | undefined }) {
    return this.axios.post(
      `/api/implverification/sms-resend-verification/${props.type}/${props.email}`
    );
  }
  public FindHighestBranchId() {
    return this.axios.get("/api/implbranch/find-highest-branch-id");
  }
  public saveNewBranch(props: BranchProps) {
    return this.axios.post("/api/implbranch/save-new-branch", props);
  }
  public findAllBranchesManagement() {
    return this.axios.get("/api/implbranch/find-all-branch-management");
  }
  public GroupBranchActions(props?: {
    id: number | undefined;
    branchName: string | undefined;
    branchKey: string | undefined;
    type: string | undefined;
  }) {
    return this.axios.post(
      `/api/implbranch/group-branch-actions/${props?.type}`,
      props
    );
  }
  public createNewServices(props: {
    serviceName: string | undefined;
    serviceBranch: string | undefined;
  }) {
    return this.axios.post("/api/implservices/create-new-services", props);
  }
  public getAllServices() {
    return this.axios.get("/api/implservices/get-all-services");
  }
}
