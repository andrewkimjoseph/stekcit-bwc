"use client";

import { checkIfUserExists } from "@/services/checkIfUserExists";
import {
  Spinner,
  Text,
  Heading,
  Box,
  Button,
  Stack,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
  FormControl,
  FormErrorMessage,
  useToast,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { StekcitUser } from "@/entities/stekcitUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { StekcitEvent } from "@/entities/stekcitEvent";
import { getAllEventsCreatedByUser } from "@/services/getAllEventsCreatedByUser";
import React from "react";
import { createEvent } from "@/services/createEvent";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();
  const [stekcitUser, setSteckitUser] = useState<StekcitUser | null>(null);
  const [allEventsCreatedByUser, setAllEventsCreatedByUser] = useState<
    StekcitEvent[]
  >([]);

  const toast = useToast();

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [amount, setAmount] = useState(1);
  const [date, setDate] = useState("");
  const [forImmediatePublishing, setForImmediatePublishing] = useState(false);
  const [isConfirmingEvent, setIsConfirmingEvent] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    link: "",
    date: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();



  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    const fetchUserByWalletAddress = async () => {
      const fetchedStekcitUser = await getUserByWalletAddress(address, {
        _walletAddress: address as `0x${string}`,
      });

      setSteckitUser(fetchedStekcitUser);
    };

    const getAllEventsCreatedByUserAndSet = async () => {
      const fetchedPublishedEvents = await getAllEventsCreatedByUser(address);
      setAllEventsCreatedByUser(fetchedPublishedEvents);
    };

    checkIfUserExistsAndSet();
    fetchUserByWalletAddress();
    getAllEventsCreatedByUserAndSet();
  }, [address, userExists, stekcitUser, allEventsCreatedByUser]);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      description: "",
      link: "",
      amount: "",
      date: "",
    };

    if (title.length <= 5) {
      newErrors.title = "Title should be more than 5 characters";
      isValid = false;
    }

    if (description.length <= 5) {
      newErrors.description = "Description should be more than 5 characters";
      isValid = false;
    }

    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|(\\d{1,3}\\.){3}\\d{1,3})" + // domain name and extension
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );

    if (!urlPattern.test(link)) {
      newErrors.link = "Link should be a valid URL";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Date should be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const onCloseModal = () => {
    onClose();
    setIsCreatingEvent(false);
    setIsConfirmingEvent(false);
  };

  const getSecondsSinceEpoch = (dateString: string) => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
  };

  const onClickConfirmEvent = () => {
    if (validateInputs()) {
      const eventDateInSeconds = getSecondsSinceEpoch(date);
      setIsConfirmingEvent(true);
      onOpen();
    }
  };

  const onClickCreateEvent = async () => {
    setIsCreatingEvent(true);

    const eventIsCreated = await createEvent(address, {
      _title: title,
      _description: description,
      _link: link,
      _amount: amount,
      _dateAndTime: getSecondsSinceEpoch(date),
      _forImmediatePublishing: forImmediatePublishing,
    });

    if (eventIsCreated) {
      setIsCreatingEvent(false);
      setIsConfirmingEvent(false);

      onCloseModal();
      toast({
        description: "Event created successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });

      router.push("/my-events");
    } else {
      setIsCreatingEvent(false);
      onCloseModal();
      toast({
        description: "Event was not created",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }

    // Create event

    // if created, setIsCreatingEvent to false, onClose

    ///set is confirming event to false
  };

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Spinner />
      </main>
    );
  } else {
    return (
      <main className="flex flex-col items-center">
        <Heading as="h4" size="sm" paddingBottom={4} paddingTop={4}>
          Create event form
        </Heading>
        <Stack spacing={6}>
          <FormControl isInvalid={!!errors.title}>
            <InputGroup>
              <InputLeftAddon>Title</InputLeftAddon>
              <Input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </InputGroup>
            <FormErrorMessage>{errors.title}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <InputGroup>
              <InputLeftAddon>Desc</InputLeftAddon>
              <Input
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputGroup>
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.link}>
            <InputGroup>
              <InputLeftAddon>Link</InputLeftAddon>
              <Input
                placeholder="to Google Meet or Zoom"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </InputGroup>
            <FormErrorMessage>{errors.link}</FormErrorMessage>
          </FormControl>

          <InputGroup>
            <InputLeftAddon>Amount</InputLeftAddon>
            <Input
              type={"number"}
              placeholder="in CUSD"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </InputGroup>

          <FormControl isInvalid={!!errors.date}>
            <InputGroup>
              <InputLeftAddon>Date</InputLeftAddon>
              <Input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </InputGroup>
            <FormErrorMessage>{errors.date}</FormErrorMessage>
          </FormControl>

          <InputGroup alignItems={"center"} justifyContent={"space-between"}>
            <Text fontSize="md">For immediate publishing </Text>
            <Switch
              size="lg"
              isChecked={forImmediatePublishing}
              onChange={(e) => setForImmediatePublishing(e.target.checked)}
            />
          </InputGroup>

          <Button
            bgColor={"#EA1845"}
            textColor={"white"}
            onClick={onClickConfirmEvent}
            isLoading={isConfirmingEvent}
            loadingText="Confirming Event"
            _hover={{
              bgColor: "#6600D5",
              //   color: "black",
            }}
          >
            Confirm event
          </Button>

          <Modal
            isOpen={isOpen}
            onClose={onCloseModal}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isCentered
            closeOnOverlayClick={false}
          >
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>Confirm Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <InputGroup alignItems={"center"}>
                    <InputLeftAddon>Title:</InputLeftAddon>

                    <Text
                      noOfLines={0}
                      overflow={"auto"}
                      paddingLeft={4}
                      fontSize="md"
                    >
                      {title}
                    </Text>
                  </InputGroup>

                  <InputGroup alignItems={"center"}>
                    <InputLeftAddon>Description: </InputLeftAddon>
                    <Text paddingLeft={4} fontSize="md">
                      {description}
                    </Text>
                  </InputGroup>

                  <InputGroup alignItems={"center"}>
                    <InputLeftAddon>Link: </InputLeftAddon>
                    <Text paddingLeft={4} fontSize="md">
                      {link}
                    </Text>
                  </InputGroup>

                  <InputGroup alignItems={"center"}>
                    <InputLeftAddon>Amount: </InputLeftAddon>
                    <Text paddingLeft={4} fontSize="md">
                      {amount}
                    </Text>
                  </InputGroup>
                  <InputGroup alignItems={"center"}>
                    <InputLeftAddon>Date and Time: </InputLeftAddon>
                    <Text paddingLeft={4} fontSize="md">
                      {date}
                    </Text>
                  </InputGroup>

                  <InputGroup alignItems={"center"}>
                    <InputLeftAddon>For immediate publishing: </InputLeftAddon>
                    <Text paddingLeft={4} fontSize="md">
                      {forImmediatePublishing.toString()}
                    </Text>
                  </InputGroup>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button
                  bgColor={"#EA1845"}
                  textColor={"white"}
                  // onClick={() => router.push("/create-event")}
                  isLoading={isCreatingEvent}
                  onClick={onClickCreateEvent}
                  loadingText="Creating event"
                  _hover={{
                    bgColor: "#6600D5",
                    //   color: "black",
                  }}
                >
                  Create event
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      </main>
    );
  }
}
