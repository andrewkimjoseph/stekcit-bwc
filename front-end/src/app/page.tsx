"use client";

import { checkIfUserExists } from "@/services/checkIfUserExists";
import {
  Spinner,
  Text,
  Highlight,
  Heading,
  Box,
  Button,
  Flex,
  useToast,
  Card,
  CardBody,
  CardFooter,
  Stack,
  CardHeader,
  StackDivider,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BecomeAUser from "./become-a-user/page";
import { StekcitUser } from "@/entities/stekcitUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { makeCreatingUser } from "@/services/makeCreatingUser";
import { useRouter } from "next/navigation";
import { getNumberOfTicketsOfUser } from "@/services/getNumberOfTicketsOfUser";
import { getTotalNumberOfAllEventsCreatedByUser } from "@/services/getTotalNumberOfAllEventsCreatedByUser";
import { getAllPublishedEvents } from "@/services/getAllPublishedEvents";
import { StekcitEvent } from "@/entities/stekcitEvent";

export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();

  const [stekcitUser, setSteckitUser] = useState<StekcitUser | null>(null);

  const [numberOfTicketsOfUser, setNumberOfTicketsOfUser] = useState(0);

  const [allPublishedEvents, setAllPublishedEvents] = useState<StekcitEvent[]>(
    []
  );

  const [
    totalNumberOfAllEventsCreatedByUser,
    setTotalNumberOfAllEventsCreatedByUser,
  ] = useState(0);

  const [isMakingCreatingUser, setIsMakingCreatingUser] = useState(false);

  const makeCreatingUserAndSet = async () => {
    setIsMakingCreatingUser(true);
    const isUserNowCreatingUser = await makeCreatingUser(address);

    if (isUserNowCreatingUser) {
      setIsMakingCreatingUser(false);

      toast({
        description: "You are now a creating user",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } else {
      setIsMakingCreatingUser(false);
      toast({
        description: "Failed. Please try again.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
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

    const getNumberOfTicketsOfUserAndSet = async () => {
      const fetchedNumberOfTicketsOfUser = await getNumberOfTicketsOfUser(
        address,
        { _walletAddress: address as `0x${string}` }
      );
      setNumberOfTicketsOfUser(fetchedNumberOfTicketsOfUser);
    };

    const getTotalNumberOfAllEventsCreatedByUserAndSet = async () => {
      const fetchedTotalNumberOfAllEventsCreatedByUser =
        await getTotalNumberOfAllEventsCreatedByUser(address, {
          _walletAddress: address as `0x${string}`,
        });
      setTotalNumberOfAllEventsCreatedByUser(
        fetchedTotalNumberOfAllEventsCreatedByUser
      );
    };

    const getAllPublishedEventsAndSet = async () => {
      const fetchedPublishedEvents = await getAllPublishedEvents(address);
      setAllPublishedEvents(fetchedPublishedEvents);
    };

    checkIfUserExistsAndSet();
    fetchUserByWalletAddress();
    getNumberOfTicketsOfUserAndSet();
    getTotalNumberOfAllEventsCreatedByUserAndSet();
    getAllPublishedEventsAndSet();
  }, [
    address,
    userExists,
    stekcitUser,
    // numberOfTicketsOfUser,
    // totalNumberOfAllEventsCreatedByUser,
    // allPublishedEvents,
  ]);

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Spinner />
      </main>
    );
  } else {
    return (
      <>
        {userExists ? (
          <main className="flex flex-col items-center">
            {!stekcitUser?.isCreatingUser ? (
              <Box
                className="bg-opacity-50 w-full flex items-center justify-center"
                bgColor={"rgba(102, 0, 213, 0.25)"}
              >
                <Flex
                  h={10}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Text textColor={"black"} noOfLines={1} paddingRight={4}>
                    You are not a creator yet
                  </Text>
                  <Button
                    onClick={makeCreatingUserAndSet}
                    isLoading={isMakingCreatingUser}
                    loadingText="Becoming"
                    h={8}
                    bgColor={"#EA1845"}
                    textColor={"white"}
                    _hover={{
                      bgColor: "#EA1845",
                      //   color: "black",
                    }}
                  >
                    Become one
                  </Button>
                </Flex>
              </Box>
            ) : null}

            <Heading as="h4" size="sm" paddingBottom={4} paddingTop={4}>
              Hey, {stekcitUser?.username}, welcome home!
            </Heading>

            <Flex>
              <Card
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
              >
                <Stack>
                  <CardBody>
                    <Heading size="md">
                      {totalNumberOfAllEventsCreatedByUser}
                    </Heading>

                    <Text py="2">Events created</Text>
                  </CardBody>

                  <CardFooter>
                    <Button
                      bgColor="#18A092"
                      textColor={"white"}
                      onClick={() => router.push("/my-events")}
                    >
                      View events
                    </Button>
                  </CardFooter>
                </Stack>
              </Card>
              <Spacer width={4} />
              <Card
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
              >
                <Stack>
                  <CardBody>
                    <Heading size="md">{numberOfTicketsOfUser}</Heading>

                    <Text py="2">Tickets bought</Text>
                  </CardBody>

                  <CardFooter>
                    <Button
                      bgColor="#18A092"
                      textColor={"white"}
                      onClick={() => router.push("/my-tickets")}
                    >
                      View tickets
                    </Button>
                  </CardFooter>
                </Stack>
              </Card>
            </Flex>

            <Card marginTop={8} direction={"column"}>
              <CardHeader>
                <Heading size="md">All Upcoming Events</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {allPublishedEvents.length === 0 && (
                    <Box>
                      <Text pt="2" fontSize="sm">
                        ...will show here
                      </Text>
                    </Box>
                  )}
                  {allPublishedEvents.map((event) => (
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        {event.title}
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {event.description}
                      </Text>
                      <Button
                        marginTop={4}
                        variant="outline"
                        colorScheme="blue"
                      >
                        View event
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </main>
        ) : (
          <BecomeAUser />
        )}
      </>
    );
  }
}
