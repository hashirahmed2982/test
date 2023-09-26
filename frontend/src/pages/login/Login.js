import React from 'react';
import { useState } from 'react';
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom';
import "./login.css";
import { useLogin } from "../../components/hooks/useLogin"



export default function Login() {

    const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, Error, isLoading} = useLogin()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Attempt to log in
      await login(email, password);

      // If login is successful, navigate to the "home" page
      navigate('/home');
    } catch (error) {
      toast.error("error loging in");
    }

    
  }

    return (
        <>
            <container  className="page">
                <form class="login" onSubmit={handleSubmit}>
                    <h1 >Login</h1>
                    
                    <input type="text" placeholder="Username" onChange={(e) => setEmail(e.target.value)} value={email} ></input>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} ></input>
                    <button>Login</button>
                </form>
                
            </container>
        </>
    )
}