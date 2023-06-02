import { createContext, useContext, useState, useCallback } from 'react'
import { useApiCallBack } from '@/utils/hooks/useApi'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

const usercontext = createContext<{
    lookAllUsersFromUAM(): void
    users: any
}>(undefined as any)

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const FetchAllUAM = useApiCallBack(api => api.users.UAMGetAllList())
    const [users, setUsers] = useState([])
    const router = useRouter()
    const lookAllUsersFromUAM = useCallback(() => {
        FetchAllUAM.execute().then(response => {
            setUsers(response.data)
        }).catch((err) => {
            localStorage.clear()
                router.push('/platform')
        })
    }, [])
    return (
        <usercontext.Provider value={{
            lookAllUsersFromUAM, users
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