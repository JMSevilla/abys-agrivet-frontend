import { LoginAdditionalForm } from "@/components/Forms/Login/LoginForm"
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext"
import { useEffect, useState } from 'react'
import { useBranchPath, usePlatform } from "@/utils/hooks/useToken"
import { useRouter } from "next/router"
import { decrypt } from "@/utils/config/encryptor"
import { ControlledBackdrop } from "@/components"
const Login: React.FC = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const { checkAuthentication } = useAuthenticationContext()
    const [branchPath, setBranchPath] = useBranchPath()
    useEffect(() => {
        checkAuthentication().then((res) => {
            if (res == "authenticated") {
                setLoading(false);
                router.push(decrypt(branchPath))
            } else {
                setLoading(false)
            }
            });
        
    }, [])
    return (
       <>
        {
            loading ? <ControlledBackdrop open={loading} /> :
            <LoginAdditionalForm />
        }
       </>
    )
}

export default Login