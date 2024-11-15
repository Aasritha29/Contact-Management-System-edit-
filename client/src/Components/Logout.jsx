import React, { useContext } from 'react'
import { UserContext } from '../App'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'


const Logout = () => {
    // Access the setUser function from UserContext to reset user state on logout
    const {setUser}=useContext(UserContext)

    // Creating a custom Swal (SweetAlert2) component that works with React
    const MySwal = withReactContent(Swal)
    const navigate=useNavigate()
    // Show a SweetAlert confirmation dialog to ask the user if they are sure about logging out
    MySwal.fire({
        title: "Are you sure?",
        text: "Do you want to Exit",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes,I want!"
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear()
            setUser(null)
          
          
        }
        navigate("/")
      
    });
};


export default Logout
