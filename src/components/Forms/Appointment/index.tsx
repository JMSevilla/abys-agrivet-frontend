import { Box } from "@mui/material";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { OnboardingStepper } from "@/components/Stepper/Stepper";
import { APBasicInformation } from "./forms/APBasicInformation";
import { Services } from "./forms/APServices";
import { PetInformation } from "./forms/APPetInformation";
import { APScheduling } from "./forms/APScheduling";
import { APSchedulingNotificationType } from "./forms/APSchedulingNotifType";
import { Completed } from "./forms/Completed";
const APPOINTMENT_MAP : Array<{
    label: string, form: React.FC
}> = [
    {
        label: 'APBasic Information',
        form: APBasicInformation
    },
    {
        label: 'AP Services',
        form: Services
    },
    {
        label: 'Pet Information',
        form : PetInformation
    },
    {
        label: 'Scheduling',
        form : APScheduling
    },
    {
        label: 'Notif Scheduling',
        form: APSchedulingNotificationType
    },
    {
        label: 'Completed',
        form : Completed
    }
]

export const MAX_APPOINTMENT_STEPS = APPOINTMENT_MAP.length

export const AppointmentAdditionalDetails = () => {
    const { activeStep } = useActiveSteps(MAX_APPOINTMENT_STEPS)
    const { form: ActiveForm } = APPOINTMENT_MAP[activeStep]

    return (
        <>
            <OnboardingStepper 
            sx={{ mt: 3 }}
            activeStep={activeStep}
            steps={[
                'Basic Information',
                'Services & Branch',
                'Pet Information',
                'Pick a schedule',
                'Schedule Notification Type',
                'Completed'
            ]}
            />
            <Box mt={2} width="100%">
                <ActiveForm />
            </Box>
        </>
    )
}