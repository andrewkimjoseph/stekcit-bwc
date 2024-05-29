import {
    createPublicClient,
    createWalletClient,
    custom
} from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const verifyEvent = async (
    _signerAddress: `0x${string}` | undefined,
    { _eventId }: VerifyEventProps
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
            const verifyEventTxnHash = await privateClient.writeContract({
                account: address,
                address: stekcitBwCContractAddress,
                abi: stekcitBwCContractABI,
                functionName: "verifyEvent",
                args: [_eventId],
            });

            const verifyEventTxnReceipt =
                await publicClient.waitForTransactionReceipt({
                    hash: verifyEventTxnHash,
                });

            if (verifyEventTxnReceipt.status == "success") {
                return true;
            }
            return false;

        } catch (error) {
            return false;
        }
    }
    return false;
};

export type VerifyEventProps = {
    _eventId: number;
};
