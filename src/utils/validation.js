//API level validation
const validator = require("validator"); 

//function to validate data for user signup
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body; //extract importants from body

  if (!firstName || !lastName) {
    throw new Error("Enter a valid name ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid emailid ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a valid password ");
  }
};

// Function to validate data for editing profile
const validateEditProfileData = (req) => {
  const allowedEditFields = [
  "firstName", "lastName", "photoUrl", "about", "gender", "age", "skills",
  "socialLinks"
];

  const isEditAllowed=Object.keys(req.body).every((k)=>{
    return allowedEditFields.includes(k);
  })
    return isEditAllowed;
}

module.exports = { validateSignUpData ,validateEditProfileData};
