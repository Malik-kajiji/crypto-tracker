import React, { useState } from 'react';
import GoogleButton from 'react-google-button';
import { useSelector , useDispatch } from 'react-redux';
import { alertActions } from '../redux/AlertController';
import type { RootState } from '../config/store';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword,updateProfile,GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
type PropsType = {
    setShowenPage: React.Dispatch<React.SetStateAction<string>>
}

const SignUp = ({setShowenPage}:PropsType) => {
    const theme = useSelector((state:RootState)=> state.theme.mode);
    const dispatch = useDispatch();
    const [inputValues,setInputValues] = useState({email:'',password:'',confirmPassword:'',name:''});
    function handleClick(){
        const {email,password,confirmPassword,name} = inputValues
        if(email === '' || password === '' || confirmPassword === '' || name === ''){
            dispatch(alertActions.showAlert({msg:'make sure to fill up all the inputs', type:'error', showen:true}))
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            dispatch(alertActions.showAlert({msg:'the email is not valid', type:'error', showen:true}))
        } else if( password !== confirmPassword){
            dispatch(alertActions.showAlert({msg:'the password does not match', type:'error', showen:true}))
        } else {
            createUserWithEmailAndPassword(auth,inputValues.email,inputValues.password)
            .then((res)=>{
                updateProfile(res.user,{
                    displayName: inputValues.name
                })
                dispatch(alertActions.showAlert({msg:'you created account successfully', type:'success', showen:true}))
            })
            .catch((err)=>{
                dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true}))
            })
        }
    }
    function handleLoginWithGoogle(){
        const GoogleProvider = new GoogleAuthProvider()
        signInWithPopup(auth,GoogleProvider)
        .then(res => {
            dispatch(alertActions.showAlert({msg:'you logged in successfully', type:'success', showen:true}))
        })
        .catch(err =>{
            dispatch(alertActions.showAlert({msg:err.message, type:'error', showen:true}))
        })
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = e.target.value
        const name = e.target.name
        setInputValues(prev => {
            return {
                ...prev,
                [name]:value
            }
        })
    }
    return (
        <article className='sign-up'>
            <input 
                type="text"
                value={inputValues.name}
                onChange={(e)=>handleChange(e)}
                name='name'
                placeholder='Name'
                className='TXT-normal'
                />
            <input 
                type='email'
                value={inputValues.email}
                onChange={(e)=>handleChange(e)}
                name='email'
                placeholder='Email'
                className='TXT-normal'
                />
            <input 
                type="password"
                value={inputValues.password}
                onChange={(e)=>handleChange(e)}
                name='password'
                placeholder='Password'
                className='TXT-normal'
                />
            <input 
                type="password"
                value={inputValues.confirmPassword}
                onChange={(e)=>handleChange(e)}
                name='confirmPassword'
                placeholder='ConfirmPassword'
                className='TXT-normal'
                />
            <button 
                className='BTN'
                onClick={handleClick}
            >Sign Up</button>
            <h2 className='TXT-heading3'>OR</h2>
            <GoogleButton 
                type={theme === 'dark'?'light':'dark'}
                label='continue with google'
                onClick={handleLoginWithGoogle}
            />
            <p className='TXT-normal' onClick={()=>setShowenPage('login')}>already have account? 
                <span className='TXT-heading3'> login</span>
            </p>
        </article>
    )
}

export default SignUp