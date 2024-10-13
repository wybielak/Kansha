import { observer } from 'mobx-react-lite'
import { useStore } from '../mobx/Store'

export default observer(function Auth() {

  const { appStorage } = useStore()

  return (
    <>
      <div className='w-screen h-halfscreen flex flex-col flex-nowrap items-center justify-center'>
        <div className='h-halfscreen flex flex-col flex-nowrap justify-center'>
          <h1 className='mb-0 mt-5 text-3xl font-bold text-gradient'>Kansha</h1>
          <p className='my-4'>
          Słowo "kansha" (感謝)<br />pochodzi z języka japońskiego i oznacza<br />"wdzięczność" lub "docenienie".
          </p>
          <div>
            <h4 className='text-center mt-8 mx-2 mb-4 font-bold'>Zaloguj się</h4>
            <button className='h-10 m-auto w-64 p-2 cursor-pointer flex items-center justify-center bg-dark text-light rounded' onClick={appStorage.signInWithGoogle}>
              <div className='flex flex-row flex-nowrap items-center justify-center'>
                <div className='mr-2 bg-white border-white border-2 rounded'>
                  <div className='google-icon'></div>
                </div>
                <span className='text-sm'>Continue with Google</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className='m-auto relative bottom-1 z-10 text-xs opacity-50'>Created by DNw 2024</div>
    </>
  )
})
