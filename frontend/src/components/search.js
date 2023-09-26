import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Grid, InputAdornment, OutlinedInput, Paper, SvgIcon ,Button, Stack} from '@mui/material';
import FormDialog from '../table/add';

import * as React from "react";

export default function CustomersSearch ({userdata,catdata,waldata}) { 
  
  console.log("search",userdata);
  
  
  return(
  <Paper >
    <Stack direction="row"
              justifyContent="space-between"
              spacing={1}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search"
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