import { AxiosInstance } from "axios";

export class AbysApi {
    constructor(private readonly axios: AxiosInstance){}

    public GetAllBranches(){
        return this.axios.get('/api/implbranch/get-all-branches')
    }
}