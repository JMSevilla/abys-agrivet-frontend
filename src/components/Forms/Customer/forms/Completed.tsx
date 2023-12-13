import { Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { NormalButton } from "@/components/Button/NormalButton";

export const Completed = () => {
  const router = useRouter();

  const handleProceedToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Typography variant="h5" mb="2">
        Completed
      </Typography>
      <Grid item xs={12} display="flex" justifyContent="center">
        <NormalButton
          sx={{ mx: "auto", mt: 2, width: [, 300] }}
          color="primary"
          variant="outlined"
          fullWidth
          onClick={handleProceedToLogin}
        >
          PROCEED TO LOGIN
        </NormalButton>
      </Grid>
    </>
  );
};
