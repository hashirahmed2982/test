import PropTypes from 'prop-types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Avatar, Card, CardContent, Container, Hidden, Stack, SvgIcon, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useEffect, useState } from 'react';



export const OverviewTotalProfit = (props) => {
  const { value, sx, name } = props;

  const [size, setsize] = useState('h4') 
  let spacingValue = 1;

  const findSize = (value) => {
    let len = value.length;

    if (len > 9) {
      setsize('h6');
      spacingValue = 3;

    } 
    else if (len > 8) {
      setsize('h5');
      spacingValue = 2;
    } 
    
    else {
      setsize('h4');
    }
  };

  useEffect(() => {
		findSize(value);
	}, [value]);
  

  return (
    <Card sx={sx}>
      <CardContent >
        <Stack
          // alignItems="center"
          justifyContent="space-between"
          spacing={3}
          alignItems={{ xs: 'center', sm: 'stretch' }}

        
        >
          <Stack 
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          >
            <Hidden only="xs">
              <Typography
                color="text.secondary"
                variant="overline"
              >
                {name}
              </Typography>
            </Hidden>
            {name === "Balance" ? (
            <Avatar
              sx={{
                backgroundColor: 'darkblue',
                height: 56,
                width: 56
              }}
            >

              <AttachMoneyIcon fontSize='large' /></Avatar>

          ) : name === "Income" ? (
            <Avatar
              sx={{
                backgroundColor: 'green',
                height: 56,
                width: 56
              }}
            >
              <ArrowUpwardIcon fontSize='large' />
            </Avatar>
          ) :
            <Avatar
              sx={{
                backgroundColor: 'red',
                height: 56,
                width: 56
              }}
            >
              <ArrowDownwardIcon fontSize='large' /></Avatar>
          }
            
          </Stack>

          <Typography variant={size}>
              {value}
          </Typography>
          

        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};