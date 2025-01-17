const validator = require('validator')

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("first name should be 4 to 50 charaters");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a Strong Password");
    }
}

const validateProfileEditData = (req) => {
    const allowEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "Skills", "age", "about"];

    const iseditAlloed = Object.keys(req.body).every(field => allowEditFields.includes(field));

    return iseditAlloed;
}

// const passwordChang = (req) =>{
//     const allowFields = ["password"]
// }

module.exports = { validateSignUpData  ,validateProfileEditData };