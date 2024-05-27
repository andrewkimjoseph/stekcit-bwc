import { createPublicClient, createWalletClient, custom, http, parseTransaction } from "viem";
import { celoAlfajores } from "viem/chains";
import { stekcitBwCContractABI } from "@/utils/abis/stekcitBwCContractABI";
import { stekcitBwCContractAddress } from "@/utils/addresses/stekcitBwCContractAddress";

export const createUser = async (
    _signerAddress: `0x${string}` | undefined, { _username, _emailAddress }: CreateUserProps
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
                const createUserTxnHash = await privateClient.writeContract({
                    account: address,
                    address: stekcitBwCContractAddress as `0x${string}`,
                    abi: stekcitBwCContractABI,
                    functionName: "createUser",
                    args: [_username, _emailAddress],
                });

                const createUserTxnReceipt = await publicClient.waitForTransactionReceipt({
                    hash: createUserTxnHash
                });

                if (createUserTxnReceipt.status == "success") {
                    const existingUser = await publicClient.readContract({
                        address: stekcitBwCContractAddress as `0x${string}`,
                        abi: stekcitBwCContractABI,
                        functionName: "getUserByWalletAddress",
                        args: [_signerAddress],
                    });

                    console.log(existingUser);
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



export type CreateUserProps = {
    _username: string;
    _emailAddress: string;
};
