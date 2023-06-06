import { CustomerFormAdditionalDetails } from "@/components/Forms/Customer";
import HomeHeroSection from "@/components/Content/Home/HeroSection";
import HomeFooterSection from "@/components/Content/Home/FooterSection";
import { Typography } from "@mui/material";

const CustomerAccountRegistration = () => {
  return (
    <>
      <HomeHeroSection showNavSection={true} disableMarginTop>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <img
              className="mx-auto h-12 w-auto"
              src="/agrivet.png"
              alt="Your Company"
              style={{ width: "25%", height: "auto" }}
            />
          </div>
        </div>
        <div className="text-center">
          <Typography
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            sx={{ mb: 3 }}
          >
            Customer Account Registration
          </Typography>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              change signin account
            </a>
          </p>
        </div>
        <CustomerFormAdditionalDetails />
      </HomeHeroSection>
    </>
  );
};

export default CustomerAccountRegistration;
