import { Box } from "@mui/material";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { OnboardingStepper } from "@/components/Stepper/Stepper";
import { CheckEmail } from "./CheckEmailForm";
import { UncontrolledCard } from "@/components/Card/Card";
import { CheckCode } from "./CheckVerificationCode";
import { FPNewPassword } from "./ProvideNewPassword";
const UAM_FP : Array<{label: string, form: React.FC}> = [
    {
        label: 'Check email',
        form: CheckEmail
    },
    {
        label: 'Check code',
        form: CheckCode
    },
    {
        label: 'New password',
        form: FPNewPassword
    }
]

export const MAX_FP_STEPS = UAM_FP.length;

export const FPFormAdditionalDetails = () => {
    const { activeStep } = useActiveSteps(MAX_FP_STEPS)
    const { form: ActiveForm } = UAM_FP[activeStep]

    return (
        <>
        <OnboardingStepper 
            sx={{ mt: 3 }}
            activeStep={activeStep}
            steps={['Checking email', 'Verification Entry', 'Provide New Password']}
        />
        <Box mt={2} width="100%">
            <UncontrolledCard style={{
                marginTop: '10px',
                borderRadius: '20px'
            }}>
                <ActiveForm />
            </UncontrolledCard>
        </Box>
        </>
    )
}