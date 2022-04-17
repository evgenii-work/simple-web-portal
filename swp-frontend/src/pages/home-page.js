import React, { useContext, useEffect } from "react";
import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react";
import AuthorizedPage from "./authorized-page.js";

export default function BoardPage(props) {
  useEffect(() => {
    props.updatePageName("Home");
  }, [props]);


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
          This is a home page stub! No auth required.
        </Alert>
      </Box>
    </AuthorizedPage>
  );
}
