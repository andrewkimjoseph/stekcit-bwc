import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const checkIfUserAlreadyHasTicket = async (
  _signerAddress: `0x${string}` | undefined,
  { _eventId }: CheckIfTicketOfUserForThisEventExists
): Promise<boolean> => {
  if (window.ethereum) {
    try {
      const publicClient = createPublicClient({
        chain: celoAlfajores,
        transport: custom(window.ethereum),
      });
      try {
        const userExists = await publicClient.readContract({
          address: stekcitBwCContractAddress,
          abi: stekcitBwCContractABI,
          functionName: "checkIfUserAlreadyHasTicket",
          args: [_eventId, _signerAddress],
        });
        return userExists as boolean;
      } catch (err) {
        console.error(err);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};

type CheckIfTicketOfUserForThisEventExists = {
  _eventId: number;
};
