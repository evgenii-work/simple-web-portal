import React, { useContext } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

import AppContext from "../app-context.js";
import AdminService from "../services/admin.service";
import Translate, { translate } from "../components/translate";
import { getRequestErrorMessage } from "../utils";

export default function UserDeleteDialog(props) {
  const { language, skin } = useContext(AppContext);
  const cancelRef = React.useRef();
  const toast = useToast();

  const deleteUser = async () => {
    let isMounted = true;
    try {
      await AdminService.deleteUser(props.user.id).then((response) => {
        toast({
          description: translate(language, "User deleted"),
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      });
    } catch (error) {
      let requestErrorMessage = getRequestErrorMessage(error);
      toast({
        description: translate(language, requestErrorMessage),
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      if (isMounted) {
        props.setReqStatus(error.response.status);
      }
    }
    props.onClose();
  };

  return (
    <>
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <Translate>Delete User</Translate>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Translate>
                Are you sure? You can't undo this action afterwards.
              </Translate>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={props.onClose}
                colorScheme={skin.colorScheme}
                variant="outline"
              >
                <Translate>Cancel</Translate>
              </Button>
              <Button colorScheme="red" onClick={deleteUser} ml={3}>
                <Translate>Delete</Translate>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
