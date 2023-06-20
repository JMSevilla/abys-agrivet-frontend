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
    const GetAllSchedulePerBranch = useApiCallBack(
      async (api, branch: number) =>
      await api.abys.findAllSchedulePerBranch(branch)
    )
    const [feed, setFeed] = useState<Array<{
      id: number
      title: string
      start: Date
      end: Date
      isHoliday?: boolean | undefined
    }>>([])
  const getallscheduleperbranches = () => {
    GetAllSchedulePerBranch.execute(references?.branch ?? 0).then((response) => {
        if(response?.data?.length > 0){
            var chk = response?.data?.map((item:any) => {
                return {
                    id: item?.id,
                    title: item?.title,
                    start: item?.start,
                    end: moment(item?.end).add(1, 'days'),
                    isHoliday: item?.isHoliday
                }
            })
            setFeed(chk)
        } else {
            setFeed([])
        }
    })
  }
    useEffect(() => {
      getallscheduleperbranches()
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
            <Grid item xs={4}>
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
                  Appointments
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
                  0
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={4}>
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
                  Today's Appointments
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
                  0
                </Typography>
              </UncontrolledCard>
            </Grid>
            <Grid item xs={4}>
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
                  0
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
                views={["day", "agenda", "week", "month"]} 
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