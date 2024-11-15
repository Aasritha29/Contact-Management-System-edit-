import React from 'react'
import '../assets/css/form.css'
import {useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {FaAt,FaPhoneFlip,FaRegAddressCard,FaUserPlus} from 'react-icons/fa6'

const AddContact = () => {
     
    // State to hold form input values for the contact fields
    const [values,setValues]=useState({
    name:"",
    email:"",
    phone:"",
    address:"",
   });

   // Initialize navigate function to redirect to different routes after form submission
   const navigate=useNavigate();
   
   // Handle input changes and update state with new values
   const handleInput=(event)=>{
    setValues({...values,[event.target.name]:event.target.value});
   };

   //Handle form Submissions
   const handleSubmit=(e)=>{
    e.preventDefault();
    
    // Send a POST request to the server to add a new contact
    axios.post("http://localhost:3000/contactmsyt/add-contact",values,{
            headers : {
              Authorization : `Berear ${localStorage.getItem('token')}`  // Add JWT token for authentication
            }
           })
        .then((res)=>{
          // Check if the response indicates success
            if(res.data.success)
            {
              // Display success notification on successful addition of contact
             toast.success("Contact Added Successfully",{
             position :"top-right",
             autoClose: 5000,
             });
             
             // Redirect to dashboard after success
             navigate('/dashboard');
            }
          
            })
    
    .catch((err)=>{
            console.log(err);
    });
   };
    return(
    <div className='add-form-container'>
        <form className="add-form" onSubmit={handleSubmit}>
            <h2>Add Contact</h2>

            <div className="form-group">
                  <FaUserPlus/>           
                <input type="text" placeholder="Enter Name" className='form-control' name='name' 
                pattern='\w{5,20}'  data-tooltip="name must be between 5 to 20 characters" required  onChange={handleInput}/>
            </div>
            

            <div className="form-group">
                 <FaAt/>
                <input type="email" placeholder="Enter Email" className='form-control' name='email' autoComplete='off'
                 required data-toolpit="invalid email" onChange={handleInput}/>
            </div>


            <div className="form-group">
                <FaPhoneFlip/>
                <input type="text" placeholder="Enter Phone Number" className='form-control' name='phone'
                 pattern= "\d{10}" data-tooltip="must contain 10 digits" required onChange={handleInput}/>
            </div>

           <div className="form-group">
                <FaRegAddressCard/>
                <input type="text" placeholder="Enter Address" className='form-control' name='address' onChange={handleInput}/>
            </div>
       <button className="form-btn">Add</button>
        
        </form>
    
    </div>
  )
}

export default AddContact;  // Export the component for use in other parts of the application

