import { AxiosInstance } from "axios";
import { BranchProps, CreateNewAppointment, CreateNewFollowUpAppointment, CreateNewLobbyAppointment, CreateNewScheduleProps, SMSVerificationProps } from "@/utils/types";
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
  public findAllSchedulePerBranch(props: {
    branch: number,
    userid?: number
  }){
    return this.axios.get(`/api/implappointment/get-all-schedule-per-branch/${props.branch}/${props.userid}`)
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
  public findHolidaySchedules(
    props : {
      start: Date,
      end: Date
    }
  ) {
    return this.axios.get(`/api/implappointment/check-holidays/${props.start}/${props.end}`)
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
  public MakeAppointmentDone(props : { id: number, deletionId: number }) {
    return this.axios.put(`/api/implappointment/appointment-make-it-done/${props.id}/${props.deletionId}`)
  }
  public FollowUpAppointmentList(props : {branch_id: number, id: number}) {
    return this.axios.get(`/api/implappointment/follow-up-appointments-list/${props.branch_id}/${props.id}`)
  }
  public SearchEngineFollowUpAppointment(props : {
    start: any,
    end: any,
    customerName: string | undefined
  }) {
    return this.axios.get(`/api/implappointment/search-follow-up-appointments/${props.start}/${props.end}/${props.customerName}`)
  }
  public FollowUpSessionActions(
    props: {
      id: number,
      actions: string
    }
  ){
    return this.axios.put(`/api/implappointment/follow-up-session-management`, props)
  }
  public FollowUpCountNeedToDone(props : {branch_id: number, id: number}){
    return this.axios.get(`/api/implappointment/follow-up-count-done/${props.branch_id}/${props.id}`)
  }
  public todaysAppointment(branch_id: number) {
    return this.axios.get(`/api/implappointment/get-todays-appointment/${branch_id}`)
  }
  public newLobbyAppointment(props : CreateNewLobbyAppointment){
    return this.axios.post('/api/implappointment/bring-appointment-lobby', props)
  }
  public FindAllWalkedInLobbies(branch_id: number) {
    return this.axios.get(`/api/implappointment/find-all-lobbies/${branch_id}`)
  }
  public DeleteAfterProceedFromLobby(id: number) {
    return this.axios.delete(`/api/implappointment/remove-after-proceed-from-lobby/${id}`)
  }
  public CountAppointments(props:{
    branch_id : number,
    type: string | undefined
  }){
    return this.axios.get(`/api/implappointment/count-reports/${props.branch_id}/${props.type}`)
  }
  public WalkedInAppointments(branch_id: number) {
    return this.axios.get(`/api/implappointment/get-all-walked-in-appointments/${branch_id}`)
  }
  public FindAllRecordPerBranch(branch_id: number) {
    return this.axios.get(`/api/implappointment/get-all-record-done-appointment/${branch_id}`)
  }
  public FindUserByManagerId(manager_id: number) {
    return this.axios.get(`/api/implappointment/get-user-by-manager-id/${manager_id}`)
  }
  public FindFollowUpsByAPId(id: number) {
    return this.axios.get(`/api/implappointment/find-follow-ups-by-appointment-id/${id}`)
  }
  public FindPrimaryAppointments(id: number) {
    return this.axios.get(`/api/implappointment/find-primary-appointments/${id}`)
  }
  public DeleteService(id: number) {
    return this.axios.delete(`/api/implservices/delete-service/${id}`)
  }
  public CountAdminReportCard(type: string){
    return this.axios.get(`/api/implappointment/counts-admin-report/${type}`)
  }
  public FindAppointmentsByEmail(email : string) {
    return this.axios.get(`/api/implappointment/find-appointment-by-email/${email}`)
  }
  public CountCustomerReportCard(
    props: { type: string, email: string }
  ){
    return this.axios.get(`/api/implappointment/count-appointment-customer-card/${props.type}/${props.email}`)
  }
  public getNotifyOnPageReload() {
    return this.axios.get(`/api/implappointment/check-reminder`)
  }
  public reminderSystem(
    props : {
      type: number,
      id: number,
      email: string,
      phoneNumber: string
    }
  ){
    return this.axios.put(
      `/api/implverification/reminder-system/${props.type}/${props.id}/${props.email}/${props.phoneNumber}`
    )
  }
  public CheckSavedEventOnDB(id: number) {
    return this.axios.get(`/api/implappointment/check-event-db-saved/${id}`)
  }
  public CancelAppointmentOnLobby(id: number){
    return this.axios.delete(`/api/implappointment/cancel-appointment-lobby/${id}`)
  }
  public FilterRecordsByBranch(branch_id: number) {
    return this.axios.get(`/api/implappointment/filter-records-by-branch/${branch_id}`)
  }
  public PushToArchive(id: number) {
    return this.axios
    .put(`/api/implappointment/push-to-archive/${id}`)
  }
  public activateServices(props : {
    id: number, type: string
  }) {
    return this.axios.put(`/api/implservices/activate-service/${props.id}/${props.type}`)
  }
  public modifyPrimaryServiceDetails(props: {
    id: number, serviceName: string
  }) {
    return this.axios.put(`/api/implservices/service-modification/${props.id}/${props.serviceName}`)
  }
  public GetAllRecordAllBranch(){
    return this.axios.get('/api/implappointment/get-all-record-all-branch')
  }
  public deleteRecords(id: number){
    return this.axios.delete(`/api/implappointment/delete-records/${id}`)
  }
}
