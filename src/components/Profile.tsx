import BottomMenu from './BottomMenu'
import { auth } from '../config/FirebaseConfig'
import { useEffect, useState } from 'react'
import { useStore } from '../mobx/Store'
import { NavLink } from 'react-router-dom'

export default function Profile() {

    const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined)

    const { appStorage } = useStore()

    useEffect(() => {
        if (auth!.currentUser!.photoURL !== null && auth!.currentUser!.photoURL !== undefined) setProfilePhoto(auth!.currentUser!.photoURL)
    }, [])

    return (
        <>
            <div className='mt-24 flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <img className='w-24 h-24 rounded-full' src={profilePhoto} alt="" />
                    <h2 className='my-3 font-bold'>{auth!.currentUser!.displayName}</h2>
                    <p className='mb-7'>{auth!.currentUser!.email}</p>
                </div>
                
                <NavLink to='/'><button className='m-4 mb-20 h-10 p-2 cursor-pointer bg-dark text-light rounded' onClick={appStorage.logOut}>Wyloguj</button></NavLink>
            </div>

            
            <BottomMenu />

            <div className='m-auto relative bottom-1 z-10 text-xs opacity-50'>Created by DNw 2024</div>
        </>
    )
}
