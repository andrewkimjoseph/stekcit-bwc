import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";
import { StekcitUser } from "@/entities/stekcitUser";
import { StekcitEvent } from "@/entities/stekcitEvent";

export const getEventById = async (
  _signerAddress: `0x${string}` | undefined,
  { _eventId }: GetEventByIdProps
): Promise<StekcitEvent | null> => {
  let stekcitEvent: StekcitEvent | null = null;
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedStekcitEvent = await publicClient.readContract({
        address: stekcitBwCContractAddress,
        abi: stekcitBwCContractABI,
        functionName: "getEventById",
        args: [_eventId],
      }) as any;

      stekcitEvent = {
          id: Number(fetchedStekcitEvent["id"]),
          creatingUserWalletAddress: fetchedStekcitEvent["creatingUserWalletAddress"],
          title: fetchedStekcitEvent["title"],
          description: fetchedStekcitEvent["description"],
          link: fetchedStekcitEvent["link"],
          amountInEthers: Number(fetchedStekcitEvent["amountInEthers"]),
          createdAt: Number(fetchedStekcitEvent["createdAt"]),
          updatedAt: Number(fetchedStekcitEvent["updatedAt"]),
          dateAndTime: Number(fetchedStekcitEvent["dateAndTime"]),
          isBlank: fetchedStekcitEvent["isBlank"],
          isPublished: fetchedStekcitEvent["isPublished"],
          isVerified: fetchedStekcitEvent["isVerified"],
          verificationAmountInEthers: Number(fetchedStekcitEvent["verificationAmountInEthers"]),
          isEnded: fetchedStekcitEvent["isEnded"],
          isPaidOut: fetchedStekcitEvent["isPaidOut"]
      }

      return stekcitEvent;
    } catch (err) {
      console.info(err);
      return stekcitEvent;
    }
  }
  return null;
};

export type GetEventByIdProps = {
    _eventId: number;
};
