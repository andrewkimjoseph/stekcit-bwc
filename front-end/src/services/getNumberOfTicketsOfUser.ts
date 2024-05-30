import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const getNumberOfTicketsOfUser = async (
  _signerAddress: `0x${string}` | undefined,
  { _walletAddress }: GetUserByWalletAddress
): Promise<number> => {
  let fetchedNumberOfTicketsOfUser: number = 0;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      fetchedNumberOfTicketsOfUser = Number(
        (await publicClient.readContract({
          address: stekcitBwCContractAddress,
          abi: stekcitBwCContractABI,
          functionName: "getNumberOfTicketsOfUser",
          args: [_walletAddress],
        })) ?? 0
      );

      return fetchedNumberOfTicketsOfUser;
    } catch (err) {
      console.info(err);
      return fetchedNumberOfTicketsOfUser;
    }
  }
  return fetchedNumberOfTicketsOfUser;
};

export type GetUserByWalletAddress = {
  _walletAddress: `0x${string}`;
};
