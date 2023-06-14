import { Container, Typography } from "@mui/material";
import { ControlledBackdrop, UncontrolledCard } from "@/components";
import { AppointmentAdditionalDetails } from "@/components/Forms/Appointment";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
const CreateAppointment: React.FC = () => {
    const [loading, setLoading] = useState(true);
  const { checkAuthentication } = useAuthenticationContext();

  useEffect(() => {
    setTimeout(() => {
      checkAuthentication().then((res) => {
        if (res == "authenticated") {
          setLoading(false);
        }
      });
    }, 3000);
  }, []);
    return (
        <>
           {loading ? <ControlledBackdrop open={loading} /> :  <Container>
                <UncontrolledCard>
                    <Typography variant="caption">Create Appointment</Typography>
                    <AppointmentAdditionalDetails />
                </UncontrolledCard>
            </Container>}
        </>
    )
}

export default CreateAppointment