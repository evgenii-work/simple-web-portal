import React, { useContext, useEffect, useRef, useState } from "react";
import AuthService from "../services/auth.service";
import { Box, Heading } from "@chakra-ui/react";
import { Table, Tbody, Tr, Td } from "@chakra-ui/react";
import { ListItem, UnorderedList } from "@chakra-ui/react";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import AppContext from "../app-context.js";
import AuthorizedPage from "./authorized-page.js";
import UserService from "../services/user.service";
import Translate, { translate } from "../components/translate";

export default function ProfilePage(props) {
  const { language, skin } = useContext(AppContext);
  const [user, setUser] = useState({});
  const formikRef = useRef();
  const [message, setMessage] = useState("");
  const toast = useToast();
  const [reqStatus, setReqStatus] = useState(0);

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
  }, []);
  useEffect(() => {
    props.updatePageName("Profile");
  }, [props]);

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const changePassword = async (password) => {
    let newUser = { ...user, password };
    let isMounted = true;
    await UserService.changePassword(newUser).then(
      (response) => {
        if (isMounted) {
          setReqStatus(response.status);
        }
        setMessage("");
        toast({
          description: translate(language, "Password changed"),
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        formikRef.current?.resetForm();
      },
      (error) => {
        if (isMounted) {
          setReqStatus(error.response.status);
        }

        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      }
    );
  };

  return (
    <AuthorizedPage status={reqStatus}>
      <Box w="12rem" m="1rem auto">
        <Heading color="text.200">
          <Translate>Profile</Translate>
        </Heading>
      </Box>
      <Box
        maxW="40rem"
        p="1rem"
        m={{ base: "auto 1rem", lg: "auto" }}
        border="2px solid"
        borderColor="border.100"
        borderRadius="8px"
        bgColor="background.400"
      >
        <Table m="auto" variant="striped" colorScheme={skin.colorScheme}>
          <Tbody>
            <Tr>
              <Td>
                <Translate>Username</Translate>
              </Td>
              <Td>{user.username}</Td>
            </Tr>
            <Tr>
              <Td>
                <Translate>Roles</Translate>
              </Td>
              <Td>
                <UnorderedList>
                  {user &&
                    user.roles &&
                    user.roles.map((role, index) => (
                      <ListItem key={index}>{role}</ListItem>
                    ))}
                </UnorderedList>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <Box mt="1rem" pl="0.1rem">
          <Formik
            innerRef={formikRef}
            initialValues={{
              password: "",
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string()
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
                ),
            })}
            onSubmit={async (values, actions) => {
              await changePassword(values.password);
              actions.setSubmitting(false);
            }}
          >
            <Form>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel htmlFor="password" color="text.300">
                      <Translate>Change password</Translate>
                    </FormLabel>
                    <InputGroup size="md" mt="1rem">
                      <Input
                        {...field}
                        id="password"
                        type={show ? "text" : "password"}
                        placeholder={"********"}
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
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {message && (
                <Alert status="error" m="1rem auto">
                  <AlertIcon />
                  <AlertTitle mr={2}>{message}</AlertTitle>
                </Alert>
              )}
              <Box display="flex">
                <Box w="100%" />
                <Button colorScheme={skin.colorScheme} mt="1rem" type="submit">
                  <Translate>Save</Translate>
                </Button>
              </Box>
            </Form>
          </Formik>
        </Box>
      </Box>
    </AuthorizedPage>
  );
}
