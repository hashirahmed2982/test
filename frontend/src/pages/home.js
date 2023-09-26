import DynamicTable from "../table/DynamicTable";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { InputAdornment, OutlinedInput, Paper, SvgIcon, Button, Stack } from '@mui/material';
import FormDialog from '../table/add';
import "../components/loader/style.css"
import Spinner from "../components/loader/spinner";
import { toast } from 'react-hot-toast'
import { allTimezones } from "../components/timezones";
import {
  Box,
  Container
} from "@mui/material";
import { Unstable_Grid2 as Grid } from "@mui/material";
import { OverviewTotalProfit } from "../components/topcard";
import ResponsiveAppBar from "../components/navbar";
import { useAuthContext } from "../components/hooks/useAuthContext";
import { url, userurl, caturl, walurl, comurl, currurl } from "../components/url";
import bcrypt from 'bcryptjs'

function Home({ userdata }) {
  const [datas, setdatas] = useState([]);
  //const [userdata, setuserdata] = useState([]);
  const [catdata, setcatdata] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [waldata, setwaldata] = useState([]);
  const [comdata, setcomdata] = useState([]);
  const [ready, setready] = useState(false);
  const [curr, setcurr] = useState("");
  const [rows, setRows] = useState([]);
  const [stat, setstat] = useState("initial");

  const [searched, setSearched] = useState("");
  const usercolumn = [
    "Transid",
    "date",
    "createdat",
    "updatedat",
    "description",
    "category",
    "type",
    "amount",
    "wallet",
  ];

  const { user } = useAuthContext();
  // console.log(user);
  const gettable = async () => {
    await axios.get(url, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
      setRows(data);
      setdatas(data);
      
      setisLoading(false);
    })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (user) {
      gettable();
      getCatData();
      getWalData();
      getComData();
      //getUser();


      getCurr();
    }
  }, [user, curr]);

  const deleteUser = (_id, url) => {
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
  const updateUser = async (_id, data, url) => {
    const currentDate = new Date();
    console.log(data)
    data['updatedat'] = formatDate(currentDate, data['company']);



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
  const getUser = async () => {
    await axios
      .get(userurl, { headers: { Authorization: "Bearer " + user["token"] } })
      .then(({ data }) => {
        // setuserdata(data[0]);
        setready(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCurr = () => {

    let obj = {
      name: userdata['company']
    }
    axios.post(currurl, obj).then(({ data }) => {
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

  const getCatData = async () => {
    await axios
      .get(caturl)
      .then(({ data }) => {
        setcatdata(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getWalData = async () => {
    await axios
      .get(walurl)
      .then(({ data }) => {
        setwaldata(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getComData = async () => {
    await axios
      .get(comurl)
      .then(({ data }) => {
        setcomdata(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { incomeVal, expenseVal, balanceVal } = useMemo(() => {
    let incomeVal = 0;
    let expenseVal = 0;

    datas.forEach((data) => {
      if (data.type === "income") {
        incomeVal += parseInt(data.amount, 10);
      } else if (data.type === "expense") {
        expenseVal += parseInt(data.amount, 10);
      }
    });

    const balanceVal = incomeVal - expenseVal;

    return { incomeVal, expenseVal, balanceVal };
  }, [datas]);

  const formattedIncomeVal = `${curr}${incomeVal}`;
  const formattedExpenseVal = `${curr}${expenseVal}`;
  const formattedBalanceVal = `${curr}${balanceVal}`;

  if (userdata.length !== 0) {
    return (
      <>
        <ResponsiveAppBar userdata={userdata} />
        <br />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={2} justifyContent={"center"}>
              <Grid xs={4} sm={4} lg={4}>
                <OverviewTotalProfit
                  sx={{ height: "100%" }}
                  name="Income"
                  value={formattedIncomeVal}
                />
              </Grid>

              <Grid xs={4} sm={4} lg={4}>
                <OverviewTotalProfit
                  sx={{ height: "100%" }}
                  name="Balance"
                  value={formattedBalanceVal}
                />
              </Grid>
              <Grid xs={4} sm={4} lg={4}>
                <OverviewTotalProfit
                  sx={{ height: "100%" }}
                  name="Expense"
                  value={formattedExpenseVal}
                />
              </Grid>
            </Grid>

            <br />
            <Paper>
              <Stack direction="row"
                justifyContent="space-between"
                padding={1}
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
                <Grid>
                  <FormDialog add={add} comdata={comdata} userdata={userdata} catdata={catdata} waldata={waldata} />
                </Grid>
              </Stack>
{!isLoading ? <DynamicTable
              isLoading={isLoading}
                updateUser={updateUser}
                deleteUser={deleteUser}
                TableData={rows}
                url={url}
                catdata={catdata}
                waldata={waldata}
                column={usercolumn}
              />:<div>isloading</div>}
              
            </Paper>
          </Container>
        </Box>
      </>
    );
  } else {
    return (
      <div className="pos-center">
        <Spinner />
      </div>
    );
  }
}

export default Home;
