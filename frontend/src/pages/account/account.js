import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';

import { AccountProfile } from './account-profile';
import { AccountProfileDetails } from './account-profile-details';
import React, { useState, useEffect } from "react";
import ResponsiveAppBar from '../../components/navbar';
import { userurl } from '../../components/url';
import axios from "axios";
import Spinner from '../../components/loader/spinner';

const Account = ({user}) => {
  const [userdata, setuserdata] = useState([]);
  useEffect(() => {
    getUser();
}, []);

const getUser = async () => {
  if (user) {
    await axios.get(userurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
      setuserdata(data[0]);
      // console.log("changed ", userdata)
    })
      .catch((error) => {
        console.log(error);
      });
  }
};
if ((!user || !userdata)  ) {
  return (
    <div className="pos-center">
    <Spinner />
    </div>
    
  );
  }


  return(
  <>
     <ResponsiveAppBar userdata={userdata} />
        <br />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              My Profile
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile userdata={userdata}/>
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <AccountProfileDetails getUser={getUser} userdata={userdata} user={user}/>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);
    }


export default Account;