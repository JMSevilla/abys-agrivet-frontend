import HomeHeroSection from "@/components/Content/Home/HeroSection";
import FooterSection from "@/components/Content/Home/FooterSection";
import React from 'react';
import { Typography, Container } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const AboutPage: React.FC = () => {
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
                fontWeight: 900,
                color: 'blue',
                width: '100%',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
              About Us
              <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
            </Typography>

            {/* Terms */}
            <Typography variant="body1"
              sx={{
                color: '#808080',
              }}>
              We currently have five branches conveniently located in Calamba and Batangas City, Each one equipped and ready to provide you with the highest quality in pet health care.​
            </Typography>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-4" style={{ flex: 1, paddingLeft: '20px' }}>
          {/* Second image */}
          <img
            className="h-12 w-auto"
            src="https://mypets.fidelidade.pt/hubfs/raw_assets/public/mypets_fidelidade/images/dog-doctor.png"
            alt="Another Image"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      <Container sx={{ mt: 4, backgroundColor: '#f0f0f0', padding: '60px', borderRadius: '10px', textAlign: 'center' }}>
  <div className="flex">
    {/* Left side */}
    <div className="flex flex-col items-center" style={{ flex: 1, paddingRight: '20px' }}>
      {/* Image for the left side */}
      <img
        className="h-12 w-auto"
        src="https://massvetservices.com/wp-content/uploads/2020/01/Cat-Stethoscope-650x1024.png"  // Replace with your image URL or path
        alt="Left Image"
        style={{ width: "100%", height: "100%" }}
      />
    </div>

    {/* Right side */}
    <div className="flex flex-col items-center" style={{ flex: 1, paddingLeft: '20px' }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontFamily: 'Open Sans, sans-serif',
          fontWeight: 900,
          color: 'blue',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center the title horizontally
          whiteSpace: 'nowrap',
        }}
      >
        <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
        Who We Are
        <PetsIcon sx={{ mr: 1, fontSize: 35, color: 'blue' }} />
      </Typography>

      {/* Description */}
      <Typography variant="body1" style={{ textAlign: 'left', fontFamily: 'NewFont, sans-serif' }} >
        <br />
        At Abys Agrivet and Animal Clinic, we believe that your pet is an important part of your family and therefore deserves the opportunity to live the happiest and healthiest life possible. <br/> <br />
        To provide them the finest in health care, we have carefully selected a diverse staff of exceptionally trained veterinarians, veterinary nurses and technicians, each with special interests and continuing education in companion and exotic animal medicine and surgery. Furthermore, we constantly strive to stay abreast with the latest technological advances in the field of veterinary medicine. Teamwork combined with state-of-the-art facilities allows us to provide excellent preventive pet care as well as handle even the most complicated cases, which makes us singularly unique in our profession.<br/> <br />
        And since we are all pet owners ourselves, when you bring your pets to Abys Agrivet and Animal Clinic, you can be sure that they are getting the highest level of care, dedication and compassion – the same that we give our own.
      </Typography>
    </div>
  </div>
</Container>
    </HomeHeroSection>
    <FooterSection/>
    </div>
  );
};

export default AboutPage;



