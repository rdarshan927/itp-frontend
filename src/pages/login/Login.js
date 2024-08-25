import React from "react";
import {useState} from "react";
import{api} from '../../config/api'
import { Link, useNavigate } from 'react-router-dom'
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';



function Login(){
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

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
            const response = await api.post('/api/login', loginInfo);
            const { success, message, jwtToken, name, error } = response.data;

            if (success) {
                console.log("logged in");
                console.log(jwtToken);
                console.log(name)
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('useremail', email);
                setTimeout(() => {
                    navigate('/')
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
    <div className="h-screen flex" >
       <div className="w-2/5 flex flex-col justify-center ">
            <div className="w-full justify-center flex">
                <div className="">
                    <h1 className="text-3xl font-bold text-darkG mb-4 ">Welcome back</h1>
                    <p className="mb-6 text-darkG font-bold ">Welcome back! Please enter your details</p>
    
                    <form onSubmit={handleLogin}>
                         <div className="text-lightG">
                            <label className="">Email</label>
                            <br></br>
                            <input
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded mb-4 md:w-96  "
                                    type='email'
                                    name='email'
                                    placeholder='Enter your email...'
                                    value={loginInfo.email}
                                />
                            
                        </div>
                        <div className="text-lightG">
                            <label className="">Password </label>
                            <br></br>
                            <input
                                    onChange={handleChange}
                                    className="p-3 border border-gray-300 rounded mb-4 md:w-96  "
                                    type='password'
                                    name='password'
                                    placeholder='Enter your password...'
                                    value={loginInfo.password}
                                />
                            
                        </div>
                            <a href="#" className="text-right text-lightG mb-4 block">Forgget Password</a>
                        
                            <button  type="submit" className="bg-lightG text-white p-3 rounded md:w-96">
                                Login
                            </button>
                            
                            <p className="text-center text-lightG mt-4">Dont have an account?<a href="#" className="text-lightG">Sing up</a>
                            </p>
                    </form>
                </div>
            </div>
        </div>
            <ToastContainer />
            <div className="w-auto bg-cover bg-center md:flex hidden overflow-hidden">
                <img src="./images/login_img.jpg" className="h-full w-full object-cover"></img>
            </div>

        
    </div>
    )

}

export default Login;