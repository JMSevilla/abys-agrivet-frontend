import HomeHeroSection from "@/components/Content/Home/HeroSection";
import React from 'react';
import { Typography, Container, Paper, Grid, Divider } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import Services from "@/components/Content/Home/Services";
import HomeFooterSection from "@/components/Content/Home/FooterSection";

const ServicesPage: React.FC = () => {
  return (
    <div>
      <HomeHeroSection showNavSection={true} disableMarginTop>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {/* Left side */}
          <div className="flex flex-col items-center" style={{ flex: 1, paddingRight: '20px' }}>
            {/* First image (logo) */}
            <img
              className="h-12 w-auto"
              src="/agrivet.png"
              alt="Your Company"
              style={{ width: "70%", height: "70%" }}
            />

            {/* Description */}
            <div className="mt-2 text-center" style={{ width: '100%' }}>
              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontFamily: 'Open Sans, sans-serif',
                  fontWeight: 900, // FontWeight set to 900
                  color: 'blue', // Indigo color 
                  width: '100%', // Set width to 100%
                  alignItems: 'center', // Align items to the center vertically
                  whiteSpace: 'nowrap',
                }}
              >
                <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
                Our Services
                <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
              </Typography>

              {/* Terms */}
              <Typography variant="body1"
                sx={{
                  color: '#808080', // Grey color
                }}>
                Providing our patients with the most complete range of services and the highest quality in veterinary care has always been our top priority at Abys Agrivet and Animal Clinic.
              </Typography>
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-center" style={{ flex: 1, paddingLeft: '20px' }}>
            {/* First image (logo) */}
            <img
              className="h-12 w-auto"
              src="https://th.bing.com/th/id/R.7bbe7761ac6c69e36933e5015ce78576?rik=I4Yjc5GECWFH2w&riu=http%3a%2f%2fanimalvisioncenterva.com%2fwp-content%2fuploads%2f2015%2f03%2fhappy-dog-and-cat-patients.png&ehk=9xgi0PZRIr9EU5FraKSlQ2oK%2bj8KHVkfeil%2fOtpuaS4%3d&risl=&pid=ImgRaw&r=0"
              alt="Your Company"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
    </HomeHeroSection>
    <Services/>
    <HomeFooterSection/>
    </div>
    
  );
};

export default ServicesPage;