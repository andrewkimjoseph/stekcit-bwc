export type StekcitTicket = {
    id: number;
    eventId: number;
    attendingUserWalletAddress: `0x${string}`;
    amountPaidInEthers: number;
    isBlank: boolean,
    isPublished: boolean,
};