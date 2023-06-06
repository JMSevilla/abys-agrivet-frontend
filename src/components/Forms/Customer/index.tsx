import { Box } from "@mui/material";
import { useActiveSteps } from "@/utils/hooks/useActiveStep";
import { OnboardingStepper } from "@/components/Stepper/Stepper";
import { CustomerAccountFormAdditional } from "./forms/CustomerForm";
import { ChooseVerificationType } from "./forms/CustomerVerificationPick";
import { VerificationForm } from "./forms/CustomerVerificationEntry";
import { Completed } from "./forms/Completed";
const CUSTOMER_MAP: Array<{
  label: string;
  form: React.FC;
}> = [
  {
    label: "CustomerBasicInformation",
    form: CustomerAccountFormAdditional,
  },
  {
    label: "Choose Verification Type",
    form: ChooseVerificationType,
  },
  {
    label: "Verification Form",
    form: VerificationForm,
  },
  {
    label: "Completed",
    form: Completed,
  },
];

export const MAX_CUSTOMER_STEPS = CUSTOMER_MAP.length;

export const CustomerFormAdditionalDetails = () => {
  const { activeStep } = useActiveSteps(MAX_CUSTOMER_STEPS);
  const { form: ActiveForm } = CUSTOMER_MAP[activeStep];

  return (
    <>
      <OnboardingStepper
        sx={{ mt: 3 }}
        activeStep={activeStep}
        steps={[
          "Customer Details & Credentials",
          "Choose Verification Type",
          "Account Verification",
          "Completed",
        ]}
      />
      <Box mt={2} width="100%">
        <ActiveForm />
      </Box>
    </>
  );
};
