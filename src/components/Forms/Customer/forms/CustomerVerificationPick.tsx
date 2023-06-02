import { UncontrolledCard } from "@/components/Card/Card";
import { Typography, Grid } from '@mui/material'
import { useApiCallBack } from "@/utils/hooks/useApi";
import { ControlledGrid } from "@/components/Grid/Grid";
export const ChooseVerificationType = () => {
    return (
        <>
        <ControlledGrid>
            <Grid item xs={6}>
                <UncontrolledCard
                style={{
                    borderRadius: '20px',
                    cursor: 'pointer'
                }}
                >
                    <div style={{ textAlign : 'center'}}>
                    <img 
                    src="https://email.uplers.com/blog/wp-content/uploads/2022/07/1-Signatures-blog.gif"
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: '50px'
                    }}
                    />
                    <Typography variant='button'>Send Verification Code via Email</Typography> <br />
                    <Typography variant='caption'>
                        You will received the verification code on your email
                    </Typography>
                    </div>
                </UncontrolledCard>
            </Grid>
            <Grid item xs={6}>
            <UncontrolledCard
                style={{
                    borderRadius: '20px',
                    cursor: 'pointer'
                }}
                >
                    <div style={{ textAlign : 'center'}}>
                    <img 
                    src="https://i.pinimg.com/originals/fe/c2/39/fec23921611cc3abb6db1774e284a251.gif"
                    style={{
                        width: '54%',
                        height: 'auto',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: '50px'
                    }}
                    />
                    <Typography variant='button'>Send Verification Code via SMS</Typography> <br />
                    <Typography variant='caption'>
                        You will received the verification code on your email
                    </Typography>
                    </div>
                </UncontrolledCard>
            </Grid>
        </ControlledGrid>
        </>
    )
}