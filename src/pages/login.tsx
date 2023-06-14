import { LoginAdditionalForm } from "@/components/Forms/Login/LoginForm"
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext"
import { useEffect, useState } from 'react'
import { usePlatform } from "@/utils/hooks/useToken"
import { useRouter } from "next/router"
const Login: React.FC = () => {
    const router = useRouter()
    const { checkAuthentication } = useAuthenticationContext()
    useEffect(() => {
        let savedPlatform;
        const savedPlatformStorage = sessionStorage.getItem('PF')
        if(typeof savedPlatformStorage == 'string'){
            savedPlatform = JSON.parse(savedPlatformStorage)
        }

        if(!savedPlatform){
            router.push('/platform')
        } else {
            checkAuthentication()
        }
        
    }, [])
    return (
        <LoginAdditionalForm />
    )
}

export default Login