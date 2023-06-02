import { ControlledGrid, UncontrolledCard, ControlledBackdrop } from "@/components";
import DashboardLayout from "@/components/Layout";
import { sidebarList } from "@/components/Layout/Sidebar/SidebarConfig";
import {Container, Grid, Typography} from '@mui/material'
import { useAccessToken } from "@/utils/hooks/useToken";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { SchedulerCalendar } from "@/components/Calendar/Calendar";
const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const { checkAuthentication } = useAuthenticationContext()
   
    useEffect(() => {
        setTimeout(() => {
            checkAuthentication().then((res) => {
                if(res == 'authenticated'){
                    setLoading(false)
                }
            })
        }, 3000)
    }, [])
    return(
        <div>
           {
            loading ? 
            <ControlledBackdrop open={loading} />
            :
            <Container>
            <ControlledGrid>
             <Grid item xs={3}>
                 <UncontrolledCard
                 style={{
                     background: '#153D77'
                 }}
                 >
                     <Typography
                     variant='subtitle1'
                     gutterBottom
                     style={{
                         color: 'white'
                     }}
                     >
                         Managers
                     </Typography>
                     <Typography
                     variant='h6'
                     gutterBottom
                     style={{
                         float: 'right',
                         marginBottom: '10px',
                         color: 'white'
                     }}
                     >0</Typography>
                 </UncontrolledCard>
             </Grid>
             <Grid item xs={3}>
                 <UncontrolledCard
                 style={{
                     background: '#153D77'
                 }}
                 >
                     <Typography
                     variant='subtitle1'
                     gutterBottom
                     style={{
                         color: 'white'
                     }}
                     >
                         Clients
                     </Typography>
                     <Typography
                     variant='h6'
                     gutterBottom
                     style={{
                         float: 'right',
                         marginBottom: '10px',
                         color: 'white'
                     }}
                     >0</Typography>
                 </UncontrolledCard>
             </Grid>
             <Grid item xs={3}>
                 <UncontrolledCard
                 style={{
                     background: '#153D77'
                 }}
                 >
                     <Typography
                     variant='subtitle1'
                     gutterBottom
                     style={{
                         color: 'white'
                     }}
                     >
                         Branches
                     </Typography>
                     <Typography
                     variant='h6'
                     gutterBottom
                     style={{
                         float: 'right',
                         marginBottom: '10px',
                         color: 'white'
                     }}
                     >0</Typography>
                 </UncontrolledCard>
             </Grid>
             <Grid item xs={3}>
                 <UncontrolledCard
                 style={{
                     background: '#153D77'
                 }}
                 >
                     <Typography
                     variant='subtitle1'
                     gutterBottom
                     style={{
                         color: 'white'
                     }}
                     >
                         Appointments
                     </Typography>
                     <Typography
                     variant='h6'
                     gutterBottom
                     style={{
                         float: 'right',
                         marginBottom: '10px',
                         color: 'white'
                     }}
                     >0</Typography>
                 </UncontrolledCard>
             </Grid>
            </ControlledGrid>
            <UncontrolledCard style={{ margin: '10px'}}>
            <SchedulerCalendar />
            </UncontrolledCard>
         </Container>
           }
        </div>
    )
}

export default Dashboard