import React from 'react';
import { Typography, Container, Paper, Grid, Divider, Avatar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


interface BranchInfo {
  branchName: string;
  location: string;
  contact: string;
  clinicHours: string;
  image: string; // Add the image property
}

const branches: BranchInfo[] = [
    {
        branchName: 'Halang Branch',
        location: 'National Highway, Halang, Calamba',
        contact: 'Phone: (049) 123-4567, 0922-874-6959',
        clinicHours: 'Mon-Sat: 7 AM - 5 PM, Sun: 6 AM - 4 PM',
        image: 'https://scontent.fmnl30-1.fna.fbcdn.net/v/t1.18169-9/12240151_676593549150157_2248540646731078246_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd63ad&_nc_eui2=AeFS3p7yuj9f0hCX5uI96V0gJSt7C2bLBY8lK3sLZssFj3CQpGQZkUqGysfvbRB8Vu2CELmAQ5wc99EMJLNtONO0&_nc_ohc=105LyE4vyLUAX92f8nz&_nc_ht=scontent.fmnl30-1.fna&oh=00_AfCMS4R0x6kXOdWnLy3OQXkK7WzueHr9SFMuVWYncNV2Kg&oe=659EADFE', // Specify the image URL for each branch
      },
      {
        branchName: 'Palo Alto Branch',
        location: '456 West Avenue, Townsville',
        contact: 'Phone: (555) 987-6543',
        clinicHours: 'Mon-Sat: 6 AM - 6 PM, Sun: 6 AM - 4 PM',
        image: 'https://scontent.fmnl30-3.fna.fbcdn.net/v/t1.15752-9/403604172_3334266220052960_491063908114174671_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeHg4UMoCSB-7rNQEYcfOnfb2K2zkESPgSfYrbOQRI-BJxIu2qcS2GVKf3u8N405VFLgE6fNNFP_CkMB-bqaaNmB&_nc_ohc=f8SsMhGmoQkAX8bD0mk&_nc_ht=scontent.fmnl30-3.fna&oh=03_AdRJbJdh9iZC_G-9DMscCy-52PJbknJGPLhNmrFTDPBorw&oe=659EAA8B',
      },
      {
        branchName: 'Tambo Branch',
        location: 'Purok 3, Brgy. Tambo, Lipa City',
        contact: 'Phone: (043) 784-2709, 0922-874-6960',
        clinicHours: 'Mon-Sun: 24/7',
        image: 'https://scontent.fmnl30-2.fna.fbcdn.net/v/t1.15752-9/370267320_897532011701368_4303252367156295173_n.png?_nc_cat=111&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGstp3iMI1RWyLAGh1cXd9VLD0az5I7xfosPRrPkjvF-oUMr_VAsJo6_eF1FW6ZHF6rCpdu8IpZhBxILMudkox-&_nc_ohc=RIhpUoXszoQAX-2JjUF&_nc_ht=scontent.fmnl30-2.fna&oh=03_AdQre0kcpVroKHbLe-Gsp_2LH9osN8JlvSLpYfDww5wWXA&oe=659E865C',
      },
      {
        branchName: 'Sabang Branch',
        location: '456 West Avenue, Townsville',
        contact: 'Phone: (555) 987-6543',
        clinicHours: 'Mon-Sat: 8 AM - 5 PM, Sun: 8 AM - 4 PM',
        image: 'https://scontent.fmnl30-3.fna.fbcdn.net/v/t1.15752-9/385520743_671506958467922_3650641500996361112_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGaCKA2Z9y67PL-_9LnVJ8WNZiB7Uo2DIc1mIHtSjYMh1W7uG7HekUtKnGtt2Z5q2-evrpGKxcosr7uhG-Tg6Ni&_nc_ohc=K-eEaZlf9QYAX_dqWX8&_nc_ht=scontent.fmnl30-3.fna&oh=03_AdSrheBV-ZpfyYKKb4wgZxPmlRXPc1OAR5VMsoX6Y7Xqgg&oe=659E8BC1',
      },
      {
        branchName: 'Batangas Branch',
        location: '456 West Avenue, Townsville',
        contact: 'Phone: (555) 987-6543',
        clinicHours: 'Mon-Sat: 8 AM - 5 PM, Sun: 8 AM - 4 PM',
        image: 'https://scontent.fmnl30-3.fna.fbcdn.net/v/t1.15752-9/385520743_671506958467922_3650641500996361112_n.png?_nc_cat=105&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGaCKA2Z9y67PL-_9LnVJ8WNZiB7Uo2DIc1mIHtSjYMh1W7uG7HekUtKnGtt2Z5q2-evrpGKxcosr7uhG-Tg6Ni&_nc_ohc=K-eEaZlf9QYAX_dqWX8&_nc_ht=scontent.fmnl30-3.fna&oh=03_AdSrheBV-ZpfyYKKb4wgZxPmlRXPc1OAR5VMsoX6Y7Xqgg&oe=659E8BC1',
      },
      // Add more branches as needed
    ];
    const AboutPage: React.FC = () => {
      return (
        <Container sx={{ mt: 4, backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
          {branches.map((branch, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <div>
                  <Typography variant="h5" sx={{ mb: 1, fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: 'blue' }}>
  {branch.branchName}
</Typography>
                    <Typography>
                      <LocationOnIcon sx={{ mr: 1, color: 'blue' }} />
                      {branch.location}
                    </Typography>
                    <Typography>
                      <PhoneIcon sx={{ mr: 1, color: 'blue' }} />
                      {branch.contact}
                    </Typography>
                    <Typography>
                      <AccessTimeIcon sx={{ mr: 1, color: 'blue' }} />
                      {branch.clinicHours}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <img
                    src={branch.image}
                    alt={`${branch.branchName} Image`}
                    style={{ width: '70%', height: '70%', borderRadius: '8px' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Container>
      );
    };
    
export default AboutPage;