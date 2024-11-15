import React from 'react'
import '../assets/css/form.css'
import {useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {FaAt,FaPhoneFlip,FaRegAddressCard,FaUserPlus} from 'react-icons/fa6'
import { useEffect } from 'react'

// Component for editing an existing contact
const EditContact = () => {
  
     // Initialize state with empty values for contact fields
     const [values,setValues]=useState({
    name:"",
    email:"",
    phone:"",
    address:"",
   });

   const navigate=useNavigate()
   const {id}=useParams()        // Get contact ID from URL parameters
   const handleInput=(event)=>{
    setValues({...values,[event.target.name]:event.target.value});
   };

  

   const handleSubmit=(e)=>{
    e.preventDefault();      // Prevent default form submission
    
    // Send PUT request to update contact with current form values
    axios.put("http://localhost:3000/contactmsyt/update-contact/"+id,values,{
            headers : {
              Authorization : `Bearer ${localStorage.getItem('token')}`
            }
           })
        .then((res)=>{
            if(res.data.success)
            {
             toast.success("Contact Updated Successfully",{
             position :"top-right",
             autoClose: 5000,
             });
             navigate('/dashboard');
            }
          
            })
    
    .catch((err=>{
            console.log(err);
    }));
   };

   
   useEffect(() => {
    // Send GET request to retrieve the contact details by ID
    axios
      .get("http://localhost:3000/contactmsyt/contact/"+id, {
        headers: {
          Authorization: `Berear ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {              // Check if the response is successful
                                          // Populate form with the fetched contact data
         setValues({
            name:res.data.name,
            email:res.data.email,
            phone:res.data.phone,
            address:res.data.address
          })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
 
    return(
    <div className='add-form-container'>
        <form className="add-form" onSubmit={handleSubmit}>
            <h2>Edit Contact</h2>

            <div className="form-group">
                  <FaUserPlus/>           
                <input type="text" placeholder="Enter Name" className='form-control' name='name'  onChange={handleInput} value={values.name}/>
            </div>
            

            <div className="form-group">
                 <FaAt/>
                <input type="text" placeholder="Enter Email" className='form-control' name='email' autoComplete='off' 
                onChange={handleInput} value={values.email}/>
            </div>


            <div className="form-group">
                <FaPhoneFlip/>
                <input type="text" placeholder="Enter Phone Number" className='form-control' name='phone' onChange={handleInput} 
                value={values.phone}/>
            </div>

           <div className="form-group">
                <FaRegAddressCard/>
                <input type="text" placeholder="Enter Address" className='form-control' name='address' onChange={handleInput}
                value={values.address}/>
            </div>
       <button className="form-btn">Update</button>
        
        </form>
    
    </div>
  )
}

export default EditContact;


