"use client";

import { checkIfUserExists } from "@/services/checkIfUserExists";
import { Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import BecomeAUser from "./become-a-user/page";

export default function Home() {

  const [userExists, setUserExists] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();

  useEffect(() => {
    const checkIfUserExistsAndSet = async () => {
      if (address) {
        const doesUserExist = await checkIfUserExists(address);
        setUserExists(doesUserExist);
        setIsLoading(false);
      }
    };
    checkIfUserExistsAndSet();
  }, [address, userExists]);

  if (isLoading){
    return (
      <main className="flex h-screen items-center justify-center">
        <Spinner/>
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-2">
        {userExists ? <Text noOfLines={1}>Home</Text> : <BecomeAUser />}
      </main>
    );
  }


}
