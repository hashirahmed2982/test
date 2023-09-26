import * as React from 'react';
import Button from '@mui/material/Button';
import { useCallback ,useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box} from '@mui/material';
import axios from "axios";
import { useAuthContext } from "../../components/hooks/useAuthContext";
import {toast} from 'react-hot-toast'
import { usersurl } from '../../components/url';
import bcrypt from 'bcryptjs'

export default function ChangePass({userdata,getUser}) {
  const [open, setOpen] = React.useState(false);
 
  const {user} = useAuthContext(); 
  const [data, setdata] = React.useState(userdata)
  const [newpass, setnewpass] = React.useState({currpass:'' , newpass:'' , confirmpass:''})

  useEffect(() => {
    setdata(userdata);
	}, [userdata]);
 
    
  const handleChange = useCallback(
    (event) => {
      setnewpass((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );
  async function verifyPassword(plaintextPassword, hashedPassword) {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  }
  async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }
 const handleSubmit = async () => {
    
  if (
    !newpass.currpass ||
    !newpass.newpass ||
    !newpass.confirmpass 
  ) {
    toast.error('Please fill in all required fields');
    return;
  }
  if (!( await verifyPassword(newpass.currpass , data.password))
   // data.password !== newpass.currpass 
  ) {
    toast.error('Please type correct current password');
    return;
  }
  if (
    newpass.newpass !==
    newpass.confirmpass  
  ) {
    toast.error('passwords dont match');
    return;
  }else{
    data.password = await hashPassword(newpass.newpass);
  }
 
  axios
	.put(
		usersurl +
		data._id,
		data,{headers: {'Authorization': 'Bearer ' + user['token']},}
	)
	.then((res) => {
		if (res.status === 200) {
      toast.success("Password successfully changed");
      setnewpass({currpass:'' , newpass:'' , confirmpass:''})
      getUser()
      //window.location.reload();
		handleClose();
		} else Promise.reject();
	})
	.catch((err) => toast.error("Something went wrong"));
    
    
  
  
};

  const handleClickOpen = () => {
    setOpen(true);
  };
  

  const handleClose = () => {
  
    setOpen(false);
  };
  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
            Change Password
          </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All fields are required.
          </DialogContentText>
          <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
          <TextField
          required
            autoFocus
            margin="dense"
            id="curr"
            name='currpass'
            label="Current Password"
            type="text"
            fullWidth
            variant="standard"
            value={newpass.currpass}
          onChange={(e) => handleChange(e)}
          />
          <TextField
          required
            autoFocus
            margin="dense"
            id="newpass"
            label="New Password"
            type="text"
            fullWidth
            variant="standard"
            name='newpass'
            value={newpass.newpass}
            onChange={(e) => handleChange(e)}
          />
          <TextField
          autoFocus
          margin="dense"
          required
          id="confirmpass"
          variant="standard"
          
          label="Confirm password"
          fullWidth
          name='confirmpass'
            value={newpass.confirmpass}
            onChange={(e) => handleChange(e)}
        />
           
          
        

        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}