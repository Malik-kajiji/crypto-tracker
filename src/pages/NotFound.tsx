import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    useEffect(()=>{
        setTimeout(()=>{
            document.querySelector('h3')?.click()
        },3000)
    },[])
    return (
        <section className='not-found'>
            <img src="/not_found.svg" alt="" />
                <h1 className='TXT-heading'>Opppps!</h1>
                    <h2 className='TXT-heading2'>Looks like there nothing to show you here</h2>
            <Link to='/'>
                <h3 className='TXT-heading3'>redirecting you to home page</h3>
            </Link>
                <div></div>
        </section>
    )
}

export default NotFound