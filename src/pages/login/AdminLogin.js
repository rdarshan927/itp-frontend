import React from "react";
import {useState, useEffect} from "react";
import{api} from '../../config/api'
import { useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';



function Login(){
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInAdmin');
        if (loggedInUser) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const response = await api.post('/api/alogin', loginInfo);
            const { success, message, jwtToken, name, error } = response.data;

            if (success) {
                console.log("logged in");
                console.log(jwtToken);
                console.log(name)
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                // localStorage.setItem('loggedInUser', name);
                localStorage.setItem('useremail', email);
                localStorage.setItem("loggedInAdmin", name);
                setTimeout(() => {
                  if(name === "Sales Manager"){
                    navigate('/sales/dashboard')
                  } else if(name === "Harvest Manager"){
                    navigate('/harvestdashboard')
                  } else if(name === "Financial Manager"){
                    navigate('/financialdashboard')
                  } else if(name === "Plant Scheduling Manager"){
                    navigate('/plant')
                  } else if(name === "Stock & Transport Manager"){
                    navigate('/order')
                  } else if(name === "Disease Manager"){
                    navigate('/none')
                  } else if(name === "Inventory Manager"){
                    navigate('/ResourceInventory')
                  } else if(name === "Employee Manager"){
                    navigate('/addemployee')
                  }else{
                    navigate('/none/')
                  }
                    
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }else{
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    }

    return(
        <div className="h-screen flex justify-center items-center bg-adminWhite relative overflow-hidden dark:bg-bOne">
        <div className="absolute left-0 bottom-0 w-1/4">
          <img src="flower-left.png" alt="Left Flower" />
        </div>
        <div className="absolute right-0 bottom-0 w-1/4">
          <img src="flower-right.png" alt="Right Flower" />
        </div>
  
        <div className="w-full md:w-2/5 h-auto p-8 bg-darkG rounded-lg shadow-md z-10 dark:bg-cOne">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-lightG dark:text-white mb-4">Welcome back</h1>
            <p className="text-lightG font-bold mb-6 dark:text-white">Welcome back! Please enter your details</p>
          </div>
  
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-lightG mb-2 ">Email</label>
              <input
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded w-full dark:text-black"
                type='email'
                name='email'
                id='email'
                placeholder='Enter your email...'
                value={loginInfo.email}
              />
            </div>
  
            <div className="mb-6">
              <label htmlFor="password" className="block text-lightG mb-2 ">Password</label>
              <input
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded w-full dark:text-black"
                type='password'
                name='password'
                id='password'
                placeholder='Enter your password...'
                value={loginInfo.password}
              />
            </div>
  
            <a href="forgot_password" className="text-right text-lightG mb-6 block">Forgot Password?</a>
  
            <button
              type="submit"
              className="bg-lightG text-white p-3 rounded w-full font-bold hover:bg-lightG-dark transition duration-300 dark:bg-bOne"
            >
              Login
            </button>
          </form>
        </div>
  
        <ToastContainer />
      </div>
    )

}

export default Login;