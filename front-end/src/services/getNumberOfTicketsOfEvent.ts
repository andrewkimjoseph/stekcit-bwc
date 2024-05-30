import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const getNumberOfTicketsOfEvent = async (
  _signerAddress: `0x${string}` | undefined,
  { _eventId }: GetNumberOfTicketsOfEvent
): Promise<number> => {
  let fetchedNumberOfTicketsOfEvent: number = 0;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      fetchedNumberOfTicketsOfEvent = Number(
        (await publicClient.readContract({
          address: stekcitBwCContractAddress,
          abi: stekcitBwCContractABI,
          functionName: "getNumberOfTicketsOfEvent",
          args: [_eventId],
        })) ?? 0
      );

      return fetchedNumberOfTicketsOfEvent;
    } catch (err) {
      console.info(err);
      return fetchedNumberOfTicketsOfEvent;
    }
  }
  return fetchedNumberOfTicketsOfEvent;
};

 type GetNumberOfTicketsOfEvent = {
  _eventId: number;
};
