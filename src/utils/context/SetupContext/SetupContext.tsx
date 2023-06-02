import React, {createContext, useContext} from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useRouter } from "next/router";

const SetupContext = createContext<{
    setupCheckUsersDB(props : SetupCheckUserDBProps): void
}>(undefined as any)
type SetupCheckUserDBProps = {
    location: string
}
export const SetupProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const router = useRouter()
    const apiconfigSetupCheckUsers = useApiCallBack((api) => api.users.SetupCheckApplicationsUsers())
    const setupCheckUsersDB = (props: SetupCheckUserDBProps) => {
        apiconfigSetupCheckUsers.execute()
        .then((response : any) => {
           const { data } : any = response;
           if(props.location == "login"){
            if(data == 'exist') {
                return;
               } else {
                router.push('/admin-account-setup')
               }
           } else { // add new location so api and route can identify where to check.
            if(data == 'exist') {
                router.push('/')
               } else {
                router.push('/admin-account-setup')
               }
           }
        })
    }

    return (
        <SetupContext.Provider value={{setupCheckUsersDB}}>{children}</SetupContext.Provider>
    )
}

export const useSetupContext = () => {
    if(!SetupContext) {
        throw new Error("Setup context must be used")
    }
    return useContext(SetupContext)
}