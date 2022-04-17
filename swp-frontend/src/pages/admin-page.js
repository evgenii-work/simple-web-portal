import React, { useContext, useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import AuthorizedPage from "./authorized-page.js";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import AppContext from "../app-context.js";
import AdminUserTab from "../components/admin-user-tab";
import SkinService from "../services/skin.service.js";
import Translate from "../components/translate";

export default function AdminPage(props) {
  const { user } = useContext(AppContext);
  const [reqStatus, setReqStatus] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    props.updatePageName("Admin");
  }, [props]);

  if (user) {
    if (!user.roles.includes("admin")) {
      return (
        <Box w="20rem" m="5rem auto">
          <Heading color="red.600">ACCESS DENIED!</Heading>
        </Box>
      );
    }
  }

  const updateUI = () => {
    setReqStatus(0);
    setUpdateTrigger(updateTrigger + 1);
  };

  return (
    <AuthorizedPage key={updateTrigger} status={reqStatus} update={updateUI}>
      <Tabs variant="enclosed" colorScheme={SkinService.colorScheme} m="1rem">
        <TabList>
          <Tab>
            <Translate>Users</Translate>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AdminUserTab setReqStatus={setReqStatus} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AuthorizedPage>
  );
}
