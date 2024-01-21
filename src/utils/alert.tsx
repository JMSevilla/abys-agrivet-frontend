import { Alert, AlertTitle } from "@mui/material";

type AlertPlacementProps = {
  severity: any;
  title: string;
  description: string;
};

export const AlertMessagePlacement = ({
  severity,
  title = "Attention needed",
  description,
}: AlertPlacementProps) => {
  return (
    <>
      <Alert severity={severity}>
        <AlertTitle>{title}</AlertTitle>
        {description}
      </Alert>
    </>
  );
};
