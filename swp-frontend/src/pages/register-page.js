import React, { useEffect } from "react";
import AuthService from "../services/auth.service";
import BaseLoginPage from "./base-login-page.js";

export default function RegisterPage(props) {
  useEffect(() => {
    props.updatePageName("Signup");
  }, [props]);

  return (
    <BaseLoginPage
      authAction={AuthService.register}
      dstUrl="/profile"
      submitButtonName={"Sign Up"}
      successMessage="Account created"
    />
  );
}
