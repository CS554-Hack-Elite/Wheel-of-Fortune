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

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9. ]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;
      case "proof":
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

        inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9. ]*$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Name.`;
          throw errorObject;
        }
        break;

      case "age":
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Age.`;
          throw errorObject;
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

      case "status":
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a valid status.`;
          throw errorObject;
        }
        if (isNaN(val)) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid status.`;
          throw errorObject;
        }

        if (val < 1 || val > 3) {
          errorObject.error = `${
            variableName || "Provided variable"
          }  must be a valid status.`;
          throw errorObject;
        }
        break;

      case "points":
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          } must be a valid points.`;
          throw errorObject;
        }
        if (isNaN(val)) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid points.`;
          throw errorObject;
        }

        if (val < 0) {
          errorObject.error = `${
            variableName || "Provided variable"
          }  must be a valid points.`;
          throw errorObject;
        }
        break;

      case "description":
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
          }   must be a valid description.`;
          throw errorObject;
        }
        break;

      case "image":
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
          }   must be a valid image url.`;
          throw errorObject;
        }
        break;
      case "max_allocation":
        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Number.`;
          throw errorObject;
        }
        if (isNaN(val)) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Number.`;
          throw errorObject;
        }
        break;
      case "id":
      case "coupon_id":
      case "admin_id":
      case "business_id":
      case "proof_id":
      case "customer_id":
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
          throw "Invalid Id.";
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