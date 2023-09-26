import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Select, MenuItem, InputLabel,Box,Paper, SvgIcon , Stack} from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import axios from "axios";
import { useAuthContext } from "../components/hooks/useAuthContext";
import {toast} from 'react-hot-toast'
import { url } from '../components/url';
import { allTimezones } from '../components/timezones'

export default function FormDialog({add ,userdata,catdata,waldata,comdata}) {
  const [open, setOpen] = React.useState(false);
  const [pass, setpass] = React.useState(false);
  const {user} = useAuthContext(); 
  const [Transaction, setTransaction] = React.useState({
    Transid: '',
    date: '',
    createdat: '',
    updatedat: '',
    description: '',
    type: '',
    category: '',
    user: '',
    amount: '',
    wallet: '',
    user_id: '',
    company: ''
  });
  const initial = {
    Transid: '',
    date: '',
    createdat: '',
    updatedat: '',
    description: '',
    type: '',
    category: '',
    user: '',
    amount: '',
    wallet: '',
    user_id: '',
    company: ''
  };

  
  function getOffset(timezoneName) {
    // Find the timezone object with the matching name
    const currtimezone = allTimezones.find((tz) => tz.name === timezoneName);


    return offsetStringToInt(currtimezone.offset);
  }

  function offsetStringToInt(offset) {
    // Use regular expression to extract the sign and hours from the offset string
    const matches = offset.match(/GMT([-+])(\d{2}):(\d{2})/);
  
    if (!matches) {
      throw new Error('Invalid offset format');
    }
  
    const sign = matches[1] === '-' ? -1 : 1;
    const hours = parseInt(matches[2]);
  
    // Convert the offset to an integer, taking the sign into account
    const offsetInt = sign * hours;
  
    return offsetInt;
  }
  
  function addHours(date, hours) {
    date.setHours(date.getHours() + hours);
  
    return date;
  }
  function formatDate(date, comp) {

  
    // console.log(comdata.find((obj) => obj.name === comp).timezone)

    var tzOffset = getOffset(comdata.find((obj) => obj.name === comp).timezone)

    console.log(tzOffset)
    const newdate = addHours(date, tzOffset);
    console.log(date)
    
    // newdate = manipulateDateByOffset(date, tzOffset);

    const year = newdate.getUTCFullYear().toString().slice(-2);
    const month = String(newdate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(newdate.getUTCDate()).padStart(2, '0');
    const hours = String(newdate.getUTCHours()).padStart(2, '0');
    const minutes = String(newdate.getUTCMinutes()).padStart(2, '0');
    
    return `${month}-${day}-${year} ${hours}:${minutes}`;
  }
    
  const handleFormChange = (event) => {
   
    Transaction[event.target.name] = event.target.value;
    setTransaction({...Transaction});
 }
 function generateRandomId() {
  const length = 8;
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}
const format = (isoDateTime) =>{
  const dateObj = new Date(isoDateTime);

// Extract individual date and time components
const year = dateObj.getFullYear().toString().substr(-2);
const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so add 1
const day = dateObj.getDate().toString().padStart(2, '0');
const hours = dateObj.getHours().toString().padStart(2, '0');
const minutes = dateObj.getMinutes().toString().padStart(2, '0');

// Format the date and time in the desired format
 return `${month}-${day}-${year} ${hours}:${minutes}`;
}
 const handleSubmit = () => {
  const currentDate = new Date();
  console.log(currentDate)
  Transaction['Transid'] = generateRandomId();
  Transaction['user_id'] = userdata['_id'];
  Transaction['user'] = userdata['name'];

  if(userdata['role'] !== 'admin'){
    Transaction['company'] = userdata['company'];
  }
  
  console.log(Transaction['company'])
  

  // Transaction['createdat'] = currentDate;

  setTransaction({...Transaction});
  console.log("create",Transaction);
  console.log(userdata);
  if (
    !Transaction.date ||
    !Transaction.type ||
    !Transaction.category ||
    !Transaction.description ||
    !Transaction.amount ||
    !Transaction.wallet ||
    !Transaction.company
  ) {
    toast.error('Please fill in all required fields');
    return;
  }
  Transaction['createdat'] = formatDate(currentDate, Transaction['company']);
  Transaction['updatedat'] = Transaction['createdat'];
  Transaction['date'] = format(Transaction['date']);
  add(Transaction,url);
  setTransaction({...initial});
            setOpen(false);
};

  const handleClickOpen = () => {
    setOpen(true);
  };
  

  const handleClose = () => {
    setTransaction({...initial});
    setOpen(false);
  };
  return (
    <div>
      <Button sx={{ height:'53px', borderRadius: '10px' } } onClick={handleClickOpen} 
                
                startIcon={(
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                )}
                variant="contained"
              >
                Add
              </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
        <DialogTitle>Add Transaction</DialogTitle>
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
            id="date"
            label="  "
            type="datetime-local"
            fullWidth
            variant="standard"
            name='date'
            value={Transaction.date}
            onChange={(e) => handleFormChange(e)}
          />
          <TextField
          required
          id="outlined-select-currency"
          variant="standard"
          select
          label="Type"
          fullWidth
          helperText="Please select your type"
          name='type'
            value={Transaction.type}
            onChange={(e) => handleFormChange(e)}
        >
            <MenuItem key="type" value="income">
                  income
            </MenuItem>
            <MenuItem key="type" value="expense">
                  expense
            </MenuItem>
          
        </TextField>
        
          <TextField
          required
          id="outlined-select"
          variant="standard"
          select
          label="Category"
          fullWidth
          helperText="Please select your category"
          name='category'
            value={Transaction.category}
            onChange={(e) => handleFormChange(e)}
        >
          {catdata.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
          <TextField
          required
            autoFocus
            margin="dense"
            id="Description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            name='description'
            value={Transaction.description}
            onChange={(e) => handleFormChange(e)}
          />
          <TextField
          required
            autoFocus
            margin="dense"
            id="Amount"
            label="Amount"
            type="number"
            fullWidth
            variant="standard"
            name='amount'
            value={Transaction.amount}
            onChange={(e) => handleFormChange(e)}
          />
          <TextField
          required
          id="outlined-select"
          variant="standard"
          select
          label="Wallet"
          fullWidth
          helperText="Please select your wallet"
          name='wallet'
            value={Transaction.wallet}
            onChange={(e) => handleFormChange(e)}
        >
          {waldata.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        {userdata['role']==='admin'?
        <TextField
        required
        id="outlined-select"
        variant="standard"
        select
        label="Company"
        fullWidth
        helperText="Please select Company"
        name='company'
          value={Transaction.company}
          onChange={(e) => handleFormChange(e)}
      >
        {comdata.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>:<div></div>
        
      }
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}