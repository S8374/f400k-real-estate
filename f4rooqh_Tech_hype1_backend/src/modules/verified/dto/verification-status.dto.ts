export class AgentVerificationStatusDto {
  userId: string;
  fullName: string;
  email: string;
  agencyName?: string;
  licenseId?: string;
  isRegaVerified: boolean;
  isNafathVerified: boolean;
  trustScore: number;
  documents?: any[];
}

export class PropertyVerificationStatusDto {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  isRegaVerified: boolean;
  sakNumber?: string;
  status?: string;
  price: number;
  createdAt: Date;
}