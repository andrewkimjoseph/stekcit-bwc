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
import { useRouter, useSearchParams } from "next/navigation";
import { getEventById } from "@/services/getEventById";
import { formatUnits } from "viem";
import { payForEventVerification } from "@/services/payForEventVerification";
import { verifyEvent } from "@/services/verifyEvent";
import { publishEvent } from "@/services/publishEvent";
import { processPayout } from "@/services/processPayout";
import { getTotalAmountPaidToEventInEthers } from "@/services/getTotalAmountPaidToEventInEthers";

export default function Event() {
  const [userExists, setUserExists] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isVerifying, setIsVerifying] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  const [isPayingOut, setIsPayingOut] = useState(false);

  const { address } = useAccount();

  const router = useRouter();

  const searchParams = useSearchParams();

  const [stekcitUser, setSteckitUser] = useState<StekcitUser | null>(null);

  const [stekcitEvent, setStekcitEvent] = useState<StekcitEvent | null>(null);

  const eventId = Number(searchParams.get("eventId"));
  const toast = useToast();

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

  const parsedAmount = (amount: number) => {
    return Number(formatUnits(BigInt(amount ?? 0), 18));
  };

  const publishStekcitEvent = async () => {
    if (stekcitEvent?.isPublished === true) {
      toast({
        description: "Event is already published",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    setIsPublishing(true);

    const eventIsPublished = await publishEvent(address, { _eventId: eventId });

    if (eventIsPublished) {
      setIsPublishing(false);
      toast({
        description: "Event successfully published.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    } else {
      setIsPublishing(false);
      toast({
        description: "Event publishing failed.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };

  const makePaymentAndVerifyEvent = async () => {
    if (stekcitEvent?.isVerified === true) {
      toast({
        description: "Event is already verified",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
      });

      return;
    }
    setIsVerifying(true);

    console.log(stekcitEvent?.amountInEthers);

    const amountToBePaid = (stekcitEvent?.amountInEthers ?? 0) / 10;

    console.log(amountToBePaid);

    if (amountToBePaid === 0) {
      setIsVerifying(false);
      toast({
        description: "Amount to paid is invalid, try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const verificationPaymentIsMade = await payForEventVerification(address, {
      _amount: amountToBePaid,
    });

    if (verificationPaymentIsMade) {
      const verificationIsMade = await verifyEvent(address, {
        _eventId: eventId,
      });

      if (verificationIsMade) {
        setIsVerifying(false);
        toast({
          description: "Event successfully verified.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    } else {
      setIsVerifying(false);

      toast({
        description: "Payment for verification failed, try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });

      return;
    }
  };

  const requestPayout = async () => {
    const amountPaid = parsedAmount(
      await getTotalAmountPaidToEventInEthers(address, { _eventId: eventId })
    );

    if (amountPaid === 0) {
      toast({
        description: "No tickets bought for this event",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (stekcitEvent?.isPaidOut) {
      toast({
        description: "Event is already paid out",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    setIsPayingOut(true);

    const eventIsPaidOut = await processPayout(address, { _eventId: eventId });

    if (eventIsPaidOut) {
      setIsPayingOut(false);
      toast({
        description: "Event paid out successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    } else {
      setIsPayingOut(false);
      toast({
        description: "Event payout failed.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }
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
        {/* <Heading as="h4" size="sm" paddingBottom={4} paddingTop={4}>
          Viewing event 0
        </Heading> */}
        <Card marginY={4} direction={"row"} alignItems={"center"}>
          <CardHeader>
            <Heading size="md">Event at id: {stekcitEvent?.id}</Heading>
          </CardHeader>
          {!stekcitEvent?.isPaidOut ? (
            <Button
              bgColor={"#EA1845"}
              onClick={requestPayout}
              isLoading={isPayingOut}
              loadingText="Paying out"
              textColor={"white"}
              marginRight={4}
              _hover={{
                bgColor: "#6600D5",
              }}
            >
              Request payout
            </Button>
          ) : null}
        </Card>

        <Stack spacing={2}>
          <Card>
            <CardBody>
              <InputGroup
                className={`flex flex-row items-center ${
                  !stekcitEvent?.isVerified ? "justify-between" : ""
                }`}
              >
                <InputLeftAddon>Verified</InputLeftAddon>
                <Text
                  marginX={4}
                  textColor={stekcitEvent?.isVerified ? "#18A092" : "#EA1845"}
                >
                  {stekcitEvent?.isVerified.toString()}
                </Text>

                {!stekcitEvent?.isVerified ? (
                  <Button
                    bgColor={"#EA1845"}
                    onClick={makePaymentAndVerifyEvent}
                    isLoading={isVerifying}
                    loadingText="Verifying"
                    textColor={"white"}
                    _hover={{
                      bgColor: "#6600D5",
                    }}
                  >
                    Verify for{" "}
                    {parsedAmount(stekcitEvent?.amountInEthers!) / 10} cUSD
                  </Button>
                ) : null}
              </InputGroup>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <InputGroup
                className={`flex flex-row items-center ${
                  !stekcitEvent?.isPublished ? "justify-between" : ""
                }`}
              >
                <InputLeftAddon>Published</InputLeftAddon>
                <Text
                  marginX={4}
                  textColor={stekcitEvent?.isPublished ? "#18A092" : "#EA1845"}
                >
                  {stekcitEvent?.isPublished.toString()}
                </Text>

                {!stekcitEvent?.isPublished ? (
                  <Button
                    bgColor={"#18A092"}
                    textColor={"white"}
                    onClick={publishStekcitEvent}
                    isLoading={isPublishing}
                    loadingText="Publishing"
                    _hover={{
                      bgColor: "#FFD62C",
                      //   color: "black",
                      textColor: "black",
                    }}
                  >
                    Publish
                  </Button>
                ) : null}
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup
                className={"flex flex-row items-center"}
              >
                <InputLeftAddon>Paid out</InputLeftAddon>
                <Text
                  marginX={4}
                  textColor={stekcitEvent?.isPaidOut ? "#18A092" : "#EA1845"}
                >
                  {stekcitEvent?.isPaidOut.toString()}
                </Text>

            
              </InputGroup>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Title</InputLeftAddon>
                <Text marginLeft={4}>{stekcitEvent?.title}</Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Description</InputLeftAddon>
                <Text marginLeft={4}>{stekcitEvent?.description}</Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Link</InputLeftAddon>
                <Text marginLeft={4}>{stekcitEvent?.link}</Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Date and time</InputLeftAddon>
                <Text marginLeft={4}>
                  {convertTimestampToDate(stekcitEvent?.dateAndTime!)}
                </Text>
              </InputGroup>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InputGroup alignItems={"center"}>
                <InputLeftAddon>Amount</InputLeftAddon>
                <Text marginLeft={4}>
                  {`${parsedAmount(stekcitEvent?.amountInEthers!)} cUSD`}
                  cUSD
                </Text>
              </InputGroup>
            </CardBody>
          </Card>
        </Stack>
      </main>
    );
  }
}
