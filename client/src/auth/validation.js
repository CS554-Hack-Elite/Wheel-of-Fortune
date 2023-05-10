//common function to check all input parameters for both route and data

const exportedMethods = {
  checkInput(input, val, variableName, routeFlag = false, required = true) {
    const errorObject = {
      status: 400,
    };
    if (typeof val !== "number" && !val && required) {
      throw `${variableName || "Provided variable"} is required.`;
      throw errorObject;
    }
    let inputRegExp = "";
    let valid = false;
    switch (input) {
      case "email":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.toLowerCase().trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }
        inputRegExp = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${
            variableName || "Provided variable"
          }   must be a valid email.`;
          throw errorObject;
        }
        break;

      case "password":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val && required) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }
        inputRegExp =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{4,20}$/;
        valid = inputRegExp.test(val);
        if (!valid && val) {
          throw `${
            variableName || "Provided variable"
          }  must have a small letter, a capital letter, a digit and a special character and must have between 4-20 characters.`;
          throw errorObject;
        }
        break;

      case "name":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }
        if (val.length < 2) {
          throw `${
            variableName || "Provided variable"
          } must not exceed 15 characters.`;
          throw errorObject;
        }

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9. ]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;
      case "coupon_name":
        if (typeof val !== "string") {
          errorObject.message = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }
        if (val.length > 15 || val.length < 2) {
          throw `${
            variableName || "Provided variable"
          } must not exceed 15 characters and must atleast have 2 characters.`;
          throw errorObject;
        }

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9. ][!@#\$%\^&\*]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;

      case "image":
      case "logo":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9. ]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;

      case "proof":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9. ]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;

      case "age":
        if (isNaN(val)) {
          throw `${
            variableName || "Provided variable"
          } must be a valid number.`;
          throw errorObject;
        }
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${variableName || "Provided variable"}   must be a valid Age.`;
          throw errorObject;
        }
        val = parseInt(val);
        if (val < 13 || val > 120) {
          throw `${
            variableName || "Provided variable"
          } must be between 13 and 120.`;
          throw errorObject;
        }
        break;

      case "status":
        if (typeof val !== "number" || isNaN(val)) {
          throw `${
            variableName || "Provided variable"
          } must be a valid number.`;
          throw errorObject;
        }
        if (val < 2 || val > 3) {
          throw `${
            variableName || "Provided variable"
          } must be between 1 and 3.`;
          throw errorObject;
        }
        break;

      case "points":
        if (isNaN(val)) {
          throw `${
            variableName || "Provided variable"
          } must be a valid number.`;
          throw errorObject;
        }
        if (val < 0 || val > 5) {
          throw `${variableName || "Provided variable"}  must be 1 to 5.`;
          throw errorObject;
        }
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        val = parseInt(val);
        if (!valid) {
          throw `${variableName || "Provided variable"}   must be an integer.`;
          throw errorObject;
        }
        break;

      case "description":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }
        if (val.length < 5) {
          throw `${
            variableName || "Provided variable"
          } must have atleast 5 characters.`;
          throw errorObject;
        }
        break;

      case "max_allocation":
        if (isNaN(val)) {
          throw `${
            variableName || "Provided variable"
          } must be a valid number.`;
          throw errorObject;
        }
        if (val <= 0 || val > 50) {
          throw `${
            variableName || "Provided variable"
          } must be between 1 and 50.`;
          throw errorObject;
        }
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          throw `${variableName || "Provided variable"}   must be an integer.`;
          throw errorObject;
        }
        val = parseInt(val);
        break;

      case "id":
      case "coupon_id":
      case "admin_id":
      case "business_id":
      case "proof_id":
      case "customer_id":
        if (typeof val !== "string") {
          throw `${variableName || "Provided variable"} must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          throw `${variableName || "Provided variable"} must not be empty.`;
          throw errorObject;
        }
        break;

      default:
        throw "Invalid Data encountered";
        throw errorObject;
    }
    return val;
  },
};

export default exportedMethods;
