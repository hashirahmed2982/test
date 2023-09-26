import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Paper, SvgIcon } from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import axios from "axios";
import { useAuthContext } from "../../components/hooks/useAuthContext";
import { toast } from 'react-hot-toast'

export default function AddCat({ add,userdata, url }) {
    const [open, setOpen] = React.useState(false);
    const { user } = useAuthContext();
    const [userInfo, setUserInfo] = React.useState({
        wallid: '',
        name: ''
    });
    const initial = {
        wallid: '',
        name: ''
    };

    const handleFormChange = (event) => {

        userInfo[event.target.name] = event.target.value;
        setUserInfo({ ...userInfo });
    }

    const handleSubmit = () => {
        userInfo['wallid'] = generateRandomId();
        setUserInfo({ ...userInfo });
        console.log("create", userInfo);
        if (
            !userInfo.name ||
            !userInfo.wallid
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        add(userInfo,url);
                    setUserInfo({ ...initial });
                    setOpen(false);
                   

    };

    const handleClickOpen = () => {
        setOpen(true);
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
                <DialogTitle>Add Wallet</DialogTitle>
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
                            name='name'
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={userInfo.name}
                            onChange={(e) => handleFormChange(e)}
                        />
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