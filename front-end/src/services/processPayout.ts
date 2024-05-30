import {
    createPublicClient,
    createWalletClient,
    custom
} from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const processPayout = async (
    _signerAddress: `0x${string}` | undefined,
    { _eventId }: ProcessPayoutProps
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
            const processPayoutTxnHash = await privateClient.writeContract({
                account: address,
                address: stekcitBwCContractAddress,
                abi: stekcitBwCContractABI,
                functionName: "processPayout",
                args: [_eventId],
            });

            const processPayoutTxnReceipt =
                await publicClient.waitForTransactionReceipt({
                    hash: processPayoutTxnHash,
                });

            if (processPayoutTxnReceipt.status == "success") {
                return true;
            }
            return false;

        } catch (error) {
            return false;
        }
    }
    return false;
};

type ProcessPayoutProps = {
    _eventId: number;
};
