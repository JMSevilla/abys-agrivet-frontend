import { NormalButton } from "./NormalButton";
import { Grid } from "@mui/material";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";

export type BottomButtonGroupsProps = {
    continueButtonLabel?: string;
    onContinue?: () => boolean;
    onBack?: () => boolean
    hideBack?: boolean
    disabledContinue?: boolean
    max_array_length: number
}

export const BottomButtonGroup: React.FC<BottomButtonGroupsProps> = ({
    continueButtonLabel = 'Continue',
    onContinue,
    onBack,
    hideBack,
    disabledContinue,
    max_array_length
}) => {
    const { next, previous } = useActiveSteps(max_array_length)
    const handleContinue = () => {
        if(onContinue !== undefined){
            if(!onContinue()) return;
        }
        next()
    }
    const handleBack = () => {
        if(onBack !== undefined){
            if(!onBack()) return;
        }
        previous()
    }
    return (
        <>
            <Grid item xs={8} display='flex' justifyContent='center'>
                <NormalButton 
                sx={{ mx: 'auto', mt: 2, width: [, 300]}}
                color='primary'
                variant='outlined'
                fullWidth
                disabled={disabledContinue}
                onClick={handleContinue}
                children={continueButtonLabel}
                />
            </Grid>
            {!hideBack && (
                <Grid item xs={8} display='flex' justifyContent='center'>
                    <NormalButton 
                    sx={{ mx: 'auto', mt: 2, width: [, 300]}}
                    fullWidth
                    variant='text'
                    onClick={handleBack}
                    children='Back'
                    />
                </Grid>
            )}
        </>
    )
}