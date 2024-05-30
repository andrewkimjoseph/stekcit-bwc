import { createPublicClient, createWalletClient, custom, http, parseEther, parseTransaction } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";
import { cUSDAlfajoresContractABI } from "@/utils/abis/cUSDAlfajoresContractABI";
import { cUSDAlfajoresContractAddress } from "@/utils/addresses/cUSDAlfajoresContractAddresses";

export const approveContract = async (
    _signerAddress: `0x${string}` | undefined, { _amount }: ApproveContractProps
): Promise<boolean> => {
    if (window.ethereum) {
        try {
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
                const approveContractTxnHash = await privateClient.writeContract({
                    account: address,
                    address: cUSDAlfajoresContractAddress,
                    abi: cUSDAlfajoresContractABI,
                    functionName: "approve",
                    args: [stekcitBwCContractAddress, parseEther(_amount.toString())],
                });

                const approveContractTxnReceipt = await publicClient.waitForTransactionReceipt({
                    hash: approveContractTxnHash
                });

                if (approveContractTxnReceipt.status == "success") {
                    return true;
                }
                return false;
            } catch (err) {
                console.error(err);
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    return false;
};



export type ApproveContractProps = {
    _amount: number;
};
