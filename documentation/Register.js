import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../Components/Header";
import InputGroup from "../../Components/InputGroup";
import Button from "../../Components/Button";

import { ApiPostUser } from "../../Utilitites/Api";
import { auth } from "../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function onCaptchaVerify() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          onRegisterOtpHandler();
        },
      },
      auth
    );
  }
}

function onRegisterOtpHandler() {
  console.log("here 1");
  onCaptchaVerify();

  console.log("here 2");
  const appVerifier = window.recaptchaVerifier;

  const phoneNumber = "+639060272089";
  console.log("here 3", phoneNumber);
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      alert("otp sent!");
      console.log("here 4");
      // ...
    })
    .catch((error) => {
      console.log("here 5", error);
      // Error; SMS not sent
      // ...
    });
  console.log("here 6");
}

function onOtpVerify() {
  const otp = "123123";
  window.confirmationResult
    .confirm(otp)
    .then(async (res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
}

function Register() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
  });

  const onChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    switch (name) {
      case "fullname":
        setFormValues((state) => ({ ...state, fullname: value }));
        setFormErrors((state) => ({ ...state, fullname: "" }));
        break;
      case "email":
        setFormValues((state) => ({ ...state, email: value }));
        setFormErrors((state) => ({ ...state, email: "" }));
        break;
      case "password":
        setFormValues((state) => ({ ...state, password: value }));
        setFormErrors((state) => ({ ...state, password: "" }));
        break;
      case "confirm":
        setFormValues((state) => ({ ...state, confirm: value }));
        setFormErrors((state) => ({ ...state, confirm: "" }));
        break;
      default:
        break;
    }
  };

  const onRegisterHandler = async (e) => {
    e.preventDefault();

    if (formValues.fullname === "")
      setFormErrors((state) => ({
        ...state,
        fullname: "Fullname is required.",
      }));
    if (formValues.email === "")
      setFormErrors((state) => ({
        ...state,
        email: "Email is required.",
      }));
    if (formValues.password === "")
      setFormErrors((state) => ({
        ...state,
        password: "Password is required.",
      }));
    if (formValues.confirm === "")
      setFormErrors((state) => ({
        ...state,
        confirm: "Confirm password is required.",
      }));

    if (
      formValues.fullname !== "" &&
      formValues.email !== "" &&
      formValues.password !== "" &&
      formValues.confirm !== ""
    ) {
      /* email validation */
      const apos = formValues.email.indexOf("@");
      const dotpos = formValues.email.lastIndexOf(".");
      if (apos < 1 || dotpos - apos < 2) {
        alert("Invalid email.");
        return;
      }
      if (formValues.password !== formValues.confirm) {
        alert("Confirm password does not match.");
        return;
      } else {
        await ApiPostUser(formValues).then((res) => {
          if (res.status === "ok") {
            navigate("/register-success");
          } else {
            alert(res.message);
            return;
          }
        });
      }
    }
  };

  return (
    <div>
      <div className="main">
        <div id="recaptcha-container"></div>
        <Header text="Register" />
        <InputGroup
          type="text"
          label="Full Name"
          name="fullname"
          placeholder="Anne Hunter"
          value={formValues.fullname}
          error={formErrors.fullname}
          onChangeHandler={onChangeHandler}
        />
        <InputGroup
          type="text"
          label="Email"
          name="email"
          placeholder="anne@hunter@mail.com"
          value={formValues.email}
          error={formErrors.email}
          onChangeHandler={onChangeHandler}
        />
        <InputGroup
          type="password"
          label="Password"
          name="password"
          placeholder="******"
          value={formValues.password}
          error={formErrors.password}
          onChangeHandler={onChangeHandler}
        />
        <InputGroup
          type="password"
          label="Confirm Password"
          name="confirm"
          placeholder="******"
          value={formValues.confirm}
          error={formErrors.confirm}
          onChangeHandler={onChangeHandler}
        />
        <p className="formError">{formErrors.form}</p>
        <Button
          name="register"
          text="Register"
          variant="light"
          // link="/register-success"
          className={"btn-cyan"}
          // onClick={onRegisterHandler}
          onClick={onRegisterOtpHandler}
        />
      </div>
    </div>
  );
}

export default Register;
