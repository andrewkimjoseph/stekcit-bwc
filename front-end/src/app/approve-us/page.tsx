"use client";

import { checkIfUserExists } from "@/services/checkIfUserExists";
import {
  Spinner,
  Text,
  Heading,
  Button,
  Stack,
  Input,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { StekcitUser } from "@/entities/stekcitUser";
import { getUserByWalletAddress } from "@/services/getUserByWalletAddress";
import { useRouter } from "next/navigation";
import { approveContract } from "@/services/approveContract";

export default function ApproveUs() {
  const [userExists, setUserExists] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();

  const toast = useToast();

  const [amount, setAmount] = useState(250);

  const router = useRouter();

  const [stekcitUser, setSteckitUser] = useState<StekcitUser | null>(null);

  const [isApproving, setIsApproving] = useState(false);

  const approveStekcitBwCContract = async () => {
    setIsApproving(true);

    const amountIsApproved = await approveContract(address, {
      _amount: amount,
    });

    if (amountIsApproved) {
      setIsApproving(false);
      toast({
        description: `Approval for ${amount} cUSD accepted.`,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } else {
      setIsApproving(false);

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

    checkIfUserExistsAndSet();
    fetchUserByWalletAddress();
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
        <Heading as="h4" size="sm" paddingBottom={4} paddingTop={4}>
          Welcome to our approval screen!
        </Heading>
        <Stack spacing={8} m={8}>
          <Text>Our smart contract needs approval from your account...</Text>
          <Text>...even before you make any transaction.</Text>
          <Text>How cool is that?</Text>

          <InputGroup>
            <InputLeftAddon>Amount (cUSD)</InputLeftAddon>
            <Input
              type={"number"}
              placeholder="in CUSD"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </InputGroup>
          <Button
            bgColor={"#EA1845"}
            textColor={"white"}
            onClick={approveStekcitBwCContract}
            loadingText="Approving"
            isLoading={isApproving}
            _hover={{
              bgColor: "#6600D5",
              //   color: "black",
            }}
          >
            Approve
          </Button>
        </Stack>
      </main>
    );
  }
}
