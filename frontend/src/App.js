import { CssBaseline } from '@mui/material';
import { BrowserRouter , Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/home';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from './theme';
import Login from "./pages/login/Login"
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from "./components/hooks/useAuthContext";
import HomeAdmin from "./pages/admin/admin_home";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { userurl } from "./components/url";
import Settings from './pages/admin/settings';
import Account from './pages/account/account';
import {useLogout} from './components/hooks/useLogout'
import Spinner from './components/loader/spinner';


const App = () => {
	const { logout } = useLogout()
	const theme = createTheme();
	const { user } = useAuthContext();
	const [userdata, setuserdata] = useState([]);
	const [expired, setexpired] = useState(false);
	const [initialRoute, setInitialRoute] = useState("/");
	const [loading, setLoading] = useState(true);

	theme.typography.h4 = {
		fontSize: '1.2rem',
		"@media (min-width:600px)": {
			fontSize: "1.5rem"
		  },
	  };

	  theme.typography.h5 = {
		fontSize: '1rem',
		'@media (min-width:600px)': {
		  fontSize: '1.5rem',
		},
	  };

	  theme.typography.h6 = {
		fontSize: '0.8rem',
		'@media (min-width:600px)': {
		  	fontSize: '1.5rem',
		},
	};

	useEffect(() => {
		getUser();
		//window.addEventListener('beforeunload', handleTabClose);

		//return () => {
		//  window.removeEventListener('beforeunload', handleTabClose);
		//};
		

	}, [user]);
	


	const handleTabClose = event => {
		event.preventDefault();
  
		console.log('beforeunload event triggered');
		logout()
		
	  };
	const getUser = async () => {
		if (user) {
			await axios.get(userurl, { headers: { 'Authorization': 'Bearer ' + user['token'] }, }).then(({ data }) => {
				setuserdata(data[0]);
				setexpired(true)
				// console.log("changed ", userdata)
			})
				.catch((error) => {
					setexpired(false)
					console.log(error);
				});
		}
		setLoading(false);
	};

	if ((!user && loading)  ) {
		return (
			<div className="pos-center">
			<Spinner />
		  </div>
		  
		);
	  }

	return (
		<>
			<Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter>
					<Routes>
						
							<Route
								path="/login"
								element={<Login />}
							/>

							<Route
								path="/"
								element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
							/>
							<Route
								path="/home"
								element={user && userdata['role'] === 'admin' ? <HomeAdmin /> : user ? <Home userdata={userdata} /> : <Navigate to="/login" />}
							/>
							<Route
								path="/settings"
								element={user  ? <Settings /> : <Navigate to="/login" />}
							/>
							<Route
								path="/account"
								element={ user ? <Account  user={user} /> : <Navigate to="/login" /> }
							/>


						
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</>
	)


}
export default App;