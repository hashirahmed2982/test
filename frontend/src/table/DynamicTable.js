import axios from "axios";
import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import TableContainer from '@mui/material/TableContainer';
import { useAuthContext } from "../components/hooks/useAuthContext";
import { toast } from 'react-hot-toast'
import { allTimezones } from '../components/timezones'
import bcrypt from 'bcryptjs'
import {

  Box,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
  Paper
} from '@mui/material';


function DynamicTable({isLoading, TableData, url, catdata, waldata, comdata, column, height, deleteUser, updateUser }) {
  const { user } = useAuthContext();
  //dynamic object to store edit variable values
  TableData = TableData.slice().reverse();
  var [obj, setobj] = useState(TableData);
  useEffect(() => {
    setobj(TableData);
  }, [isLoading]);

  const initial = TableData;


  const handleCancel = () => {
    setobj(initial);
    setedit(null);
    console.log("cancel", initial);
  }

  //sets edit instance
  const [edit, setedit] = useState(null);

  // get table column names

  // get table heading data
  const ThData = () => {

    return column.map((data, index) => {
      if (index == 0) { return <><TableCell key="INDEX">INDEX</TableCell><TableCell key={data}>{data.toUpperCase()}</TableCell></> } else {
        return <TableCell key={data}>{data.toUpperCase()}</TableCell>
      }
    }
    )
  }

  //handle delete function


  //handle on change field values
  const handleFormChange = (event, index) => {
    obj[index][event.target.name] = event.target.value;
    setobj({ ...obj })
    console.log("changed", obj)


  }
  async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }
  const handlePassChange = async (event, index) => {
    obj[index][event.target.name] = await hashPassword(event.target.value);
    setobj({ ...obj })

  }



  //sends post api to url in order to update
  const handleupdate = async (_id, data,url) => {
    updateUser(_id, data,url);

    setedit(false);

  };

  // get table row datas
  const tdData = () => {
    
    return TableData.map((data, index) => {
      return (
        <TableRow hover>
          <TableCell key="INDEX"> {index}</TableCell>
          {
            column.map((v) => {
              return <TableCell sx={{ minWidth: 100 }}>
                {edit === index ? (
                  console.log(data),
                  v === 'type' ? ( // Check if the field is 'type'
                    <Select
                      variant="standard"
                      name={v}
                      placeholder={data[v]}
                      value={obj[index][v]} // Use the state variable for edited type
                      onChange={(event) => handleFormChange(event, index)}
                    >
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                  ) : (
                    v === 'category' ? (
                      <Select
                        variant="standard"

                        name={v}
                        placeholder={data[v]}
                        value={obj[index][v]} // Use the state variable for edited type
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        {catdata.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : v === 'updatedat' || v === 'createdat' ? (<TextField
                      name={v}
                      placeholder={data[v]}
                      value={obj[index][v]}
                      onChange={(event) => handleFormChange(event, index)}
                      variant="standard"
                      disabled
                    />) : v === 'Transid' || v === 'id' || v === 'catid' || v === 'wallid' ? (<TextField
                      name={v}
                      placeholder={data[v]}
                      value={obj[index][v]}
                      disabled
                      variant="standard"
                    />) : v === 'wallet' ? (<Select
                      variant="standard"

                      name={v}
                      placeholder={data[v]}
                      value={obj[index][v]} // Use the state variable for edited type
                      onChange={(event) => handleFormChange(event, index)}
                    >
                      {waldata.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>) : v === 'company' ? (<Select
                      variant="standard"

                      name={v}
                      placeholder={data[v]}
                      value={obj[index][v]} // Use the state variable for edited type
                      onChange={(event) => handleFormChange(event, index)}
                    >
                      {comdata.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>) : v === 'role' ? (<Select
                      variant="standard"

                      name={v}
                      placeholder={data[v]}
                      value={obj[index][v]} // Use the state variable for edited type
                      onChange={(event) => handleFormChange(event, index)}
                    >

                      <MenuItem key={"admin"} value={"admin"}>
                        Admin
                      </MenuItem>
                      <MenuItem key={"user"} value={"user"}>
                        User
                      </MenuItem>

                    </Select>) :
                      v === 'password' ? (
                        <TextField
                          name={v}
                          id="standard-password-input"
                          type="password"
                          autoComplete="current-password"
                          variant="standard"
                          // value={obj[index][v]}
                          onChange={(event) => handlePassChange(event, index)}
                        />
                      ) : v === 'date' ? (
                        <TextField
                          autoFocus
                          id="date"
                          type="datetime-local"
                          variant="standard"
                          name={v}
                          value={obj[index][v]}
                          onChange={(event) => handleFormChange(event, index)}
                        />
                      ) : v === 'timezone' ? (<Select
                        variant="standard"

                        name={v}
                        placeholder={data[v]}
                        value={obj[index][v]} // Use the state variable for edited type
                        onChange={(event) => handleFormChange(event, index)}
                      >

                        {allTimezones.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name} {option.offset}
                          </MenuItem>
                        ))}

                      </Select>) : (
                        <TextField
                          name={v}
                          placeholder={data[v]}
                          value={obj[index][v]}
                          onChange={(event) => handleFormChange(event, index)}

                          variant="standard"
                        />
                      )
                  )
                ) :

                  v === 'password' ? (

                    "*****"

                  )
                    :
                    data[v]
                }
              </TableCell>
            })
          }
          {
            edit !== index ? <TableCell sx={{ whiteSpace: 'nowrap' }}>
              <IconButton size="small" onClick={() => setedit(index)} >
                <EditIcon sx={{ "&:hover": { color: "green" } }} fontSize="small" />
              </IconButton>
              &nbsp;

              <IconButton aria-label="delete" size="small" onClick={() => deleteUser(data._id, url)}>
                <DeleteIcon sx={{ "&:hover": { color: "red" } }} fontSize="small" />
              </IconButton>

            </TableCell> : <><TableCell sx={{ whiteSpace: 'nowrap' }}>
              <IconButton size="small" onClick={() => handleCancel()}>
                <CancelIcon sx={{ "&:hover": { color: "red" } }} fontSize="small" />
              </IconButton>
              &nbsp;
              <IconButton size="small" onClick={() => handleupdate(data._id, obj[index] , url)}>
                <CheckIcon sx={{ "&:hover": { color: "green" } }} fontSize="small" />
              </IconButton>
            </TableCell></>
          }


        </TableRow>
      )
    })
  }


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (height) {
    return (
      <><Paper sx={{ width: '100%', overflow: 'hidden' }}>

        <TableContainer sx={{ maxHeight: height }}>
          {/* <TableContainer> */}

          <Box sx={{ minWidth: 200 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow    >
                  {ThData()}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {tdData()}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      </Paper></>
    )
  } else {
    return (
      <><Paper sx={{ width: '100%', overflow: 'hidden' }}>

        {/* <TableContainer sx={{ maxHeight: height }}> */}
        <TableContainer>

          <Box sx={{ minWidth: 200 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow    >
                  {ThData()}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {tdData()}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      </Paper></>
    )

  }
}
export default DynamicTable;