import React, { useState } from "react";
import "./App.css";
import axios from "axios";
function App() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    const steps = strongPasswordChecker(e.target.value);
    setResult(steps);
    validatePassword(e.target.value);
  };
  const handleInputSubmit = async (e) => {
    setPassword(e.target.value);
    const steps = strongPasswordChecker(e.target.value);
    try {
      await axios.post("http://localhost:5000/saveResult", { result: steps });
    } catch (error) {
      console.error("Error saving result to MongoDB:", error);
    }
  };
  // Send the result to the server for saving in MongoDB

  const validatePassword = (value) => {
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasMinLength = value.length >= 6;
    const hasMaxLength = value.length <= 20;

    setErrors({
      hasLowerCase: !hasLowerCase,
      hasUpperCase: !hasUpperCase,
      hasDigit: !hasDigit,
      hasMinLength: !hasMinLength,
      hasMaxLength: !hasMaxLength,
    });
  };

  return (
    <div className="password-checker-container">
      <h2>Password Strength Checker</h2>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={handleInputChange}
          className={
            errors.hasLowerCase ||
            errors.hasUpperCase ||
            errors.hasDigit ||
            errors.hasMinLength
              ? "error"
              : ""
          }
        />
      </label>
      {errors.hasLowerCase && (
        <p className="error-message">
          Password must contain at least one lowercase letter
        </p>
      )}
      {errors.hasUpperCase && (
        <p className="error-message">
          Password must contain at least one uppercase letter
        </p>
      )}
      {errors.hasDigit && (
        <p className="error-message">
          Password must contain at least one digit
        </p>
      )}
      {errors.hasMinLength && (
        <p className="error-message">
          Password must contain at least 6 characters
        </p>
      )}
      {errors.hasMaxLength && (
        <p className="error-message">
          Password must contain less than 20 characters
        </p>
      )}
      {result !== null && (
        <div>
          <h3>Result:</h3>
          <p>Minimum steps required: {result}</p>
        </div>
      )}
      <button onClick={handleInputSubmit}>Submit</button>
    </div>
  );
}

export default App;

// Function to calculate the minimum number of steps to make the password strong
function strongPasswordChecker(password) {
  // Define conditions for a strong password
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);

  // Calculate the missing conditions for a strong password
  const missingConditions =
    (hasLowerCase ? 0 : 1) + (hasUpperCase ? 0 : 1) + (hasDigit ? 0 : 1);

  // Check the length of the password
  const length = password.length;
  let steps = 0;

  // Case 1: Password length is less than 6
  if (length < 6) {
    steps = Math.max(6 - length, missingConditions);

    // Case 2: Password length is between 6 and 20
  } else if (length <= 20) {
    steps = missingConditions;

    // Case 3: Password length is greater than 20
  } else {
    const deleteCount = length - 20;

    // Calculate steps for deleting repeated characters
    let repeatDeletion = 0;
    let i = 0;

    while (i < length) {
      const repeatLen = getRepeatLength(password, i);
      repeatDeletion += Math.floor(repeatLen / 3);
      i += repeatLen;
    }

    // Use Math.max to prioritize deletion over insertion
    steps = Math.max(deleteCount, missingConditions, repeatDeletion);
  }

  return steps;
}

// Helper function to find the length of repeated characters
function getRepeatLength(s, start) {
  let i = start + 1;

  while (i < s.length && s[i] === s[start]) {
    i++;
  }

  return i - start;
}
