import {
    createPublicClient,
    createWalletClient,
    custom,
    parseEther,

} from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";
import { cUSDAlfajoresContractAddress } from "@/utils/addresses/cUSDAlfajoresContractAddresses";
import { cUSDAlfajoresContractABI } from "@/utils/abis/cUSDAlfajoresContractABI";

export const payForTicket = async (
    _signerAddress: `0x${string}` | undefined,
    { _amount }: PayForTicketProps
): Promise<boolean> => {
    if (window.ethereum) {

        const privateClient = createWalletClient({
            chain: celoAlfajores,
            transport: custom(window.ethereum),
        });
        const publicClient = createPublicClient({
            chain: celoAlfajores,
            transport: custom(window.ethereum),
        });
        const [address] = await privateClient.getAddresses();
        try {
            const payForEventVerificationTxnHash = await privateClient.writeContract({
                account: address,
                address: cUSDAlfajoresContractAddress,
                abi: cUSDAlfajoresContractABI,
                functionName: "transfer",
                args: [stekcitBwCContractAddress, _amount],
            });

            const payForEventVerificationTxnReceipt =
                await publicClient.waitForTransactionReceipt({
                    hash: payForEventVerificationTxnHash,
                });

            if (payForEventVerificationTxnReceipt.status == "success") {
                return true;
            }
            return false;

        } catch (error) {
            return false;
        }
    }
    return false;
};

type PayForTicketProps = {
    _amount: number;
};
