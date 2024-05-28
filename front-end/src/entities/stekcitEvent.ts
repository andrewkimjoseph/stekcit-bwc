export type StekcitEvent = {
    id: number;
    creatingUserWalletAddress:  `0x${string}`;
    title: string;
    description: string;
    link: string;
    amountInEthers: number;
     createdAt: number;
     updatedAt: number;
     dateAndTime: number,
     isBlank: boolean,
     isPublished: boolean,
     isVerified: boolean,
     verificationAmountInEthers: number;
     isEnded: boolean;
     isPaidOut: boolean;
  };