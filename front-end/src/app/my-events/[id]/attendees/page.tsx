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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { StekcitUser } from "@/entities/stekcitUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { useRouter, useSearchParams } from "next/navigation";
import { getEventAttendees } from "@/services/getEventAttendees";


export default function AllAttendees() {
  const [userExists, setUserExists] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();

  const searchParams = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));

  const [stekcitUser, setSteckitUser] = useState<StekcitUser | null>(null);

  const [allEventAttendees, setAllEventAttendees] = useState<
    StekcitUser[]
  >([]);

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

    const getAllEventAttendeesAndSet = async () => {
      const fetchedEventAttendees = await getEventAttendees(address, {_eventId: eventId});
      setAllEventAttendees(fetchedEventAttendees);
    };

    checkIfUserExistsAndSet();
    fetchUserByWalletAddress();
    getAllEventAttendeesAndSet();
  }, [address, userExists, stekcitUser, allEventAttendees]);

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <Spinner />
      </main>
    );
  } else {
    return (
      <main className="flex flex-col items-center">
   
        <Card marginTop={8} direction={"column"}>
          <CardHeader>
            <Heading size="md">All Events Attendees</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {allEventAttendees.length === 0 && (
                <Box>
                  <Text pt="2" fontSize="sm">
                    ...will show here
                  </Text>
                </Box>
              )}
              {allEventAttendees.map((user) => (
                <Box key={user.id}>
                  <Heading size="xs" textTransform="uppercase">
                  {user.id}: {user.username}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {user.emailAddress}
                  </Text>
                  {/* <Button
                    marginTop={4}
                    variant="outline"
                    color="#18A092"
                    onClick={() =>
                      router.push(`/my-events/${event.id}?eventId=${event.id}`)
                    }
                  >
                    View event
                  </Button> */}
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </main>
    );
  }
}
