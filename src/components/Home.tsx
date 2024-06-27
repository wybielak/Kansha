import { observer } from 'mobx-react-lite'
import BottomMenu from './BottomMenu'
import { useStore } from '../mobx/Store'
import { useEffect, useState } from 'react'
import { auth } from '../config/FirebaseConfig'
import { format } from 'date-fns';
import { pl } from 'date-fns/locale'

export default observer(function Home() {

  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined)

  const { appStorage } = useStore()

  const [today, setToday] = useState(new Date())

  useEffect(() => {
    if (auth!.currentUser!.photoURL !== null && auth!.currentUser!.photoURL !== undefined) setProfilePhoto(auth!.currentUser!.photoURL)
  }, [])

  return (
    <>
      <div className='flex flex-col items-center justify-start'>

        <p className='mt-10 text-xl'>Hej, {auth!.currentUser!.displayName}!</p>

        <img className='w-16 h-16 rounded-full my-5' src={profilePhoto} alt="" />

        <h2 className='text-2xl'>{format(today, 'EEEE', { locale: pl })}</h2>
        <h2 className='text-6xl text-gradient'>{format(today, 'dd')}</h2>
        <h2 className='text-3xl mt-1 mb-5'>{format(today, 'yyyy')}</h2>

        <h2 className='text-xl font'>Za co dziś jesteś wdzięczny?</h2>
      </div>
      <BottomMenu />
    </>
  )
})
