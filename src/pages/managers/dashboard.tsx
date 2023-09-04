import {
    ControlledGrid,
    UncontrolledCard,
    ControlledBackdrop,
  } from "@/components";
import { Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthenticationContext } from "@/utils/context/AuthContext/AuthContext";
import { SchedulerCalendar } from "@/components/Calendar/Calendar";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useReferences } from "@/utils/hooks/useToken";
import moment from "moment";
const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const { checkAuthentication } = useAuthenticationContext();
    const [references, setReferences] = useReferences()
    const [allAppointments, setAllAppointments] = useState(0)
    const [todaysAppointments, setTodaysAppointments] = useState(0)
    const [doneAppointments, setDoneAppointments] = useState(0)
    const [walkin, setWalkin] = useState(0)
    const GetAllSchedulePerBranch = useApiCallBack(
      async (api, branch: number) =>
      await api.abys.findAllSchedulePerBranch(branch)
    )
    const countAppointments = useApiCallBack(
      async (api, args: {branch_id: number, type: string | undefined}) => await api.abys.CountAppointments(args)
    )
    const [feed, setFeed] = useState<Array<{
      id: number
      title: string
      start: Date
      end: Date
      isHoliday?: boolean | undefined
    }>>([])
  const getallscheduleperbranches = () => {
    GetAllSchedulePerBranch.execute(references?.branch).then((response) => {
      if(response?.data?.length > 0){
            var chk = response?.data?.map((item:any) => {
                return {
                    id: item?.id,
                    title: item?.title,
                    start: moment(item?.start).toDate(),
                    end: moment(item?.end).toDate(),
                    isHoliday: item?.isHoliday
                }
            })
            setFeed(chk)
        } else {
            setFeed([])
        }
    })
  }
  const FuncCountAppointments = async () => {
    try {
      const res = await Promise.all([
        countAppointments.execute({branch_id : references?.branch, type: "appointments_count"}),
        countAppointments.execute({branch_id : references?.branch, type: "todays_appointments"}),
        countAppointments.execute({branch_id : references?.branch, type: "done_appointments"}),
        countAppointments.execute({branch_id : references?.branch, type: "walkin_appointments"})
      ])
      const data = await Promise.all(res.map(r => r.data))
      setAllAppointments(data[0])
      setTodaysAppointments(data[1])
      setDoneAppointments(data[2])
      setWalkin(data[3])
    } catch (error) {
      
    }
  }
    useEffect(() => {
      getallscheduleperbranches()
      FuncCountAppointments()
    }, [])
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
        {loading ? (
            <ControlledBackdrop open={loading} />
        ) : (
            <Container>
                <ControlledGrid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                  Online Appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {allAppointments}
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                  Walked-In Appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {walkin}
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                  Today's Walked-In Appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {todaysAppointments}
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{
                    color: "white",
                  }}
                >
                  Done appointments
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {doneAppointments}
                </Typography>
              </UncontrolledCard>
            </Grid>
                </ControlledGrid>
                <UncontrolledCard style={{
                  marginTop: '20px'
                }}>
                  
                  <Typography variant='button'>
                    Calendar Appointment Schedule for Branch {references?.branch == 1 && 'Palo Alto Calamba City, Laguna'}  
                  </Typography> <br />
                  <Typography variant='caption'>
                    This calendar is viewing only  
                  </Typography> 
                  <SchedulerCalendar 
                appointments={feed}
                views={["month"]} 
                handleSelectedEvent={() => console.log()}
                handleSelection={() => console.log()}
                /> 
                </UncontrolledCard> 
            </Container>
        )}
        </>
    )
}

export default Dashboard