
import { Box, } from "@mui/material";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { UAMBasicInformation, UAMCredentialsInformation, Completed } from "./forms";
import { OnboardingStepper } from "@/components/Stepper/Stepper";
const UAM_MAP : Array<{ label: string , form: React.FC }> = [
    {
        label: 'UAMBasicInformation',
        form: UAMBasicInformation
    },
    {
        label: 'UAMCredentialsInformation',
        form: UAMCredentialsInformation
    },
    {
        label: 'Completed',
        form: Completed
    }
]

export const MAX_UAM_UAM_STEPS = UAM_MAP.length;

export const UAMFormAdditionalDetails = () => {
    const { activeStep } = useActiveSteps(MAX_UAM_UAM_STEPS)
    const { form: ActiveForm } = UAM_MAP[activeStep]
    return (
        <>
         <OnboardingStepper 
            sx={{ mt: 3 }}
            activeStep={activeStep}
            steps={["Basic Information", "Credentials", "Completed"]}
            />
            <Box mt={2} width="100%">
                <ActiveForm />
            </Box>
        </>
    )
}