import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';

const Sample =() => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    const storedEmail = localStorage.getItem('useremailc');

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedCustomer'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('tokenc');
        localStorage.removeItem('loggedCustomer');
        localStorage.removeItem('useremailc');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    return(
        <div className='text-center mt-36'>
            <h1>Welcome {loggedInUser}</h1>
            <button onClick={handleLogout}>Logout</button>
            <div>
                <span>{storedEmail}</span>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Sample;