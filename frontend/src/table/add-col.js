//import TableData from "./dynamic-table/TableData";
import React, { useState, useEffect } from "react";
import axios from "axios";



function AddCol ({TableData,url}) {


    const [ready, setready] = useState(false);  
// get table column
 const column = Object.keys(TableData[0]);
 column.shift();
 column.pop();
 //const data = {};
 const [data, setdata] = useState({});

 useEffect(() => {
   //console.log("col",column);
    {column.map((input, index) => {
        data[input] = TableData[0][input];
        setdata({...data})
    })}
    
    console.log("data",data);
    setready(true);
  }, []);

  const submit = (e) => {
    
    console.log("submit",data);
    axios.post(
        url,
            data)
            .then(res => {
                if (res.status === 200)
                alert('data successfully created')
                else
                Promise.reject()
            })
            .catch(err => alert(err))
}
const handleFormChange = (index, event) => {
   data[event.target.name] = event.target.value;
   setdata({...data});
}
if(ready){
  return (
    
    <form style={{display: "flex"} } class="container">
        {column.map((input, index) => {
          return (
            <div key={index} >
              <input
                name={input}
                placeholder={input}
                value={input.name}
                onChange={event => handleFormChange(index, event)}
              />
            </div>
          )
        })}
        <button onClick={submit}>Submit</button>
      </form>
  )
    }
    else{
        return(
            'PROCESSING'
        );
    }
}
export default AddCol;