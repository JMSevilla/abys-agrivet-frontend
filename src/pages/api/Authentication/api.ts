import { AxiosInstance } from "axios";
import { JWTAccountCreationProps, AccountLoginWithJWT, AuthenticationProps } from "@/utils/types";
export class AuthenticationApi {
    constructor(private readonly axios: AxiosInstance){}
    public JWTAccountCreation(props: JWTAccountCreationProps){
        return this.axios.post('/api/authentication/jwt-account-creation', props)
    }
    public Login(props : AccountLoginWithJWT){
        return this.axios.post('/api/implusers/login', props)
    }
    public RefreshToken(props : AuthenticationProps){
        return this.axios.post('/api/implusers/refresh-token', props)
    }
}