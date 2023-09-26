import {
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
  
 
  
  export const AccountProfile = ({userdata}) => (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src="/static/images/avatar/2.jpg"
            alt={userdata['name']}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {userdata['name']}
          </Typography>
          
        </Box>
      </CardContent>
      <Divider />
      
    </Card>
  );
  