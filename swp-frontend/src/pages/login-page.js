import React, { useEffect } from "react";
import AuthService from "../services/auth.service";
import BaseLoginPage from "./base-login-page.js";

export default function LoginPage(props) {
  useEffect(() => {
    props.updatePageName("Login");
  }, [props]);

  return (
    <BaseLoginPage authAction={AuthService.login} submitButtonName={"Login"} />
  );
}
