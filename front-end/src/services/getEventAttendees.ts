import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";
import { StekcitUser } from "@/entities/stekcitUser";

export const getEventAttendees = async (
  _signerAddress: `0x${string}` | undefined, {_eventId}: GetEventAttendees
): Promise<StekcitUser[]> => {
  let allEventAttendees: StekcitUser[] = [];
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedAttendees = await publicClient.readContract({
        address: stekcitBwCContractAddress,
        abi: stekcitBwCContractABI,
        functionName: "getEventAttendees",
        args: [_eventId]
      }) as Array<any>;

      for (let userId = 0; userId < fetchedAttendees.length; userId++) {
        const userToBeParsed = fetchedAttendees[userId];

        const stekcitUser: StekcitUser = {
            id: Number(userToBeParsed["id"]),
            walletAddress: userToBeParsed["walletAddress"],
            username: userToBeParsed["username"],
            emailAddress: userToBeParsed["emailAddress"],
            isCreatingUser: userToBeParsed["isCreatingUser"],
            isBlank: userToBeParsed["isBlank"]
        }
   
        allEventAttendees.push(stekcitUser);
      }

      return allEventAttendees;
    } catch (err) {
      console.info(err);
      return allEventAttendees;
    }
  }
  return allEventAttendees;
};


type GetEventAttendees = {
    _eventId: number
}