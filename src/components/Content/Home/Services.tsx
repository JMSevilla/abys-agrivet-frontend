import React from 'react';
import { Typography, Grid, Icon, Container, Box } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SecurityIcon from '@mui/icons-material/Security';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import LocalHotelIcon from '@mui/icons-material/LocalHotel';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const services = [
    {
        icon: <LocalHospitalIcon fontSize="large" />,
        title: 'Comprehensive Veterinary Care',
        description: 'We provide comprehensive medical care for pets, including vaccinations, diagnostics, and surgeries.',
      },
      {
        icon: <HealingIcon fontSize="large" />,
        title: 'Specialized Rehabilitation',
        description: 'Our rehabilitation services help pets recover from injuries, surgeries, or mobility issues.',
      },
      {
        icon: <PetsIcon fontSize="large" />,
        title: 'Pet Wellness Exams',
        description: 'Regular wellness exams ensure your pet is healthy and help prevent potential health issues.',
      },
      {
        icon: <PetsIcon fontSize="large" />,
        title: 'On-Site Pharmacy',
        description: 'Convenient access to a range of medications and prescription diets for your pet.',
      },
      {
        icon: <EventNoteIcon fontSize="large" />,
        title: 'Customized Vaccination Plans',
        description: 'Tailored vaccination plans based on your pet’s lifestyle and health needs.',
      },
      {
        icon: <AddToQueueIcon fontSize="large" />,
        title: 'Appointment Scheduling',
        description: 'Easily schedule vet appointments online or over the phone for your convenience.',
      },
      {
        icon: <LocalHotelIcon fontSize="large" />,
        title: 'Pet Boarding Services',
        description: 'Safe and comfortable boarding facilities for your pet when you are away.',
      },
      {
        icon: <MedicalServicesIcon fontSize="large" />,
        title: '24/7 Emergency Veterinary Care',
        description: 'We offer 24/7 emergency vet services for urgent medical situations.',
      },  
    ];

    const VetClinicServices = () => {
        const iconColor = 'primary'; // 'primary' represents the theme's primary color, which is typically blue
      
        const containerStyle = {
            background: 'linear-gradient(to right, rgba(200, 220, 255, 0.7), rgba(220, 235, 255, 0.7))', // Adjust rgba values and alpha channel
            padding: '20px',
            borderRadius: '80px',
        }

        return (
            <div>
          <Container style={containerStyle}>
            <Grid container spacing={3} justifyContent="center">
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} style={{ textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="50px">
                    {React.cloneElement(service.icon, { color: iconColor, fontSize: 'large' })}
                  </Box>
                  <Typography variant="h6" gutterBottom>{service.title}</Typography>
                  <Typography variant="body2" paragraph>{service.description}</Typography>
                </Grid>
              ))}
            </Grid>
          </Container>
          <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
          * Please contact your preferred branch for the availability of these services.
      </Typography>
          </div>
          
        );
      };
      

export default VetClinicServices;
