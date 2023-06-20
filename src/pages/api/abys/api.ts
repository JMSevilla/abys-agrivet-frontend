import { AxiosInstance } from "axios";
import { BranchProps, CreateNewAppointment, CreateNewFollowUpAppointment, CreateNewScheduleProps, SMSVerificationProps } from "@/utils/types";
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
  public findAffectedSchedules(props : {
    start: Date,
    end: Date
  }){
    return this.axios.get(`/api/implappointment/check-affected-schedules/${props.start}/${props.end}`)
  }
  public postNewHoliday(props: CreateNewScheduleProps){
    return this.axios.post('/api/implappointment/post-new-holiday', props)
  }
  public CheckIfDayPropIsHoliday(id: number){
    return this.axios.get(`/api/implappointment/check-if-holiday/${id}`)
  }
  public removeAffectedSchedules(props: {
    id: number,
    userid: number
  }) {
    return this.axios.delete(`/api/implappointment/remove-affected-schedules/${props.id}/${props.userid}`)
  }
  public getAllAppointmentPerBranch(branchId: number) {
    return this.axios.get(`/api/implappointment/get-all-appointments-per-branch/${branchId}`)
  }
  public createNewFollowAppointment(props: CreateNewFollowUpAppointment){
    return this.axios.post('/api/implappointment/create-follow-up-appointment', props)
  }
  public checkAppointmentIfDone(){
    return this.axios.get('/api/implappointment/check-appointment-if-done')
  }
  public appointmentSessionActions(props : {
    actions: string | undefined,
    id: number,
    managerUid: number
  }){
    return this.axios.put(`/api/implappointment/appointment-session-actions`, props)
  }
  public GetSessionUser(manageruid: number){
    return this.axios.get(`/api/implappointment/get-assigned-user-session/${manageruid}`)
  }
  public MakeAppointmentDone(id: number) {
    return this.axios.put(`/api/implappointment/appointment-make-it-done/${id}`)
  }
  public FollowUpAppointmentList(id: number) {
    return this.axios.get(`/api/implappointment/follow-up-appointments-list/${id}`)
  }
  public SearchEngineFollowUpAppointment(props : {
    start: any,
    end: any,
    customerName: string | undefined
  }) {
    return this.axios.get(`/api/implappointment/search-follow-up-appointments/${props.start}/${props.end}/${props.customerName}`)
  }
}
