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
  useToast,
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

  const toast = useToast();

  const [isGettingStarted, setIsGettingStarted] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");

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
  const showErrorToast = (description: string) => {
    setIsGettingStarted(true);
    return toast({
      description: description,
      status: "error",
      duration: 9000,
      isClosable: true,
      position:"top"
    });
  };

  const showSuccessToast = (description: string) => {
    setIsGettingStarted(true);
    return toast({
      description: description,
      status: "success",
      duration: 9000,
      isClosable: true,
      position:"top"
    });
  };

  const validateInput = () => {
    const isUsernameValid = usernameInput.length > 6;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddressInput);

    if (isUsernameValid && isEmailValid) {
      return true;
    } else if (!isUsernameValid && !isEmailValid) {
      showErrorToast("Username must be more than 6 characters and email must be valid");
    } else if (!isUsernameValid) {
      showErrorToast("Username must be more than 6 characters");
    } else if (!isEmailValid) {
      showErrorToast("Email must be valid");
    }
    return false;
  };

  const onModalDismissed = () => {
    onClose();
    setIsGettingStarted(false);
    return;
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
        showSuccessToast("User created successfully");
        setUsernameInput("");
        setEmailAddressInput("");
        onModalDismissed();
      } else {
        showErrorToast("User creation failed");
        setUsernameInput("");
        setEmailAddressInput("");
        onModalDismissed();
        showErrorToast("User creation failed");
      }
    }

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
        isCentered
        closeOnOverlayClick={false}
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
    </main>
  );
}
