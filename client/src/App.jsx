import React, { useEffect } from 'react'
import Home from './Pages/Home'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { createContext } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Dashboard from './Pages/Dashboard'
import Contacts from './Components/Contacts'
import AddContact from './Components/AddContact'
import EditContact from './Components/EditContact'
import Logout from './Components/Logout'
import ProtectedRoutes from './Components/ProtectedRoutes'
import NotFound from './Pages/NotFound'
import Profile from './Components/Profile'
import MergeContact from './Components/MergeContact'
export const UserContext=createContext(null);


const router=createBrowserRouter([
  {
  
  path :'/',
  element:<Home/>,
  },
  {
    path:'/register',
    element:<Register/>,
  },
  {
    path:'/login',
     element:<Login/>,
  },
  {
    path:'/profile',
    element:<Profile/>
  },
  {
    path:'/dashboard',
    element:<ProtectedRoutes><Dashboard/></ProtectedRoutes>,
    children:[
      {
        index:true,
        element:<Contacts/>
      },
      {
          path:"/dashboard/add-contact",
          element:<AddContact/>
      },
      {
        path:"/dashboard/edit-contact/:id",
        element:<EditContact/>
    },
    {
      path:"/dashboard/merge-contact",
      element:<MergeContact/>
    }
    
    
    ]
  },
  {
    path:'/logout',
     element:<Logout/>,
  },
  {
       path:"*",
       element:<NotFound/>
  }
]);
const App = () => {
  const[user,setUser]=useState();
  useEffect(()=>{
          
            //This code sends an HTTP GET request to http://localhost:3000/contactmsyt/verify using axios.
            axios.get('http://localhost:3000/contactmsyt/verify',{
            headers : {
              //retrieves the token from browser local storage
              Authorization : `Barear ${localStorage.getItem('token')}`
            }
           }).then(res=>{
            if(res.data.success){
              setUser(res.data.user)
            }
           }).catch(err=>{
            console.log(err)
           })
  },[])

  return (
    <div>
      <ToastContainer/>
      <UserContext.Provider value={{user,setUser}}>
      <RouterProvider router={router}/>
      </UserContext.Provider>
     </div>
  );
};

export default App
