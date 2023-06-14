import { ControlledBackdrop, UncontrolledCard } from "@/components"
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext"
import { Container, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SettingsContent } from "@/components/Forms/Settings"

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { checkAuthentication } = useAuthenticationContext()

    useEffect(() => {
        setTimeout(() => {
            checkAuthentication().then((res) => {
              if (res == "authenticated") {
                setLoading(false);
              }
            });
          }, 3000);
    }, [])

    return (
        <>
        {
            loading ? (
                <ControlledBackdrop open={loading} />
            ) : (
                <Container maxWidth='xl'>
                    <UncontrolledCard>
                        <Typography variant='button'>Settings Management</Typography>
                        <br />
                        <Typography variant='caption'>
                            Settings management refers to the process of organizing and controlling the various configurable options within the application.
                        </Typography>
                        <SettingsContent />
                    </UncontrolledCard>
                </Container>
            )
        }
        </>
    )
}

export default Settings