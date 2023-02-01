import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { alertActions } from '../redux/AlertController';
import type { RootState } from '../config/store';
import { BiErrorCircle } from 'react-icons/bi';
import { VscError,VscPass } from 'react-icons/vsc';

const Alert = () => {
    const alert = useSelector((state:RootState)=> state.alertController);
    const dispatch = useDispatch()

    if(alert.showen === true){
        setTimeout(() => {
            dispatch(alertActions.hideAlert({}))
        }, 3000);
    }
    return (
        <article className={`alert ${alert.type} ${alert.showen?'showen' :''}`}>
            <p className='TXT-normal'>{alert.msg}</p>
            {alert.type === 'error'? <span className='TXT-heading3'>{VscError({})}</span>:''}
            {alert.type === 'warrning'? <span className='TXT-heading3'>{BiErrorCircle({})}</span>:''}
            {alert.type === 'success'? <span className='TXT-heading3'>{VscPass({})}</span>:''}
        </article>
    )
}

export default Alert