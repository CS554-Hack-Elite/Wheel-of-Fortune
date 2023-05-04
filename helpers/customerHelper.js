import { ObjectId } from "mongodb";

//common function to check all input parameters for both route and data
const exportedMethods = {
  checkInput(input, val, variableName, routeFlag = false, required = true) {
    const errorObject = {
      status: 400,
    };
    if (!val && required) {
      errorObject.error = `${variableName || "Provided variable"} is required.`;
      throw errorObject;
    }
    let inputRegExp = "";
    let valid = false;
    switch (input) {
      case "email":
        if (typeof val !== "string") {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.toLowerCase().trim();
        if (!val) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must not be empty.`;
          throw errorObject;
        }
        inputRegExp = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid email.`;
          throw errorObject;
        }
        break;

      case "password":
        if (typeof val !== "string") {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val && required) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must not be empty.`;
          throw errorObject;
        }
        inputRegExp =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{4,20}$/;
        valid = inputRegExp.test(val);
        if (!valid && val) {
          errorObject.error = `${
            variableName || "Provided variable"
          }  must have a small letter, a capital letter, a digit and a special character and must have between 4-20 characters.`;
          throw errorObject;
        }
        break;

      case "name":
        if (typeof val !== "string") {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must not be empty.`;
          throw errorObject;
        }

      case "logo":
        if (typeof val !== "string") {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must not be empty.`;
          throw errorObject;
        }

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9 ]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;

      case "age":
        if (routeFlag) {
          inputRegExp = /^[0-9]+$/;
          valid = inputRegExp.test(val);
          if (!valid) {
            errorObject.error = `${
              variableName || "Provided variable"
            }   must be a valid Age.`;
            throw errorObject;
          }

          val = parseInt(val);
        }

        if (isNaN(val)) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Age.`;
          throw errorObject;
        }

        if (val < 13 || val > 120) {
          errorObject.error = `${
            variableName || "Provided variable"
          }  must be a valid Age.`;
          throw errorObject;
        }
        break;

      case "id":
        if (typeof val !== "string") {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must not be empty.`;
          throw errorObject;
        }
        if (!ObjectId.isValid(val)) {
          throw "Invalid Customer.";
        }
        break;
      case "business_id":
        if (typeof val !== "string") {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a string.`;
          throw errorObject;
        }
        val = val.trim();
        if (!val) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must not be empty.`;
          throw errorObject;
        }
        if (!ObjectId.isValid(val)) {
          throw "Invalid Business Id.";
        }
        break;

      default:
        errorObject.error = "Invalid Data encountered";
        throw errorObject;
    }
    return val;
  },
};

export default exportedMethods;
