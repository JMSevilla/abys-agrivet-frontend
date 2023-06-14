import { Box } from '@mui/material'
import { useActiveSteps } from '@/utils/hooks/useActiveStep'
import { OnboardingStepper } from '@/components/Stepper/Stepper'
import { HolidayTitle } from './SettingsHolidayTitleForm'
import { SettingsHolidayPickBranch } from './SettingsHolidayPickBranch'
const SETTINGS_MAP : Array<{label: string, form: React.FC}> = [
    {
        label: 'Holiday title',
        form: HolidayTitle
    },
    {
        label: 'Settings Holiday Pick Branch', 
        form: SettingsHolidayPickBranch
    }
]

export const MAX_SETTINGS_STEPS = SETTINGS_MAP.length;

export const SettingsAdditionalDetails = () => {
    const { activeStep } = useActiveSteps(MAX_SETTINGS_STEPS)
    const { form: ActiveForm } = SETTINGS_MAP[activeStep]

    return (
        <>
            <OnboardingStepper 
            sx={{ mt: 3}}
            activeStep={activeStep}
            steps={['Holiday title', 'Choose a branch to apply this holiday', 'Holiday Start/End Date & Check Affected Customer Schedules']}
            />
            <Box mt={2} width="100%">
                <ActiveForm />
            </Box>
        </>
    )
}