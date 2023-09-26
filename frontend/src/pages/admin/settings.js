import DynamicTable from "../../table/DynamicTable";
import ResponsiveAppBar from "../../components/navbar";
import { Box, Container } from '@mui/material';
import React, { useState, useEffect } from "react";
import AddCol from '../../table/add-col'
import axios from "axios";
import './settings.css';
import AddUser from "../../table/settingsAdd/addUser";
import AddComp from "../../table/settingsAdd/addComp";
import AddCat from "../../table/settingsAdd/addCat";
import AddWall from "../../table/settingsAdd/addWall";
import { usersurl, comurl, caturl, walurl, userurl } from "../../components/url";
import "../../components/loader/style.css"
import Spinner from "../../components/loader/spinner";
import { useAuthContext } from "../../components/hooks/useAuthContext";
import { toast } from 'react-hot-toast'
import bcrypt from 'bcryptjs'



function Settings() {

    const { user } = useAuthContext();

    const [userDatas, setUserData] = useState([]);
    const [compDatas, setCompData] = useState([]);
    const [catDatas, setCatData] = useState([]);
    const [walDatas, setWalData] = useState([]);
    const [pass, setpass] = useState("");
    const [userdata2, setuserdata2] = useState([]);



    const usercol = ['id', 'name', 'email', 'password', 'username', 'company', 'role'];
    const catcol = ['catid', 'name'];
    const compcol = ['id', 'name', 'currency', 'compid', 'timezone'];
    const walcol = ['wallid', 'name'];


    // console.log(user)


    const getUserData = async () => {
        await axios.get(usersurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
            setUserData(data);
        })
            .catch((error) => {
                console.log(error);
            });

    };
    const add = (userInfo,url) => {
        axios.post(
            url,
            userInfo, { headers: { 'Authorization': 'Bearer ' + user['token'] }, })
            .then(res => {
                if (res.status === 200) {
                    toast.success('data successfully created');
                    getUserData();
                    getCompData();
                    getCatData();
                    getWalData();
                  //window.location.reload();
                  }
                  else
                  Promise.reject()
              })
              .catch(err => toast.error(err))
        };


    useEffect(() => {

        // getCatData();
        getUserData();
        getCompData();
        getCatData();
        getWalData();
        getUser();
    }, []);

    const deleteUser = (_id, url) => {
        console.log(_id, userdata2._id)

        if(userdata2._id === _id){
            return(toast.error("You cannot delete your own data"))
        }

        axios
            .delete(
                url + _id, { headers: { 'Authorization': 'Bearer ' + user['token'] }, })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Transaction successfully deleted");
                    getUserData();
                    getCompData();
                    getCatData();
                    getWalData();
                    getUser();
                    //window.location.reload();

                } else Promise.reject();
            })
            .catch((err) => toast.error("Something went wrong"));
    };
    function formatDate(date, comp) {

        const year = date.getUTCFullYear().toString().substr(-2);
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
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
                    getUserData();
                    getCompData();
                    getCatData();
                    getWalData();
                    getUser();

                } else Promise.reject();
            })
            .catch((err) => toast.error("Something went wrong"));
    };

    const getUser = () => {
        axios.get(userurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
            setuserdata2(data[0]);
        })
            .catch((error) => {
                console.log(error);
            });

    };

    const getCompData = async () => {
        await axios.get(comurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
            setCompData(data);
            // setready(true);
        })
            .catch((error) => {
                console.log(error);
            });

    };
    const getCatData = async () => {
        await axios.get(caturl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
            setCatData(data);

        })
            .catch((error) => {
                console.log(error);
            });

    };
    const getWalData = async () => {
        await axios.get(walurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
            setWalData(data);

        })
            .catch((error) => {
                console.log(error);
            });

    };


    if (userDatas.length !== 0 && userdata2) {
        if ((userdata2['role'] !== 'admin')) {
            return (
                <div className="pos-center">
                    <Spinner />
                </div>

            );
        }
        return (
            <>
                <ResponsiveAppBar userdata={userdata2} /><Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                    }}
                >

                    <Container maxWidth="xl">
                        <h3>&nbsp;&nbsp;User Table</h3>
                        <div class='row'>
                            <div className='table-container'>
                                <AddUser add={add} url={usersurl} compdata={compDatas} />
                                <DynamicTable deleteUser={deleteUser} updateUser={updateUser} TableData={userDatas} url={usersurl} comdata={compDatas} column={usercol} height={350} />
                            </div>
                        </div>
                        <h3>&nbsp;&nbsp;Category Table</h3>
                        <div class='row'>
                            <div className='table-container'>
                                <AddCat add={add} url={caturl} />
                                <DynamicTable deleteUser={deleteUser} updateUser={updateUser} TableData={catDatas} url={caturl} comdata={compDatas} column={catcol} height={350} />
                            </div>
                        </div>
                    </Container>

                    <Container maxWidth="xl">
                        <h3>&nbsp;&nbsp;Company Table</h3>
                        <div class='row'>
                            <div className='table-container'>
                                <AddComp add={add} url={comurl} />
                                <DynamicTable deleteUser={deleteUser} updateUser={updateUser} TableData={compDatas} url={comurl} comdata={compDatas} column={compcol} height={350} />
                            </div>
                        </div>

                    </Container>

                    <Container maxWidth="xl">
                        <h3>Wallet Table</h3>
                        <div class='row'>
                            <div className='table-container'>
                                <AddWall add={add} url={walurl} />
                                <DynamicTable deleteUser={deleteUser} updateUser={updateUser} TableData={walDatas} url={walurl} column={walcol} height={350} />
                            </div>
                        </div>

                    </Container>
                </Box>

            </>

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

export default Settings