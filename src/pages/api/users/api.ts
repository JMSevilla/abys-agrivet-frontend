import { AxiosInstance } from "axios";
import { AccountSetup, UAMProps } from "@/utils/types";
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
}