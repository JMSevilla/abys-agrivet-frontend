import { AxiosInstance } from "axios";
import { BranchProps, CreateNewAppointment, CreateNewScheduleProps, SMSVerificationProps } from "@/utils/types";
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
    type?: string | undefined
  }) {
    return this.axios.post(
      `/api/implverification/check-verification-code/${props.code}/${props.email}/${props.type}`
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
  public branchOnServicesExceptAllBranch(){
    return this.axios.get('/api/implbranch/appointment-branch-list')
  }
  public createNewSchedule(props: CreateNewScheduleProps){
    return this.axios.post('/api/implappointment/create-schedule', props)
  }
  public findAllSchedulePerBranch(branch: number){
    return this.axios.get(`/api/implappointment/get-all-schedule-per-branch/${branch}`)
  }
  public handleSelectedSchedule(id: number){
    return this.axios.delete(`/api/implappointment/remove-selected-schedule/${id}`)
  }
  public CreateNewAppointment(props: CreateNewAppointment){
    return this.axios.post('/api/implappointment/create-new-appointment', props)
  }
  public CheckFPEmail(email: string){
    return this.axios.get(`/api/implusers/check-email-users/${email}`)
  }
  public getHighestID() {
    return this.axios.get('/api/implappointment/get-highest-id')
  }
  public checkBeforeRemovingSchedule(id: number){
    return this.axios.get(`/api/implappointment/check-before-removing/${id}`)
  }
  public getAllReminders(){
    return this.axios.get('/api/implappointment/check-reminder')
  }
}
