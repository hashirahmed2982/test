import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Grid, InputAdornment, OutlinedInput, Paper, SvgIcon ,Button, Stack} from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon'
import FormDialog from '../table/add';

import * as React from "react";

export default function AdminRow ({userdata,catdata,waldata}) { 
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log("search",userdata);
  
  
  return(
  <Paper >
    <Stack direction="row"
              justifyContent="space-between"
              spacing={1}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search "
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 500 }}
    />
    
    <Grid>
    <FormDialog userdata={userdata} catdata={catdata} waldata={waldata}/>
                </Grid>
                </Stack>
                
  </Paper>
);
                  }