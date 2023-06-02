import { Typography } from "@mui/material";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { MAX_UAM_UAM_STEPS } from "..";
import { NormalButton } from "@/components/Button/NormalButton";
import {Grid} from "@mui/material";
import { useAtom } from "jotai";
import { UAMAccountCreationAtom, UAMAccountCredentialsAtom } from "@/utils/hooks/useAtomic";

export const Completed = () => {
    const { setActiveStep } = useActiveSteps(MAX_UAM_UAM_STEPS)
    const [uamCreation, setUAMCreation] = useAtom(UAMAccountCreationAtom)
    const [uamCredetials, setUAMCredentials] = useAtom(UAMAccountCredentialsAtom)

    const handleStartOver = () => {
        setUAMCreation(undefined)
        setUAMCredentials(undefined)
        setActiveStep(0)
    }

    return (
        <>
            <Typography variant='h5' mb='2'>
                Completed
            </Typography>
            <Grid item xs={12} display='flex' justifyContent='center'>
                <NormalButton 
                sx={{ mx: 'auto', mt: 2, width: [, 300]}}
                color='primary'
                variant='outlined'
                fullWidth
                onClick={handleStartOver}
                children='START OVER'
                />
            </Grid>
        </>
    )
}