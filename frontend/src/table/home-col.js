//import TableData from "./dynamic-table/TableData";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import {toast} from 'react-hot-toast'




function HomeCol ({TableData,url,userdata,catdata}) {

  const [ready, setready] = useState(false);  
  const [option, setoption] = useState("User");  
  const [data, setdata] = useState({});
  const usernames = getAllNames(userdata); 
  const catnames = getAllNames(catdata); 
  // get table column
  const column = Object.keys(TableData[0]);
  column.shift();
  column.splice(column.indexOf('date'), 1);
  column.pop();
 
  useEffect(() => {
   //console.log("col",column);
   const initialData = {};
   column.forEach((input) => {
     initialData[input] = TableData[0][input];
   });
   setdata(initialData);
    
    console.log("data",data);
    setready(true);
  }, []);

const submit = (e) => {
    axios.post(
        url,
            data)
            .then(res => {
                if (res.status === 200){
                  toast.success("Data Created Successfully");
                refresh();
                }
                else
                Promise.reject()
            })
            .catch(err => toast.error(err))
}
const refresh = () => window.location.reload(true)
const handleFormChange = (index, event) => {
   data[event.target.name] = event.target.value;
   setdata({...data});
}
const handleChange = (index, event) => {
  setoption(event.target.value);
  data[event.target.name] = event.target.value;
  setdata({...data});
}
function getAllNames(data) {
  return data.map((item) => item.name);
}
if(ready){
  return (
    
    <form style={{ display: "flex" }} className="container">
    {column.map((input, index) => (
      <div key={index}>
        {input === "user" ? (
          
              <select
              name={input}
              placeholder={option}
              onChange={(event) => handleChange(input, event)}
            >
              <option value="" disabled selected>User</option>
              {usernames.map((username, idx) => (
                <option key={idx} value={username} >
                  {username}
                </option>
              ))}
            </select>
            )  : input === "category" ? (
              <select
              name={input}
              placeholder={option}
              onChange={(event) => handleChange(input, event)}
            >
              <option value="" disabled selected>Category</option>
              {catnames.map((catname, idx) => (
                <option key={idx} value={catname} >
                  {catname}
                </option>
              ))}
            </select>
        ): (<input
          name={input}
          placeholder={input}
          value={input.name}
          onChange={(event) => handleFormChange(input, event)}
        />)
        }
      </div>
    ))}
    <button type="button" onClick={submit}>
      Submit
    </button>
  </form>
  )
    }
    else{
        return(
            'PROCESSING'
        );
    }
}
export default HomeCol;