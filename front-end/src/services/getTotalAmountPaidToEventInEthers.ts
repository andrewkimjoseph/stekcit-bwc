import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const getTotalAmountPaidToEventInEthers = async (
  _signerAddress: `0x${string}` | undefined,
  { _eventId }: GetTotalAmountPaidToEventInEthersProps
): Promise<number> => {
  let fetchedTotalAmountPaidToEventInEthers: number = 0;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      fetchedTotalAmountPaidToEventInEthers = Number(
        (await publicClient.readContract({
          address: stekcitBwCContractAddress,
          abi: stekcitBwCContractABI,
          functionName: "getTotalAmountPaidToEventInEthers",
          args: [_eventId],
        })) ?? 0
      );

      return fetchedTotalAmountPaidToEventInEthers;
    } catch (err) {
      console.info(err);
      return fetchedTotalAmountPaidToEventInEthers;
    }
  }
  return fetchedTotalAmountPaidToEventInEthers;
};

export type GetTotalAmountPaidToEventInEthersProps = {
  _eventId: number;
};
