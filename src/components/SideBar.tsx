/* eslint-disable react-hooks/exhaustive-deps */
import React , { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAttachMoney } from 'react-icons/md';
import { AiOutlineHome,AiOutlineUser } from 'react-icons/ai';
import { RiFileList3Line } from 'react-icons/ri';
import { BiTransfer } from 'react-icons/bi'
import { BsToggle2Off, BsToggle2On ,BsChevronBarRight} from 'react-icons/bs';
import { themeActions } from '../redux/Theme';
import { useSelector,useDispatch } from 'react-redux';
import type { RootState } from '../config/store';



const SideBar = () => {
    const theme = useSelector((state:RootState) => state.theme.mode);
    const dispatch = useDispatch()
    const [slideShown,setSlideShowen] = useState(false);
    function handleChangeTheme(){
        dispatch(themeActions.toggleTheme({}))
        if(theme === 'dark'){
            window.localStorage.setItem('theme','light')
        } else {
            window.localStorage.setItem('theme','dark')
        }
    }
    useEffect(()=>{
        const StorageTheme = window.localStorage.getItem('theme');
        if(StorageTheme === 'light'){
            dispatch(themeActions.changeTheme({newTheme:'light'}))
        }
    },[])

    return (
        <>
            <div className={`side-bar-btn ${slideShown?'' : 'closed'}`} onClick={()=>setSlideShowen(prev => !prev)}>
                    <span className='TXT-heading2'>
                        {BsChevronBarRight({})}
                    </span>
            </div>
            <aside className= {`side-bar ${slideShown?'' : 'closed'}`}>
                <div className='logo'>
                    <img className='logo-image' src={theme === 'light'?'logo.png':'logo-dark.png'} alt=''/>
                    <h2 className='TXT-normal'>
                        <span className='TXT-heading3'>c</span>rypto 
                        <span className='TXT-heading3'> t</span>racker
                        <a className='TXT-normal' rel="noreferrer" href='https://malikkajiji.online' target='_blank'>developed & designed by malik kajiji</a>
                    </h2>
                </div>
                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles*/}
                <ul className='first-list' role='list'>
                    <li className='TXT-normal' onClick={()=>setSlideShowen(false)}>
                        <Link to='/'>
                            <span className='TXT-heading3'>
                                {AiOutlineHome({})}
                            </span>
                            Home
                        </Link>
                    </li>
                    <li className='TXT-normal' onClick={()=>setSlideShowen(false)}>
                        <Link to='topholders'>
                            <span className='TXT-heading3'>
                                {MdAttachMoney({})}
                            </span>
                            Top holders
                        </Link>
                    </li>
                    <li className='TXT-normal' onClick={()=>setSlideShowen(false)}>
                        <Link to='watchlist'>
                            <span className='TXT-heading3'>
                                {RiFileList3Line({})}
                            </span>
                            Watch list
                        </Link>
                    </li>
                    <li className='TXT-normal' onClick={()=>setSlideShowen(false)}>
                        <Link to='exchange'>
                            <span className='TXT-heading3'>
                                {BiTransfer({})}
                            </span>
                            Exchange Rate
                        </Link>
                    </li>
                </ul>
                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles*/}
                <ul className='second-list' role='list'>
                    <li className='TXT-normal' onClick={()=>setSlideShowen(false)}>
                        <Link to='account'>
                            <span className='TXT-heading3'>
                                {AiOutlineUser({})}
                            </span>
                            Account
                        </Link>
                    </li>
                    <li className='TXT-normal' onClick={handleChangeTheme}>
                        <span className='TXT-heading3'>
                            {theme === 'light'? BsToggle2Off({}) : BsToggle2On({})}
                        </span>
                        Theme
                    </li>
                </ul>
            </aside>
            <div className={`blur-overlay ${slideShown ? 'active':''}`}></div>
        </>
    )
}

export default SideBar