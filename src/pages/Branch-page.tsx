import HomeHeroSection from "@/components/Content/Home/HeroSection";
import React from 'react';
import { Typography, Container, Paper, Grid, Divider } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import Branch from "@/components/Content/Home/Branch";
import FooterSection from "@/components/Content/Home/FooterSection";
const BranchPage: React.FC = () => {
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
                  display: 'flex', // Use flex display to control alignment
                  alignItems: 'center', // Align items to the center vertically
                  justifyContent: 'center', // Center the title horizontally
                  whiteSpace: 'nowrap',
                }}
              >
                <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
                Our Branches
                <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
              </Typography>

              {/* Terms */}
              <Typography variant="body1"
                sx={{
                  color: '#808080', // Grey color
                }}>
                We currently have five branches conveniently located in Calamba and Batangas City, Each one equipped and ready to provide you with the highest quality in pet health care.​
              </Typography>
            </div>
          </div>

          {/* Right side */}
          <div className="ml-4" style={{ flex: 1 }}>
            {/* Second image */}
            <img
              className="h-12 w-auto"
              src="https://webstercityvet.com/wp-content/uploads/2019/02/900.jpg"
              alt="Another Image"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
    </HomeHeroSection>
    <Branch/>
    <FooterSection/>
    </div>
  );
};

export default BranchPage;