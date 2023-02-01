import React, { useState ,useEffect } from 'react'
import '../styles/Account.scss';
import User from '../components/User';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import { useSelector } from 'react-redux';
import { RootState } from '../config/store';

const Account = () => {
    const userRedux = useSelector((state:RootState) => state.user);
    const [showenPage,setShowenPage] = useState('signUp');
    useEffect(()=> {
        if(userRedux.isLoggedIn){
            setShowenPage('user')
        } else {
            setShowenPage('signUp')
        }
    },[userRedux.isLoggedIn])
    return (
        <section className='container'>
            {showenPage === 'signUp'? <SignUp setShowenPage={setShowenPage} /> : ''}
            {showenPage === 'login'? <Login setShowenPage={setShowenPage} /> : ''}
            {showenPage === 'user'? <User /> : ''}
        </section>
    )
}

export default Account