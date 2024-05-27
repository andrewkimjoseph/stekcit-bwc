"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Heading,
  Spinner,
  useDisclosure,
  Image,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Alert,
  AlertDescription,
  AlertIcon,
} from "@chakra-ui/react";
import { createUser } from "@/services/createUser";
import { useAccount } from "wagmi";
import { SuiteContext } from "node:test";
import { checkIfUserExists } from "@/services/checkIfUserExists";
import { useRouter } from "next/navigation";

export default function BecomeAUser() {
  const router = useRouter();

  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [isGettingStarted, setIsGettingStarted] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [emailAddressInput, setEmailAddressInput] = useState("");

  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
      }
    };

    checkIfUserExistsAndSet();
  }, [address, userExists, router]);

  const handleUsernameInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    return setUsernameInput(e.target.value);
  };

  const handleEmailAddressInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    return setEmailAddressInput(e.target.value);
  };

  const onClickGetStarted = () => {
    onOpen();
    setIsGettingStarted(true);
    return;
  };

  const validateInput = () => {
    const isUsernameValid = usernameInput.length > 6;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddressInput);

    if (isUsernameValid && isEmailValid) {
      return true;
    } else if (!isUsernameValid && !isEmailValid) {
      setErrorMessage(
        "Username must be more than 6 characters and email must be valid."
      );
      setShowErrorAlert(true);
    } else if (!isUsernameValid) {
      setErrorMessage("Username must be more than 6 characters.");
      setShowErrorAlert(true);
    } else if (!isEmailValid) {
      setErrorMessage("Email must be valid.");
      setShowErrorAlert(true);
    }
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 3000);
    return false;
  };

  const onClickCreateUser = async () => {
    const inputIsValidated = validateInput();

    if (inputIsValidated) {
      setIsCreatingUser(true);

      const isUserCreated = await createUser(address, {
        _username: usernameInput,
        _emailAddress: emailAddressInput,
      });

      if (isUserCreated) {
        setIsCreatingUser(false);
        onModalDismissed();
        setSuccessMessage("User created successfully");
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      } else {
        setIsCreatingUser(false);
        onModalDismissed();
        setErrorMessage("User creation failed");
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 3000);
      }
    }

    return;
  };

  const onModalDismissed = () => {
    onClose();
    setIsGettingStarted(false);
    return;
  };

  return (
    <main className="flex h-screen flex-col items-center">
      <Heading
        fontWeight={"normal"}
        as="h1"
        size="lg"
        noOfLines={1}
        paddingY={8}
      >
        Welcome to Stekcit BwC!
      </Heading>

      {userExists ? (
        <Heading
          fontWeight={"normal"}
          as="h2"
          size="sm"
          noOfLines={1}
          paddingBottom={2}
        >
          You are already a user 🎉!
        </Heading>
      ) : null}

      <Image
        // paddingY={8}
        height={"300px"}
        src="/onboarding.png"
        alt="Dan Abramov"
        paddingBottom={8}
      />

      {userExists ? (
        <Button
          onClick={() => router.push("/")}
          bgColor={"#EA1845"}
          textColor={"white"}
          _hover={{
            bgColor: "#6600D5",
            //   color: "black",
          }}
        >
          Go home
        </Button>
      ) : (
        <Button
          onClick={onClickGetStarted}
          isLoading={isGettingStarted}
          loadingText="Setting Up"
          bgColor={"#EA1845"}
          textColor={"white"}
          _hover={{
            bgColor: "#6600D5",
            //   color: "black",
          }}
        >
          Get started
        </Button>
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onModalDismissed}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Become a User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                ref={initialRef}
                onChange={handleUsernameInputChange}
                placeholder="e.g. andrewkimjoseph"
                type="text"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="e.g. youremail@gmail.com"
                type="email"
                onChange={handleEmailAddressInputChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onClickCreateUser}
              isLoading={isCreatingUser}
              mr={3}
              loadingText="Creating User"
              bgColor={"#EA1845"}
              textColor={"white"}
              _hover={{
                bgColor: "#6600D5",
                //   color: "black",
              }}
            >
              Create user
            </Button>
            {/* <Button onClick={onModalDismissed}>Cancel</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showErrorAlert ? (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {showSuccessAlert ? (
        <Alert status="success">
          <AlertIcon />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}
    </main>
  );
}
