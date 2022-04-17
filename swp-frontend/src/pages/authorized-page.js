import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import authVerify from "../services/auth-verify";
import AppContext from "../app-context.js";

const HTTP_UNAUTHORIZED = 401;

export default function AuthorizedPage(props) {
  const { changeUser } = useContext(AppContext);
  const [userProfile, setUserProfile] = useState(null);

  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    const trySilentLogin = async () => {
      let newUserProfile = AuthService.getCurrentUser();
      if (newUserProfile) {
        let newUserProfile = await AuthService.silentLogin();
        if (!newUserProfile) {
          navigate("/login");
        } else {
          changeUser();
          if (props.update) props.update();
        }
      }
    };
    if (props.status === HTTP_UNAUTHORIZED) {
      trySilentLogin();
    }
  }, [navigate, props, changeUser]);

  useEffect(() => {
    async function updateUserProfile() {
      let newUserProfile = AuthService.getCurrentUser();
      if (!newUserProfile) {
        navigate("/login");
      }
      if (newUserProfile && !authVerify()) {
        let newUserProfile = await AuthService.silentLogin();
        if (!newUserProfile) {
          navigate("/login");
        } else {
          changeUser();
          if (props.update) props.update();
        }
      }
      setUserProfile(newUserProfile);
    }
    updateUserProfile();
  }, [navigate, location, props, changeUser]);

  if ((!userProfile && !props.reversed) || (userProfile && props.reversed)) {
    return <div />;
  }
  return <div>{props.children}</div>;
}
