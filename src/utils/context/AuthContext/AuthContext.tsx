import { createContext, useContext, useState } from 'react'
import { useAccessToken, useRefreshToken, useBranchPath, usePlatform } from '@/utils/hooks/useToken'
import { useRouter } from 'next/router'
import { decrypt, encrypt } from '@/utils/config/encryptor'
const context = createContext<{
    checkAuthentication(): Promise<any>;
    identifier: boolean
}>(undefined as any)

export const AuthenticationProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const router = useRouter()
    const [identifier, setIdentifier] = useState(false)
    const [accessToken, setAccessToken] = useAccessToken()
    const [branchPath, setBranchPath] = useBranchPath()
    const checkAuthentication = () => {
            return new Promise((resolve) => {
                let savedAuthenticationStorage;
            let savedPath;
            let savedPlatform;
            const savedAuthStorage = localStorage.getItem('AT')
            const savedPathStorage = localStorage.getItem('BP')
            const savedPlatformStorage = localStorage.getItem('PF')
            if(typeof savedAuthStorage == "string" && typeof savedPathStorage == "string" && typeof savedPlatformStorage == 'string') {
                savedAuthenticationStorage = JSON.parse(savedAuthStorage)
                savedPath = JSON.parse(savedPathStorage)
                savedPlatform = JSON.parse(savedPlatformStorage)
            }
            if(!savedAuthenticationStorage || !savedPath){
                resolve("no-auth")
                router.push('/login')
            } else{
                resolve("authenticated")
                setIdentifier(false)
                router.push(decrypt(savedPath))
            }
            })
    }
    return (
        <context.Provider value={{checkAuthentication, identifier}}>
            {children}
        </context.Provider>
    )
}

export const useAuthenticationContext = () => {
    if(!context) {
        throw new Error("Authentication Context must be used.")
    }
    return useContext(context)
}