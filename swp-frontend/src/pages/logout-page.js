import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

export default function LogoutPage(props) {
  AuthService.logout();
  let navigate = useNavigate();
  useEffect(() => {
    props.updatePageName("Logout");
  }, [props]);

  useEffect(() => {
    navigate("/");
  }, []);

  return <div />;
}
