import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import AdminService from "../services/admin.service";
import { ListItem, UnorderedList } from "@chakra-ui/react";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import AppContext from "../app-context.js";
import UserDeleteDialog from "./user-delete-dialog.js";
import UserEditPage from "./user-edit-page.js";
import Translate from "../components/translate";

export default function AdminUserTab(props) {
  const { skin } = useContext(AppContext);
  const [userList, setUserList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestStatus, setRequestStatus] = useState(0);

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  useEffect(() => {
    let isMounted = true;
    if (requestStatus === 0) {
      AdminService.getUserList()
        .then((response) => {
          if (isMounted) {
            setRequestStatus(response.status);
            setUserList(response.data.users);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setRequestStatus(error.response.status);
            props.setReqStatus(error.response.status);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [props, requestStatus]);

  const onCloseModal = () => {
    setRequestStatus(0);
    onClose();
  };

  const onCloseModalDelete = () => {
    setRequestStatus(0);
    onCloseDelete();
  };

  const onCloseModalAdd = () => {
    setRequestStatus(0);
    onCloseAdd();
  };

  return (
    <Box>
      <Box w="16rem" m="1rem auto">
        <Heading color="text.200">
          <Translate>Users</Translate>
        </Heading>
      </Box>
      <Box
        maxW="50rem"
        p="1rem"
        m="auto"
        border="2px solid"
        borderColor="border.100"
        borderRadius="8px"
        bgColor="background.400"
      >
        <UserEditPage
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onCloseModal}
          user={selectedUser}
          setReqStatus={props.setReqStatus}
        />
        <UserDeleteDialog
          onOpen={onOpenDelete}
          isOpen={isOpenDelete}
          onClose={onCloseModalDelete}
          user={selectedUser}
          setReqStatus={props.setReqStatus}
        />
        <UserEditPage
          onOpen={onOpenAdd}
          isOpen={isOpenAdd}
          onClose={onCloseModalAdd}
          isNewUser
          user={{ id: -1, username: "", roles: [] }}
          setReqStatus={props.setReqStatus}
        />
        <Button colorScheme={skin.colorScheme} onClick={onOpenAdd} mb="1rem">
          <Translate>Add user</Translate>
        </Button>
        <Table
          m="auto"
          variant="striped"
          colorScheme={skin.colorScheme}
          size="sm"
        >
          <Thead>
            <Tr>
              <Th>
                <Translate>ID</Translate>
              </Th>
              <Th overflowWrap="anywhere">
                <Translate>Name</Translate>
              </Th>
              <Th overflowWrap="anywhere">
                <Translate>Roles</Translate>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {userList.map((u, uidx) => (
              <Tr key={uidx}>
                <Td color="text.300">{u.id}</Td>
                <Td color="text.300" overflowWrap="anywhere">
                  {u.username}
                </Td>
                <Td color="text.300">
                  <UnorderedList>
                    {u &&
                      u.roles &&
                      u.roles.sort().map((role, index) => (
                        <ListItem key={index} overflowWrap="anywhere">
                          {role}
                        </ListItem>
                      ))}
                  </UnorderedList>
                </Td>
                <Td>
                  <Stack direction={{ base: "column", sm: "row" }}>
                    <IconButton
                      m="auto"
                      icon={<EditIcon />}
                      size="sm"
                      color={skin.colorScheme}
                      onClick={() => {
                        setSelectedUser(u);
                        onOpen();
                      }}
                    />
                    <IconButton
                      m="auto"
                      icon={<DeleteIcon />}
                      size="sm"
                      color="red.400"
                      onClick={() => {
                        setSelectedUser(u);
                        onOpenDelete();
                      }}
                    />
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
