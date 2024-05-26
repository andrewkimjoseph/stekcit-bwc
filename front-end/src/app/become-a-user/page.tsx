"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  Image,
  Box,
} from "@chakra-ui/react";

export default function BecomeAUser() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const onClickBtn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return;
  };
  return (
    <main className="flex h-screen flex-col items-center">
      <Heading fontWeight={"normal"}  as="h1" size="lg" noOfLines={1} paddingY={8}>
        Welcome to Stekcit BwC!
      </Heading>
      <Image
        // paddingY={8}
        height={"500px"}
        src="/onboarding.png"
        alt="Dan Abramov"
        paddingBottom={8}
      />

      <Button
        isLoading={isLoading}
        loadingText="Setting Up"
        bgColor={"#EA1845"}
        textColor={"white"}
        onClick={onClickBtn}
        _hover={{
          bgColor: "#6600D5",
          //   color: "black",
        }}
      >
        Get started
      </Button>
      {/* <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        motionPreset="scale"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog> */}
    </main>
  );
}
