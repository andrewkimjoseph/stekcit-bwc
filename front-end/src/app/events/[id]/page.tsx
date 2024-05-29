"use client";

import { checkIfUserExists } from "@/services/checkIfUserExists";
import {
  Spinner,
  Text,
  Heading,
  Box,
  Button,
  Card,
  CardBody,
  Stack,
  CardHeader,
  StackDivider,
  Input,
  InputGroup,
  InputLeftAddon,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { StekcitUser } from "@/entities/stekcitUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { StekcitEvent } from "@/entities/stekcitEvent";
import { getAllEventsCreatedByUser } from "@/services/getAllEventsCreatedByUser";
import { useRouter, useSearchParams } from "next/navigation";
import { useRouter as routerRouter } from "next/router";
import { getEventById } from "@/services/getEventById";
import { formatUnits } from "viem";
import { buyTicket } from "@/services/buyTicket";
import { payForTicket } from "@/services/payForTicket";
import { checkIfUserAlreadyHasTicket } from "@/services/checkIfTicketOfUserForThisEventExists";

export default function Event() {
  const [userExists, setUserExists] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isBuyingTicket, setIsBuyingTicket] = useState(false);
  const toast = useToast();

  const { address } = useAccount();

  const router = useRouter();

  const searchParams = useSearchParams();

  const [stekcitUser, setSteckitUser] = useState<StekcitUser | null>(null);

  const [stekcitEvent, setStekcitEvent] = useState<StekcitEvent | null>(null);

  const eventId = Number(searchParams.get("eventId"));

  const convertTimestampToDate = (timestamp: number): string => {
    // Convert the Unix timestamp to milliseconds
    const date = new Date(timestamp * 1000);

    // Format the date to a human-readable string
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // e.g., "Monday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "June"
      day: "numeric", // e.g., "10"
      hour: "2-digit", // e.g., "10 PM"
      minute: "2-digit", // e.g., "30"
      second: "2-digit", // e.g., "45"
      hour12: true, // 12-hour format
    };

    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  };

  const buyEventTicket = async () => {

    const userHasTicket = await checkIfUserAlreadyHasTicket(address, {_eventId: eventId});

    if (userHasTicket){
      toast({
        description: "You already bought a ticket to this event.",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsBuyingTicket(true);

    const ticketIsPaidFor = await payForTicket(address, {
      _amount: stekcitEvent?.amountInEthers!,
      
    });

    if (ticketIsPaidFor){
      const ticketIsBought = await buyTicket(address, { _eventId: eventId });

      if (ticketIsBought) {
        setIsBuyingTicket(false);
        toast({
          description: "Ticket successfully bought.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return;
      } else {
        setIsBuyingTicket(false);
        toast({
          description: "Ticket buying failed.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return;
      }

    } else {
      setIsBuyingTicket(false);
      toast({
        description: "Ticket buying failed.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

  
  };

  const parsedAmount = (amount: number) => {
    return Number(formatUnits(BigInt(amount ?? 0), 18));
  };
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

    const fetchEventById = async () => {
      const fetchedEvent = await getEventById(address, {
        _eventId: eventId,
      });
      setStekcitEvent(fetchedEvent);
    };

    checkIfUserExistsAndSet();
    fetchUserByWalletAddress();
    fetchEventById();
  }, [address, userExists, stekcitUser]);

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Spinner />
      </main>
    );
  } else {
    return (
      <main className="flex flex-col items-center">
        <Card
          marginY={4}
          direction={"row"}
          alignContent={"center"}
          alignItems={"center"}
        >
          <CardHeader>
            <Heading size="md">Event at id: {stekcitEvent?.id}</Heading>
          </CardHeader>
          <Button
            bgColor={"#EA1845"}
            textColor={"white"}
            loadingText="Buying Ticket"
            isLoading={isBuyingTicket}
            onClick={buyEventTicket}
            _hover={{
              bgColor: "#6600D5",
              //   color: "black",
            }}
            marginRight={4}
          >
            Buy ticket for {parsedAmount(stekcitEvent?.amountInEthers!)} cUSD
          </Button>
        </Card>

        <Stack spacing={2}>
          <Card>
            <CardBody>
              <InputGroup className="flex flex-row items-center">
                <InputLeftAddon>Verified</InputLeftAddon>
                <Text
                  marginX={8}
                  textColor={stekcitEvent?.isVerified ? "#18A092" : "#EA1845"}
                >
                  {stekcitEvent?.isVerified.toString()}
                </Text>
              </InputGroup>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <InputGroup className="flex flex-row items-center">
                <InputLeftAddon>Published</InputLeftAddon>
                <Text
                  marginX={8}
                  textColor={stekcitEvent?.isPublished ? "#18A092" : "#EA1845"}
                >
                  {stekcitEvent?.isPublished.toString()}
                </Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Title</InputLeftAddon>
                <Text marginLeft={16}>{stekcitEvent?.title}</Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Description</InputLeftAddon>
                <Text marginLeft={16}>{stekcitEvent?.description}</Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Link</InputLeftAddon>
                <Text marginLeft={16}>{stekcitEvent?.link}</Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Date and time</InputLeftAddon>
                <Text marginLeft={16}>
                  {convertTimestampToDate(stekcitEvent?.dateAndTime!)}
                </Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Amount</InputLeftAddon>
                <Text marginLeft={16}>
                  {formatUnits(BigInt(stekcitEvent?.amountInEthers ?? 0), 18)}{" "}
                  cUSD per ticket
                </Text>
              </InputGroup>
            </CardBody>
          </Card>
        </Stack>
      </main>
    );
  }
}
