import { AxiosInstance } from "axios";

export class UsersApi {
    constructor(private readonly axios: AxiosInstance){}

    public SetupCheckApplicationsUsers() {
        return this.axios.get('/api/implusers/check-users')
    }
}