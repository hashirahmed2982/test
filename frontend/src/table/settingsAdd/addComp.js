import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, SvgIcon, MenuItem } from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import axios from "axios";
import { useAuthContext } from "../../components/hooks/useAuthContext";
import { toast } from 'react-hot-toast'
import { allTimezones } from '../../components/timezones'

export default function AddComp({ add,url }) {
    const [open, setOpen] = React.useState(false);
    const { user } = useAuthContext();
    const [userInfo, setUserInfo] = React.useState({
        id: '',
        name: '',
        currency: '',
        compid: '',
        timezone: ''
    });
    const initial = {
        id: '',
        name: '',
        currency: '',
        compid: '',
        timezone: ''
    };

    // console.log(allTimezones)

    const handleFormChange = (event) => {

        userInfo[event.target.name] = event.target.value;
        setUserInfo({ ...userInfo });
    }

    const handleSubmit = () => {
        userInfo['id'] = generateRandomId();
        setUserInfo({ ...userInfo });
        console.log("create", userInfo);
        if (
            !userInfo.id ||
            !userInfo.name ||
            !userInfo.currency ||
            !userInfo.compid ||
            !userInfo.timezone
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        add(userInfo,url);
                    setUserInfo({ ...initial });
                    setOpen(false);
                    

    };
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
    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleClose = () => {
        setUserInfo({ ...initial });
        setOpen(false);
    };
    return (
        <div>
            <Button sx={{ marginBottom: '6px' }} onClick={handleClickOpen}

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
                <DialogTitle>Add Company</DialogTitle>
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
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            name='name'
                            value={userInfo.name}
                            onChange={(e) => handleFormChange(e)}
                        />
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="compid"
                            label="Company ID"
                            type="text"
                            fullWidth
                            variant="standard"
                            name='compid'
                            value={userInfo.compid}
                            onChange={(e) => handleFormChange(e)}
                        />
                        <TextField
                            required
                            id="outlined-select-currency"
                            variant="standard"
                            select
                            label="Currency"
                            fullWidth
                            helperText="Please select company's currency"
                            name='currency'
                            value={userInfo.currency}
                            onChange={(e) => handleFormChange(e)}
                        >
                            <MenuItem key="currency" value="$">
                                $
                            </MenuItem>
                            <MenuItem key="currency" value="£">
                                £
                            </MenuItem>
                            <MenuItem key="currency" value="€">
                                €
                            </MenuItem>
                            <MenuItem key="currency" value="₺">
                                ₺
                            </MenuItem>

                        </TextField>
                        <TextField
                            required
                            id="outlined-select"
                            variant="standard"
                            select
                            label="Timezone"
                            fullWidth
                            helperText="Please select the Timezone of the Company"
                            name='timezone'
                            value={userInfo.timezone}
                            onChange={(e) => handleFormChange(e)}
                        >
                            {allTimezones.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name} {option.offset}
                                </MenuItem>
                            ))}
                        </TextField>
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