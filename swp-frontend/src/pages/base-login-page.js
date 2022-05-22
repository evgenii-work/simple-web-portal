import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import AppContext from "../app-context.js";
import Translate, { translate } from "../components/translate";

export default function BaseLoginPage({
  authAction,
  dstUrl,
  submitButtonName,
  successMessage,
}) {
  const { language, skin } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleClick = () => setShowPassword(!showPassword);

  return (
    <Box
      maxW="20rem"
      bgColor="background.400"
      border="2px solid"
      borderColor="border.100"
      borderRadius={"8px"}
      m="5rem auto 5rem auto"
    >
      <Box display="flex" flexDir={"column"}>
        <Box m="3rem 1rem 1rem 1rem">
          <Formik
            key={language}
            initialValues={{ username: "", password: "" }}
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
              password: Yup.string()
                .required(translate(language, "No password provided."))
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
            onSubmit={(values, actions) => {
              authAction(values.username, values.password).then(
                () => {
                  setMessage("");
                  if (successMessage) {
                    toast({
                      description: translate(language, successMessage),
                      status: "success",
                      duration: 2500,
                      isClosable: true,
                    });
                  }
                  if (!dstUrl) {
                    navigate(-1);
                  } else {
                    navigate(dstUrl);
                  }
                },
                (error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  setMessage(resMessage);
                }
              );
              actions.setSubmitting(false);
            }}
          >
            {(props) => (
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
                        autoComplete="false"
                      />
                      <FormErrorMessage>
                        {form.errors.username}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          autoComplete="false"
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleClick}
                            colorScheme={skin.colorScheme}
                          >
                            {showPassword ? (
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
                <Button
                  mt={4}
                  colorScheme={skin.colorScheme}
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  <Translate>{submitButtonName}</Translate>
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}
