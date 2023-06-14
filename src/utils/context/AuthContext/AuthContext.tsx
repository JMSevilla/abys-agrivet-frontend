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
            let userType;
            let savedRef;
            let savedUid;
            const savedUidStorage = sessionStorage.getItem('UID')
            const savedRefStorage = sessionStorage.getItem('REF')
            const userTypeStorage = sessionStorage.getItem('UT')
            const savedAuthStorage = sessionStorage.getItem('AT')
            const savedPathStorage = sessionStorage.getItem('BP')
            const savedPlatformStorage = sessionStorage.getItem('PF')
            if(typeof savedUidStorage == 'string' && typeof savedRefStorage == 'string'){
                savedRef = JSON.parse(savedRefStorage)
                savedUid = JSON.parse(savedUidStorage)
            }
            if(typeof savedAuthStorage == "string" && typeof savedPathStorage == "string" && typeof savedPlatformStorage == 'string') {
                savedAuthenticationStorage = JSON.parse(savedAuthStorage)
                savedPath = JSON.parse(savedPathStorage)
                savedPlatform = JSON.parse(savedPlatformStorage)
            }
            if(typeof userTypeStorage == 'string') {
                userType = JSON.parse(userTypeStorage)
            }
            if(!savedRef || !savedUid){
                resolve("no-auth")
                router.push('/login')
            } else {
                if(!savedAuthenticationStorage || !savedPath){
                    if(!userType) {
                        resolve("no-auth")
                        router.push('/login')
                    } else {
                        resolve("authenticated")
                        setIdentifier(false)
                        router.push(decrypt(savedPath))
                    }
                } else{
                    resolve("authenticated")
                    setIdentifier(false)
                    router.push(decrypt(savedPath))
                }
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