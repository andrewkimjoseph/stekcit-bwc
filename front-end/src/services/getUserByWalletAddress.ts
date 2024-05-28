import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";
import { StekcitUser } from "@/entities/stekcitUser";

export const getUserByWalletAddress = async (
  _signerAddress: `0x${string}` | undefined,
  { _walletAddress }: GetUserByWalletAddress
): Promise<StekcitUser | null> => {
  let stekcitUser: StekcitUser | null = null;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedStekcitUser = await publicClient.readContract({
        address: stekcitBwCContractAddress,
        abi: stekcitBwCContractABI,
        functionName: "getUserByWalletAddress",
        args: [_signerAddress],
      }) as any;

      stekcitUser = {
        id: Number(fetchedStekcitUser["id"]),
        walletAddress: fetchedStekcitUser["walletAddress"],
        username: fetchedStekcitUser["username"],
        emailAddress: fetchedStekcitUser["emailAddress"],
        isCreatingUser: fetchedStekcitUser["isCreatingUser"],
        isBlank: fetchedStekcitUser["isBlank"]
      };
      
      return stekcitUser;
    } catch (err) {
      console.info(err);
      return stekcitUser;
    }
  }
  return null;
};

export type GetUserByWalletAddress = {
  _walletAddress: `0x${string}`;
};
