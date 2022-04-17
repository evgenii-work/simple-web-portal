import React, { useContext, useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react";
import AuthorizedPage from "./authorized-page.js";
import AppContext from "../app-context.js";
import UserService from "../services/user.service";

export default function BoardPage(props) {
  const { user } = useContext(AppContext);
  useEffect(() => {
    props.updatePageName("Board");
  }, [props]);

  const [content, setContent] = useState(null);
  useEffect(() => {
    UserService.getBoard().then((response) => {
      setContent(response.data.content);
    });
  }, []);

  if (user) {
    if (!user.roles.includes("user")) {
      return (
        <Box w="20rem" m="5rem auto">
          <Heading color="red.600">ACCESS DENIED!</Heading>
        </Box>
      );
    }
  }

  return (
    <AuthorizedPage status={0}>
      <Box
        p="1rem"
        m="1rem"
        border="2px solid"
        borderColor="border.100"
        borderRadius={"8px"}
        bgColor="background.400"
      >
        <Alert status="success">
          <AlertIcon />
          {!content && <p>This is the board page stub! User auth required.</p>}
          {content}
        </Alert>
      </Box>
    </AuthorizedPage>
  );
}
