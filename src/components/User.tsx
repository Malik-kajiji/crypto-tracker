import React, { useState } from 'react';
import { useDispatch , useSelector} from 'react-redux';
import { alertActions } from '../redux/AlertController';
import type { RootState } from '../config/store';
import { signOut  } from 'firebase/auth';
import { auth } from '../config/firebase';
import { updateProfile,updateEmail  } from 'firebase/auth';

const User = () => {
    const user = useSelector((state:RootState)=> state.user);
    const [username,setUsername ] = useState('')
    const [newEmail,setNewEmail ] = useState('')
    const dispatch = useDispatch()
    function handleLogOut(){
        signOut(auth)
        .then(()=>{
            dispatch(alertActions.showAlert({msg:'logged out successfully', type:'success', showen:true}))
        })
        .catch((err)=>{
            dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true}))
        })
    }
    function handleName() {
        if(username === ''){
            dispatch(alertActions.showAlert({msg:'make sure to fill up the input', type:'error', showen:true}))
        } else {
            if(auth.currentUser){
                updateProfile(auth.currentUser,{
                    displayName:username
                })
                .then(()=>{
                    dispatch(alertActions.showAlert({msg:'username updated successfully', type:'success', showen:true}))
                })
            }
        }
    }
    function handlePhoto() {
        if(newEmail === ''){
            dispatch(alertActions.showAlert({msg:'make sure to fill up the input', type:'error', showen:true}))
        }else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newEmail)){
            dispatch(alertActions.showAlert({msg:'this email is not valid', type:'error', showen:true}))
        } else {
            if(auth.currentUser){
                updateEmail(auth.currentUser,newEmail)
                .then(()=>{
                    dispatch(alertActions.showAlert({msg:'email updated successfully', type:'success', showen:true}))
                })
                .catch((err)=>{
                    dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true}))
                })
            }
        }
    }

    let email = '';
    for(let i=0;i<user.email.length ; i++){
        if(i === 0){
            email += user.email[0]
        }else if(user.email[i] !== '@'){
            email += '*'
        } else {
            email += user.email.slice(i)
            i = user.email.length
        }
    }

    
    return (
        <>
            <article className='account'>
                <span className='user-name TXT-heading3'> {user.name || ''} </span>
                {auth.currentUser?.photoURL?
                    <div className='Image' style={{backgroundImage:`url(${auth.currentUser?.photoURL})`}}></div>
                :
                    <div className='Image'></div>
                }
                <p className='email TXT-normal'>{email}</p>
                <button className='BTN' onClick={handleLogOut}>log out</button>
            </article>
            <article className='update-profile'>
                <span className='label TXT-heading3'> update profile </span>
                <input 
                    type='text' 
                    className='username TXT-normal' 
                    placeholder='username'
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <input 
                    type='url' 
                    className='photo TXT-normal' 
                    placeholder='email'
                    value={newEmail}
                    onChange={(e)=>setNewEmail(e.target.value)}
                />
                <button className='BTN username-btn' onClick={handleName}> update username </button>
                <button className='BTN photo-btn' onClick={handlePhoto}> update email </button>
            </article>
        </>
    )
}

export default User