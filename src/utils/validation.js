const validator = require("validator"); 

const validateSignUpData = (req) => {
  console.log("🔍 Running API-level validation..."); 
  const { firstName, lastName, emailId, password } = req.body; //extract importants from body

  if (!firstName || !lastName) {
    throw new Error("Enter a valid name ");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid emailid ");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a valid password ");
  }
};

module.exports = { validateSignUpData };
