import { Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { NormalButton } from "@/components/Button/NormalButton";
import { useAtom } from "jotai";
import { AppointmentAtom, AppointmentPetInformationAtom, AppointmentSchedulingAtom, AppointmentServicesAtom } from "@/utils/hooks/useAtomic";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { MAX_APPOINTMENT_STEPS } from "..";

export const Completed = () => {
    const [appointment, setAppointment] = useAtom(AppointmentAtom)
    const [services, setServices] = useAtom(AppointmentServicesAtom)
    const [petinfo, setPetInfo] = useAtom(AppointmentPetInformationAtom)
    const [schedule, setSchedule] = useAtom(AppointmentSchedulingAtom)
    const { setActiveStep } = useActiveSteps(MAX_APPOINTMENT_STEPS)
  const handleStartOver = () => {
    setActiveStep(0)
    setAppointment(undefined)
    setServices(undefined)
    setPetInfo(undefined)
    setSchedule(undefined)
  };

  return (
    <>
      <Typography variant="h5" mb="2">
        Completed
      </Typography>
      <Grid item xs={12} display="flex" justifyContent="center">
        <NormalButton
          sx={{ mx: "auto", mt: 2, width: [, 300] }}
          color="primary"
          variant="outlined"
          fullWidth
          onClick={handleStartOver}
          children="START OVER"
        />
      </Grid>
    </>
  );
};
