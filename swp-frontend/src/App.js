import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import Layout from "./components/layout.js";
import HomePage from "./pages/home-page.js";
import LoginPage from "./pages/login-page.js";
import LogoutPage from "./pages/logout-page.js";
import RegisterPage from "./pages/register-page.js";
import ProfilePage from "./pages/profile-page.js";
import BoardPage from "./pages/board-page.js";
import AdminPage from "./pages/admin-page.js";

import AppService from "./services/app.service";
import AuthService from "./services/auth.service";
import SkinService from "./services/skin.service";
import AppContext from "./app-context.js";

const isUsersEqual = (u1, u2) => {
  if (!u1 || !u2) return false;
  if (
    u1.username !== u2.username ||
    u1.id !== u2.id ||
    u1.accessToken !== u2.accessToken ||
    u1.refreshToken !== u2.refreshToken
  ) {
    return false;
  }
  if (
    u1.roles.length !== u2.roles.length ||
    !u1.roles.every((value, index) => value === u2.roles[index])
  ) {
    return false;
  }
  return true;
};

function App() {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [language, setLanguage] = useState(AppService.getLanguage());
  const [skin, setSkin] = useState(SkinService.getSkin());
  const [pageName, setPageName] = useState("Home");

  let location = useLocation();

  const theme = extendTheme({ colors: skin.colors });

  const updatePageName = (newPageName) => {
    setPageName(newPageName);
  };

  const changeUser = useCallback(() => {
    let newUser = AuthService.getCurrentUser();
    if (!isUsersEqual(user, newUser)) {
      setUser(newUser);
    }
  }, [user]);

  useEffect(() => {
    changeUser();
  }, [changeUser, location]);

  useEffect(() => {
    SkinService.saveSkin(skin.id);
  }, [skin]);

  useEffect(() => {
    AppService.saveLanguage(language);
  }, [language]);

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider
        value={{ language, skin, user, setLanguage, setSkin, changeUser }}
      >
        <Layout pageName={pageName}>
          <Routes>
            <Route
              exact
              path="/"
              element={<HomePage updatePageName={updatePageName} />}
            />
            <Route
              exact
              path="/board"
              element={<BoardPage updatePageName={updatePageName} />}
            />
            <Route
              exact
              path="/login"
              element={<LoginPage updatePageName={updatePageName} />}
            />
            <Route
              exact
              path="/logout"
              element={<LogoutPage updatePageName={updatePageName} />}
            />
            <Route
              exact
              path="/signup"
              element={<RegisterPage updatePageName={updatePageName} />}
            />
            <Route
              exact
              path="/profile"
              element={<ProfilePage updatePageName={updatePageName} />}
            />
            <Route
              exact
              path="/admin"
              element={<AdminPage updatePageName={updatePageName} />}
            />
          </Routes>
        </Layout>
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default App;
