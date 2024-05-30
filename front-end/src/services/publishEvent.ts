import {
    createPublicClient,
    createWalletClient,
    custom
} from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const publishEvent = async (
    _signerAddress: `0x${string}` | undefined,
    { _eventId }: PublishEventProps
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
            const publishEventTxnHash = await privateClient.writeContract({
                account: address,
                address: stekcitBwCContractAddress,
                abi: stekcitBwCContractABI,
                functionName: "publishEvent",
                args: [_eventId],
            });

            const publishEventTxnReceipt =
                await publicClient.waitForTransactionReceipt({
                    hash: publishEventTxnHash,
                });

            if (publishEventTxnReceipt.status == "success") {
                return true;
            }
            return false;

        } catch (error) {
            return false;
        }
    }
    return false;
};

type PublishEventProps = {
    _eventId: number;
};
