import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, Checkbox, Stack } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import AppContext from "../app-context.js";
import AdminService from "../services/admin.service";
import Translate, { translate } from "../components/translate";
import { getRequestErrorMessage } from "../utils";

export default function UserEditPage(props) {
  const { language, skin } = useContext(AppContext);
  const [state, setState] = useState({ isAdmin: false });
  const [message, setMessage] = useState("");
  const formikRef = useRef();
  const [passwordVerification, setPasswordVerification] = useState(
    Yup.string().nullable()
  );
  const toast = useToast();

  useEffect(() => {
    let newPasswordVerification = Yup.string()
      .nullable()
      .min(
        8,
        translate(
          language,
          "Password is too short - should be 8 chars minimum."
        )
      )
      .max(
        40,
        translate(
          language,
          "Password is too long - should be 40 chars maximum."
        )
      )
      .matches(
        /(?=.*[0-9])/,
        translate(language, "Password must contain a number.")
      );
    if (props.isNewUser) {
      newPasswordVerification = newPasswordVerification.required(
        translate(language, "Required")
      );
    }
    setPasswordVerification(newPasswordVerification);
  }, [language, props.isNewUser]);

  useEffect(() => {
    if (props.user) {
      let isAdmin = props.user.roles.includes("admin");
      let isModerator = props.user.roles.includes("moderator");
      let isUser = props.user.roles.includes("user");
      setState((currentState) => {
        return { ...currentState, isAdmin, isModerator, isUser };
      });
    }
  }, [props.user]);

  const saveUser = async (username, password) => {
    let newRoles = [];
    if (state.isAdmin) {
      newRoles.push("admin");
    }
    if (state.isModerator) {
      newRoles.push("moderator");
    }
    if (state.isUser) {
      newRoles.push("user");
    }
    let newUser = {
      ...props.user,
      roles: newRoles,
      username: username,
      password: password,
    };

    let func = AdminService.updateUser;
    if (props.isNewUser) func = AdminService.createUser;
    func.bind(AdminService);
    let isMounted = true;

    await func(newUser).then(
      (response) => {
        setMessage("");
        formikRef.current?.resetForm();
        toast({
          description: translate(language, "User saved"),
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        props.onClose();
      },
      (error) => {
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
    );
    return () => {
      isMounted = false;
    };
  };

  const closeDialog = () => {
    setMessage("");
    formikRef.current?.resetForm();
    props.onClose();
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <>
      <Modal
        colorScheme={skin.colorScheme}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalOverlay color={skin.colorScheme} />
        <ModalContent>
          <ModalHeader>{props.user && props.user.username}</ModalHeader>
          <ModalCloseButton color={skin.colorScheme} />
          <ModalBody>
            <Formik
              key={language}
              innerRef={formikRef}
              initialValues={{
                username: props.user && props.user.username,
                password: "",
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string()
                  .required(translate(language, "Required"))
                  .min(
                    3,
                    translate(
                      language,
                      "Username is too short - should be 3 chars minimum."
                    )
                  )
                  .max(
                    20,
                    translate(
                      language,
                      "Username is too long - should be 20 chars maximum."
                    )
                  ),
                password: passwordVerification,
              })}
              onSubmit={async (values, actions) => {
                await saveUser(values.username, values.password);
                actions.setSubmitting(false);
              }}
            >
              <Form>
                <Field name="username">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.username && form.touched.username}
                    >
                      <FormLabel htmlFor="username" color="text.300">
                        <Translate>Username</Translate>
                      </FormLabel>
                      <Input
                        {...field}
                        id="username"
                        placeholder={translate(language, "Enter username")}
                      />
                      <FormErrorMessage>
                        {form.errors.username}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Stack spacing={5} m="1rem auto">
                  <Checkbox
                    colorScheme="red"
                    isChecked={state.isAdmin}
                    onChange={(e) =>
                      setState({ ...state, isAdmin: e.target.checked })
                    }
                  >
                    <Translate>Administrator</Translate>
                  </Checkbox>
                  <Checkbox
                    colorScheme={skin.colorScheme}
                    isChecked={state.isModerator}
                    onChange={(e) =>
                      setState({ ...state, isModerator: e.target.checked })
                    }
                  >
                    <Translate>Moderator</Translate>
                  </Checkbox>
                  <Checkbox
                    colorScheme={skin.colorScheme}
                    isChecked={state.isUser}
                    onChange={(e) =>
                      setState({ ...state, isUser: e.target.checked })
                    }
                  >
                    <Translate>User</Translate>
                  </Checkbox>
                </Stack>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                    >
                      <FormLabel htmlFor="password" color="text.300">
                        <Translate>Password</Translate>
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          {...field}
                          pr="4.5rem"
                          type={show ? "text" : "password"}
                          placeholder="********"
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleClick}
                            colorScheme={skin.colorScheme}
                          >
                            {show ? (
                              <Translate>Hide</Translate>
                            ) : (
                              <Translate>Show</Translate>
                            )}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                {message && (
                  <Alert status="error" m="1rem auto">
                    <AlertIcon />
                    <AlertTitle mr={2}>{message}</AlertTitle>
                  </Alert>
                )}
                <Stack direction="row" mt="1rem">
                  <Box w="100%" />
                  <Button
                    colorScheme={skin.colorScheme}
                    mr={3}
                    type="submit"
                    p="0 1.5rem"
                  >
                    <Translate>Save</Translate>
                  </Button>
                  <Button
                    colorScheme={skin.colorScheme}
                    mr={3}
                    variant="outline"
                    onClick={closeDialog}
                    p="0 1.5rem"
                  >
                    <Translate>Close</Translate>
                  </Button>
                </Stack>
              </Form>
            </Formik>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
