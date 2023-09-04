import { AxiosInstance } from "axios";
import { AccountSetup, ProfileManagement, UAMProps } from "@/utils/types";
export class UsersApi {
    constructor(private readonly axios: AxiosInstance){}

    public SetupCheckApplicationsUsers() {
        return this.axios.get('/api/implusers/check-users')
    }
    public SetupAccountRegistration(props : AccountSetup) {
        return this.axios.post('/api/implusers/add-new-user-setup', props)
    }
    public UAMCreateNewUser(props : UAMProps){
        return this.axios.post('/api/implusers/uam-add-new-user', props)
    }
    public UAMGetAllList(){
        return this.axios.get('/api/implusers/uam-get-all')
    }
    public CustomerAccountRegistration(props: AccountSetup){
        return this.axios.post('/api/implusers/customer-account-registration', props)
    }
    public ChangePassword(props : {
        email: string | undefined,
        password: string | undefined
    }){
        return this.axios.put('/api/implusers/change-password', props)
    }
    public UAMDeleteUser(id: number) {
        return this.axios.delete(`/api/implusers/uam-delete-user/${id}`)
    }
    public UpdateProfile(props: ProfileManagement) {
        return this.axios.put('/api/implusers/update-profile-user', props)
    }
    public FilterAccessLevel(access_level: number) {
        return this.axios.get(`/api/implusers/filter-uam-by-accesslevel/${access_level}`)
    }
    public FilterServices(branch_id: number){
        return this
        .axios.get(`/api/implusers/filter-services/${branch_id}`)
    }
}