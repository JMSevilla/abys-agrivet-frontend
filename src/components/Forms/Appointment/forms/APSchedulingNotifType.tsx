import { UncontrolledCard } from "@/components/Card/Card";
import { Typography, Grid } from "@mui/material";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation } from "react-query";
import { useAtom } from "jotai";

import { 
    AppointmentAtom,
    AppointmentServicesAtom,
    AppointmentPetInformationAtom,
    AppointmentSchedulingAtom
 } from "@/utils/hooks/useAtomic";
 import { MAX_APPOINTMENT_STEPS } from "..";
 import { useActiveSteps } from "@/utils/hooks/useActiveStep";
 import { ControlledBackdrop } from "@/components/Backdrop/Backdrop";
 import { useState } from "react";
 import { CreateNewAppointment, SMSVerificationProps } from "@/utils/types";
import { useToastContext } from "@/utils/context/Toast/ToastContext";
import { ControlledGrid } from "@/components/Grid/Grid";
import { BottomButtonGroup } from "@/components/Button/BottomButtonGroup";
import { useReferences } from "@/utils/hooks/useToken";

 export const APSchedulingNotificationType = () => {
    const createNewAppointment = useApiCallBack(async (api, args: CreateNewAppointment) => 
    await api.abys.CreateNewAppointment(args))
    const useCreateNewAppointment = useMutation((data : CreateNewAppointment) => 
        createNewAppointment.execute(data)
    );
    const [appointment, setAppointment] = useAtom(AppointmentAtom)
    const [services, setServices] = useAtom(AppointmentServicesAtom)
    const [petinfo, setPetInfo] = useAtom(AppointmentPetInformationAtom)
    const [schedule, setSchedule] = useAtom(AppointmentSchedulingAtom)
    const [loading, setLoading] = useState(false)
    const [references, setReferences] = useReferences()
    const { handleOnToast } = useToastContext()
    const { next } = useActiveSteps(MAX_APPOINTMENT_STEPS)
    const handleSelection = (type: string) => {
        switch(type) {
            case "email":
                setLoading(!loading)
                const obj = {
                    email: appointment?.email,
                    phoneNumber: appointment?.phoneNumber,
                    fullName: appointment?.fullname,
                    branch_id: services?.branch_id,
                    service_id: JSON.stringify(services?.service_id),
                    petInfo: JSON.stringify(petinfo?.petInfo),
                    appointmentSchedule: JSON.stringify(schedule?.appointmentSchedule),
                    status: 1,
                    isWalkedIn: 0,
                    notify: 0,
                    reminderType: 1
                }
                useCreateNewAppointment.mutate(obj, {
                    onSuccess: (response) => {
                        if(response?.data == 200) {
                            handleOnToast(
                                "Successfully created an appointment.",
                                "top-right",
                                false,
                                true,
                                true,
                                true,
                                undefined,
                                "dark",
                                "success"
                            );
                            setLoading(false)
                            next()
                        }
                    },
                    onError: (err) => {
                        console.log(err)
                    }
                })
                break;
            default:
                break;
        }
    }
    return (
        <>
            <ControlledGrid>
                <Grid item xs={6}>
                    <UncontrolledCard
                    style={{
                        borderRadius: '20px',
                        cursor: 'pointer'
                    }}
                    handleClick={() => handleSelection("email")}
                    >
                        <div style={{ textAlign: 'center'}}>
                        <img
                            src="https://email.uplers.com/blog/wp-content/uploads/2022/07/1-Signatures-blog.gif"
                            style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderRadius: "50px",
                            }}
                        />
                        <Typography variant="overline">
                        Choose <strong>Email</strong> Service for appointment reminder
                        </Typography>{" "}
                        <br />
                        <Typography variant="caption">
                        You will received an email notification regarding your appointment
                        </Typography>
                        </div>
                    </UncontrolledCard>
                </Grid>
                <Grid item xs={6}>
                <UncontrolledCard
            style={{
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="https://i.pinimg.com/originals/fe/c2/39/fec23921611cc3abb6db1774e284a251.gif"
                style={{
                  width: "54%",
                  height: "auto",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: "50px",
                }}
              />
              <Typography variant="overline">
                Choose <strong>SMS</strong> Service for appointment reminder
              </Typography>{" "}
              <br />
              <Typography variant="caption">
                You will received an sms notification regarding your appointment
              </Typography>
            </div>
          </UncontrolledCard>
                </Grid>
                <ControlledBackdrop 
                open={loading}
                />
                <BottomButtonGroup 
                    hideContinue
                    max_array_length={MAX_APPOINTMENT_STEPS}
                />
            </ControlledGrid>
        </>
    )
 }
