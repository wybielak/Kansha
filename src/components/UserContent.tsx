import Home from './Home';
import Profile from './Profile';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]);

export default function UserContent() {



  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
