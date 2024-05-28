import { createPublicClient, createWalletClient, custom, http } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";
import { StekcitEvent } from "@/entities/stekcitEvent";
import { StekcitTicket } from "@/entities/stekcitTickets";

export const getAllTicketsOfUser = async (
  _signerAddress: `0x${string}` | undefined
): Promise<StekcitTicket[]> => {
  let allTicketsOfUser: StekcitTicket[] = [];
  if (window.ethereum) {
    const publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: custom(window.ethereum),
    });
    try {
      const fetchedTickets = await publicClient.readContract({
        address: stekcitBwCContractAddress,
        abi: stekcitBwCContractABI,
        functionName: "getAllTicketsOfUser",
        args: [_signerAddress]
      }) as Array<any>;

      for (let ticketId = 0; ticketId < fetchedTickets.length; ticketId++) {
        const ticketToBeParsed = fetchedTickets[ticketId];

        const createdTicket: StekcitTicket = {
          id: Number(ticketToBeParsed["id"]),
          eventId: Number(ticketToBeParsed["eventId"]),
          attendingUserWalletAddress: ticketToBeParsed["attendingUserWalletAddress"],
          amountPaidInEthers: Number(ticketToBeParsed["amountPaidInEthers"]),
          isBlank: ticketToBeParsed["isBlank"],
          isPublished: ticketToBeParsed["isPublished"]
        }

        allTicketsOfUser.push(createdTicket);
      }

      return allTicketsOfUser;
    } catch (err) {
      console.info(err);
      return allTicketsOfUser;
    }
  }
  return allTicketsOfUser;
};
