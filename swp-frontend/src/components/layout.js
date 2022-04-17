import React, { useContext, useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";

import AppContext from "../app-context.js";
import LayoutLink from "./layout-link.js";
import AppService from "../services/app.service";
import SkinService from "../services/skin.service";
import Translate from "../components/translate";

export default function Layout(props) {
  const { language, setLanguage, skin, user, setSkin } = useContext(AppContext);
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsUser(user && user.roles.includes("user"));
    setIsAdmin(user && user.roles.includes("admin"));
  }, [user]);

  return (
    <Box bgColor="background.100" display="flex" flexDir="column" minH="100vh">
      <Box
        w={{ base: "100%", lg: "60rem" }}
        m="auto"
        bgColor="background.200"
        minH="100vh"
      >
        <Box
          pl="1rem"
          minH="5rem"
          bgColor="background.300"
          display="flex"
          flexWrap="wrap"
          position="sticky"
          top="0"
          zIndex="1"
        >
          <Box m="auto">
            <LayoutLink
              key="Home"
              name="Home"
              selected={props.pageName}
              to="/"
            />
          </Box>
          {(isUser || isAdmin) && (
            <Box m="auto">
              <LayoutLink
                key="Board"
                name="Board"
                selected={props.pageName}
                to="/board"
              />
            </Box>
          )}
          {isAdmin && (
            <Box m="auto">
              <LayoutLink
                key="Admin"
                name="Admin"
                selected={props.pageName}
                to="/admin"
              />
            </Box>
          )}
          <Box flex="1" />
          <IconButton
            m="auto"
            mr="0.5rem"
            icon={skin.icon}
            size="sm"
            color={skin.colorScheme}
            onClick={() => {
              setSkin(SkinService.getNextSkin());
            }}
          />
          <Button
            m="auto"
            mr="1rem"
            size="sm"
            color={skin.colorScheme}
            onClick={() => {
              setLanguage(AppService.getNextLanguage());
            }}
          >
            <Translate>{language}</Translate>
          </Button>
          {user && (
            <Box m="auto">
              <LayoutLink
                name="Profile"
                selected={props.pageName}
                label={user.username}
                to={"/profile"}
              />
            </Box>
          )}
          {user && (
            <Box m="auto 1rem">
              <LayoutLink
                name="Logout"
                selected={props.pageName}
                to={"/logout"}
              />
            </Box>
          )}
          {!user && (
            <Box m="auto">
              <LayoutLink
                name="Login"
                selected={props.pageName}
                to={"/login"}
              />
            </Box>
          )}
          {!user && (
            <Box m="auto">
              <LayoutLink
                name="Signup"
                selected={props.pageName}
                label="Sign&nbsp;Up"
                to={"/signup"}
              />
            </Box>
          )}
        </Box>
        <Box>{props.children}</Box>
      </Box>
    </Box>
  );
}
