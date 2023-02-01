import React,{useState} from 'react';
import GoogleButton from 'react-google-button';
import { useSelector , useDispatch } from 'react-redux';
import { alertActions } from '../redux/AlertController';
import { auth } from '../config/firebase';
import type { RootState } from '../config/store';
import { signInWithEmailAndPassword, GoogleAuthProvider , signInWithPopup  } from 'firebase/auth';
type PropsType = {
    setShowenPage: React.Dispatch<React.SetStateAction<string>>
}

const Login = ({setShowenPage}:PropsType) => {
    const theme = useSelector((state:RootState)=> state.theme.mode);
    const dispatch = useDispatch();
    const [inputValues,setInputValues] = useState({email:'',password:''});
    function handleLogIn(){
        const { email , password } = inputValues
        if( email === '' || password === ''){
            dispatch(alertActions.showAlert({msg:'make sure to fill up all the inputs', type:'error', showen:true}))
        } else {
            signInWithEmailAndPassword(auth,email,password)
            .then(()=>{
                dispatch(alertActions.showAlert({msg:'you logged in successfully', type:'success', showen:true}))
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
        <article className='login'>
            <input 
                type="text"
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
            <button className='BTN' onClick={handleLogIn}>login</button>
            <h2 className='TXT-heading3'>OR</h2>
            <GoogleButton 
                type={theme === 'dark'?'light':'dark'}
                label='continue with google'
                onClick={handleLoginWithGoogle}
            />
            <p className='TXT-normal' onClick={() => setShowenPage('signUp')}>don't have account? 
                <span className='TXT-heading3'> sign up</span>
            </p>
        </article>
    )
}

export default Login