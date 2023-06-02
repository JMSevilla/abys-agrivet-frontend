import { AdministratorAccountSetupFormAdditional } from "@/components/Forms/AccountSetup/AccountSetup";
import HomeHeroSection from '@/components/Content/Home/HeroSection'
import HomeFooterSection from '@/components/Content/Home/FooterSection'
import { Typography } from "@mui/material";
const AdminAccountSetup = () => {
    return (
        <>
            <HomeHeroSection showNavSection={false}>
            
            <div className="text-center">
              <Typography className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl" sx={{mb: 3}}>
                Application Account Setup
              </Typography>
              
            </div>
            <AdministratorAccountSetupFormAdditional />
            </HomeHeroSection>
            <HomeFooterSection />
        </>
    )
}

export default AdminAccountSetup