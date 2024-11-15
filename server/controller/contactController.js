import {ContactModel} from '../models/Contact.js'

const createContact=async(req,res)=>{
    const {name,email,phone,address}=req.body;        // Extract contact details from the request body

    try{
    const newContact=new ContactModel({
        name,
        email,
        phone,
        address,
        postedBy:req.user._id       // Associate the contact with the logged-in user
    });
   
    //save the contact in the database
   const result=await newContact.save()
   return res.status(201).json({success:true,...result._doc})
}catch(err){
    return res.status(500).json(err.message);
}
};

// Controller function to retrieve all contacts for the logged-in user
const getContacts=async(req,res)=>{

    try{
        //find a single contact by id
        const contacts=await ContactModel.find({postedBy:req.user._id})
        return res.status(200).json({success:true,contacts})
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

// Controller function to retrieve a specific contact by its ID
const getContact=async(req,res)=>{
     const {id}=req.params;
     if(!id)
     {
        return res.status(401).json({error:"No Id specified"})
     }
    try{
        const contacts=await ContactModel.findOne({_id:id})
        return res.status(200).json({success:true,...contacts._doc})
    }catch(err){
        return res.status(500).json({error:err.message})
    }
}

// Controller function to update an existing contact by ID
const updateContact=async(req,res)=>{
    const {id}=req.params;
    if(!id)
    {
       return res.status(401).json({error:"No Id specified"})
    }
   try{
       
       const result=await ContactModel.findByIdAndUpdate({_id:id},{...req.body},{new:true})
       return res.status(200).json({success:true,...result._doc})
   }catch(err){
       return res.status(500).json({error:err.message})
   }
}

// Controller function to delete a contact by ID
const deleteContact=async(req,res)=>{
    const {id}=req.params;
    if(!id)
    {
       return res.status(401).json({error:"No Id specified"})
    }
   try{
       const contact=await ContactModel.findOne({_id:id})
       if(!contact){
        return res.status(401).json({error:"No Record Existed"})
       }
       //delete the contact
       const deleteRecord=await ContactModel.findByIdAndDelete({_id:id})
       // Fetch the remaining contacts associated with the user
       const contacts=await ContactModel.find({postedBy:req.user._id})
       return res.status(200).json({success:true,contacts})
   }catch(err){
       return res.status(500).json({error:err.message})
   }
}

      
// Function to find duplicates and return merged contacts
const mergeContact = async (req, res) => {
  try {
    // Find duplicates based on email and/or phone number
    const duplicates = await Contact.aggregate([
      {
        $group: {
          _id: {  phone: "$phone" },
          docs: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);

    // Merge duplicates and keep only one contact per unique email/phone
    const mergedContacts = duplicates.map(group => {
      const [firstContact, ...otherContacts] = group.docs;

      // Merge details from all duplicates, prioritizing the first contact
      otherContacts.forEach(contact => {
        firstContact.phone = firstContact.phone || contact.phone;
       // firstContact.address = firstContact.address || contact.address;
        // Continue merging other fields as needed
      });

      return firstContact;
    });

    res.status(200).json(mergedContacts);
  } catch (error) {
    res.status(500).json({ message: 'Error finding duplicates', error });
  }
};

/*// Optional: Function to delete duplicates after merging
exports.deleteDuplicates = async (req, res) => {
  try {
    const { idsToDelete } = req.body; // Array of IDs to delete

    await Contact.deleteMany({ _id: { $in: idsToDelete } });
    res.status(200).json({ message: 'Duplicates deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting duplicates', error });
  }
};*/

      
    

  /* try{
        //find a single contact by id
        const contacts=await ContactModel.find({postedBy:req.user._id})
        return res.status(200).json({success:true,contacts})
    }catch(err){
        return res.status(500).json({error:err.message})
    }*/




export {createContact,getContacts,getContact,updateContact,deleteContact,mergeContact}