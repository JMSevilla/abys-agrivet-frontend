import { createContext, useContext, useState, useCallback } from 'react'
import { useApiCallBack } from '@/utils/hooks/useApi'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

const usercontext = createContext<{
    lookAllUsersFromUAM(): Promise<any>
}>(undefined as any)

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const FetchAllUAM = useApiCallBack(api => api.users.UAMGetAllList())
    const router = useRouter()
    const lookAllUsersFromUAM = () => {
        return new Promise((resolve) => {
            FetchAllUAM.execute().then(response => {
                resolve(response.data)
            }).catch((err) => {
                sessionStorage.clear()
                router.push('/platform')
            })
        })
    }
    return (
        <usercontext.Provider value={{
            lookAllUsersFromUAM
        }}>
            {children}
        </usercontext.Provider>
    )
}

export const useUserContext = () => {
    if(!usercontext){
        throw new Error("User Context must be used")
    }
    return useContext(usercontext)
}