import React from 'react'
import axios from 'axios';
import DataTable from 'react-data-table-component'
import { FaPenToSquare,FaRegTrashCan ,Fa42Group} from 'react-icons/fa6';
import { useState } from 'react';
import { useEffect } from 'react';
import CircleLoader from 'react-spinners/CircleLoader'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Custom styles for the DataTable component
const customStyles={
  headCells:{
    style:{
      fontSize:17+"px",
      fontWeight:600,
    },
  },
  cells:{
    style:{
      fontSize:15+"px",
      fontWeight:500,
    },
  },
};

// Enhance SweetAlert2 with React for using React components inside alerts
const MySwal = withReactContent(Swal)

const MergeContact = () => {
  const [contacts,setContacts]=useState([])
  const[loading,setLoading]=useState(false)
  const[duplicates,setDuplicates]=useState([])

  // Function to delete a contact by ID, with confirmation prompt
  const deleteRecord=(id) =>{
     MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/contactmsyt/contact/${id}`,{
          headers:{
            Authorization:`Berear ${localStorage.getItem("token")}`,
          },
        })
        .then((res)=>{
          setContacts(res.data.contacts);   // Update contacts list after deletion
         MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      })
      .catch((err)=>{
        // Show error alert if deletion fails
        MySwal.fire({
          title:"Error!",
          text:"Error Occured!!!",
          icon:"error",
        });
      });
    }
  });
  }

  // Define columns for DataTable, including name, email, phone, address, and actions





  const columns=[
    {
      name:'Name',
      selector:(row)=>row.name
    },

    {
      name:'Email',
      selector:(row)=>row.email
    },

    {
      name:'Phone',
      selector:(row)=>row.phone
    },
    {
        name:'Address',
        selector:(row)=>row.address
    },
    {
      name:'Action',
      selector:(row)=>(
      <>
          <Fa42Group className="table-icon1" onClick={()=>handleMerge(row._id)}/>
           <FaRegTrashCan className="table-icon2" onClick={()=>deleteRecord(row._id)}/> 
           
      </>
      ),
    },
 ]
 //
 //
  
 useEffect(() => {


    setLoading(true);
    axios
      .get("http://localhost:3000/contactmsyt/merge-contact", {
        headers: {
          Authorization: `Berear ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setContacts(res.data.contacts);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  

    


    const fetchDuplicates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/contactmsyt/duplicate-contact");
        setDuplicates(response.data);
      } catch (error) {
        console.error("Error fetching duplicates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDuplicates();
  }, []);

  const handleMerge = async (contact) => {
    try {
      const duplicateIds = contact.docs.map(doc => doc._id);
      const mergedContact = contact.docs[0];

      await axios.post("http://localhost:3000/contactmsyt/merged-contact/", { mergedContact, duplicateIds });
      MySwal.fire('Merged!', 'Contacts have been merged successfully.', 'success');
      setDuplicates(duplicates.filter(dup => dup._id !== contact._id));
    } catch (error) {
      console.error("Error merging contacts:", error);
    }
  };



  // Fetch contacts data on component mount
  /*useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/contactmsyt/merge-contact", {
        headers: {
          Authorization: `Berear ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setContacts(res.data.contacts);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);*/
 
  return(
       <>
       {
         loading?(                     // Conditional rendering based on loading state
         <CircleLoader
             loading={loading}             // Display CircleLoader if loading
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
         />
       ):(
         <div className="contact-list">
          <DataTable
            columns={columns}               // Pass defined columns to DataTable
            data={contacts}                 //Pass contacts to DataTable
            customStyles={customStyles}     //Apply custom styles
            pagination
          />
          {contacts.length === 0 ? <h1>Add a Contact</h1> : <></>}
        </div>)
       }
        </>
  )
}

export default MergeContact;