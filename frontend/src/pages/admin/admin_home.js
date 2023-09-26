
import DynamicTable from "../../table/DynamicTable"
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { Unstable_Grid2 as Grid } from '@mui/material';
import { OverviewTotalProfit } from "../../components/topcard";
import "../../components/loader/style.css"
import Spinner from "../../components/loader/spinner";
import ResponsiveAppBar from "../../components/navbar";
import { useAuthContext } from "../../components/hooks/useAuthContext";
import { tranurl, userurl, caturl, walurl, comurl, adminurl, url, currurl } from "../../components/url";
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { InputAdornment, OutlinedInput, Paper } from '@mui/material';
import FormDialog from '../../table/add';
import { TextField, MenuItem } from '@mui/material';
import { toast } from 'react-hot-toast'
import bcrypt from 'bcryptjs'
import { allTimezones } from "../../components/timezones";
;



function HomeAdmin() {



  const [datas, setdatas] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [catdata, setcatdata] = useState([]);
  const [waldata, setwaldata] = useState([]);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState("");
  const [comdata, setcomdata] = useState([]);
  const [curr, setcurr] = useState("");
  const [com, setcom] = useState({ company: "ALL" });

  const usercolumn = ['Transid','date', 'createdat', 'updatedat', 'description', 'category', 'type', 'amount', 'wallet', 'user', 'company'];

  const { user } = useAuthContext();
  console.log(user)
  const gettable = async () => {

    if (com['company'] === "ALL") {
      await axios.get(tranurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
        setdatas(data);
        setRows(data);
      })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      console.log("front", com)
      await axios.post(adminurl, com).then(({ data }) => {
        setdatas(data);
        setRows(data);
      })
        .catch((error) => {
          console.log(error);
        });
    }

  };

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

  useEffect(() => {

    gettable();
    getCatData();
    getWalData();
    getCompanyData();
    getUser();
  }, []);


  const handleFormChange = (event) => {
    com['company'] = event.target.value
    setcom({ ...com });
    gettable()
    getCurr()
  }
  
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
  async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }
  const updateUser = async (_id, data,url) => {
    const currentDate = new Date();
    console.log(data)
    data['updatedat'] = formatDate(currentDate, data['company']);
    data['date'] = format(data['date']);
    
    
    
    axios
      .put(
        url +
        _id,
        data, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success("Transaction successfully updated");
          //window.location.reload();
          gettable();

        } else Promise.reject();
      })
      .catch((err) => toast.error("Something went wrong"));
  };
  const deleteUser = (_id,url) => {
    console.log(_id)
    axios
      .delete(
        url + _id, { headers: { 'Authorization': 'Bearer ' + user['token'] }, })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Transaction successfully deleted");
          gettable();
          //window.location.reload();

        } else Promise.reject();
      })
      .catch((err) => toast.error("Something went wrong"));
  };
  const add = (Transaction,url) => {
  axios.post(
    url,
        Transaction,{headers: {'Authorization': 'Bearer ' + user['token']},})
        .then(res => {
            if (res.status === 200){
              toast.success('data successfully created');
            gettable();
            //window.location.reload();
            }
            else
            Promise.reject()
        })
        .catch(err => toast.error(err))
  };

  const getUser = () => {
    axios.get(userurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
      setuserdata(data[0]);
    })
      .catch((error) => {
        console.log(error);
      });

  };
  const getCatData = async () => {
    await axios.get(caturl).then(({ data }) => {
      setcatdata(data);

    })
      .catch((error) => {
        console.log(error);
      });

  };
  const getCompanyData = async () => {
    await axios.get(comurl).then(({ data }) => {
      setcomdata(data);

    })
      .catch((error) => {
        console.log(error);
      });

  };
  const getWalData = async () => {
    await axios.get(walurl).then(({ data }) => {
      setwaldata(data);

    })
      .catch((error) => {
        console.log(error);
      });

  };

  //get currency sign
  const getCurr = async () => {

    let obj = {
      name: com['company']
    }
    await axios.post(currurl, obj).then(({ data }) => {
      setcurr(data[0]['currency']);
      console.log(data)

    })
      .catch((error) => {
        console.log(error);
      });

  };

  const requestSearch = (event) => {
    setSearched(event.target.value);
    console.log("search", event.target.value)
    if (event.target.value === "") {
      setSearched("");
      setRows(datas);


    }
    else {
      const filteredRows = datas.filter((row) => {
        return row.description.includes(event.target.value);
      });
      setRows(filteredRows);
    }

    console.log("filtered", rows)
  };

  let incomeVal = 0;
  let expenseVal = 0;

  // Calculate incomeVal and expenseVal
  datas.forEach((data) => {
    if (data.type === 'income') {
      incomeVal += parseInt(data.amount, 10);
    } else if (data.type === 'expense') {
      expenseVal += parseInt(data.amount, 10);
    }

  });
  let balanceVal = incomeVal - expenseVal;


  var formattedIncomeVal = `-`;
  var formattedExpenseVal = `-`;
  var formattedBalanceVal = `-`;

  if (com['company'] !== 'ALL') {
    formattedIncomeVal = `${curr}${incomeVal}`;
    formattedExpenseVal = `${curr}${expenseVal}`;
    formattedBalanceVal = `${curr}${balanceVal}`;
  }




  if (userdata.length !== 0) {
    return (
      <><ResponsiveAppBar userdata={userdata} /><br /><Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >

        <Container maxWidth="xl">
          <Grid

            container
            spacing={2}
            justifyContent={"center"}
          >
            <Grid
              xs={4}
              sm={4}
              lg={4}
            >
              <OverviewTotalProfit
                sx={{ height: '100%' }}
                name="Income"
                value={formattedIncomeVal} />
            </Grid>

            <Grid
              xs={4}
              sm={4}
              lg={4}
            >
              <OverviewTotalProfit
                sx={{ height: '100%' }}
                name="Balance"
                value={formattedBalanceVal}
              />
            </Grid>
            <Grid
              xs={4}
              sm={4}
              lg={4}
            >
              <OverviewTotalProfit
                sx={{ height: '100%' }}
                name="Expense"
                value={formattedExpenseVal} />
            </Grid>
          </Grid>

          <br />


          <Stack direction="row"
            justifyContent="space-between"
            bgcolor={'white'}
            padding={1}
            borderRadius={1}
            spacing={1}>

            <OutlinedInput
              value={searched}
              onChange={(e) => requestSearch(e)}

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

            <TextField
              sx={{ maxWidth: 150 }}
              required
              id="outlined-select"
              variant="standard"
              select
              label="Company"

              fullWidth
              name='company'
              value={com['company']}
              onChange={(e) => handleFormChange(e)}
            >

              <MenuItem key="ALL" value='ALL'>
                ALL
              </MenuItem>
              {comdata.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>


            <FormDialog add={add} userdata={userdata} catdata={catdata} waldata={waldata} comdata={comdata} />

          </Stack>
         

<br/>


          <DynamicTable updateUser={updateUser} deleteUser={deleteUser} TableData={rows}  comdata={comdata} url={url} catdata={catdata} waldata={waldata} column={usercolumn} />
        </Container></Box><br /></>
    );

  }
  else {
    return (
      <div className="pos-center">
        <Spinner />
      </div>
    );
  }
}

export default HomeAdmin