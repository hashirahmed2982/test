import { useCallback, useState ,useEffect} from 'react';
import axios from "axios";
import { usersurl } from '../../components/url';
import {toast} from 'react-hot-toast'
import Spinner from '../../components/loader/spinner';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import ChangePass from './changepassword';



export const AccountProfileDetails = ({user,userdata,getUser}) => {
  const [values, setValues] = useState(userdata);
 
  useEffect(() => {
    setValues(userdata);
	}, [userdata]);

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit =  () => {
    console.log("set",values);
    
    axios
	.put(
		usersurl +
		values._id,
		values,{headers: {'Authorization': 'Bearer ' + user['token']},}
	)
	.then((res) => {
		if (res.status === 200) {
      toast.success("Profile successfully updated");
      getUser();
      
		
		} else Promise.reject();
	})
	.catch((err) => toast.error("Something went wrong"));
    
    
  }
  if ((!user || !userdata)  ) {
		return (
			<div className="pos-center">
			<Spinner />
		  </div>
		  
		);
	  }

  return (
    <form
      autoComplete="off"
      noValidate
      
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  //autoFocus
                  helperText="Please specify the first name"
                  label="First name"
                  name="name"
                  onChange={handleChange}
                  required
                  //value={values['name']}
                  value={values.name ? values.name : ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                 // autoFocus
                  disabled
                  onChange={handleChange}
                  value={values.company ? values.company : ''}
                  //value={values.company}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  //autoFocus
                  onChange={handleChange}
                  
                 // value={values.username}
                 value={values.username ? values.username : ''}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                 // autoFocus
                  onChange={handleChange}
                  required
                  //value={values.email}
                  value={values.email ? values.email : ''}
                />
              </Grid>
              
              
              
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end ' }}>
        <ChangePass getUser={getUser} userdata={userdata}></ChangePass> &nbsp;
          <Button variant="contained" onClick={handleSubmit}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};