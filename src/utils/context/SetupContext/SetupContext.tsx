import React, {createContext, useContext} from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useRouter } from "next/router";

const SetupContext = createContext<{
    setupCheckUsersDB(): void
}>(undefined as any)

export const SetupProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const apiconfigSetupCheckUsers = useApiCallBack((api) => api.users.SetupCheckApplicationsUsers())
    const setupCheckUsersDB = () => {
        apiconfigSetupCheckUsers.execute()
        .then((response : any) => {
            console.log(response)
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