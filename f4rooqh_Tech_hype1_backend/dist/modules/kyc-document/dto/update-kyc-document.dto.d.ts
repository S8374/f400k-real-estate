import { CreateKycDocumentDto } from './create-kyc-document.dto';
import { KycStatus } from '@prisma/client';
declare const UpdateKycDocumentDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateKycDocumentDto>>;
export declare class UpdateKycDocumentDto extends UpdateKycDocumentDto_base {
    id?: string;
    verificationStatus?: KycStatus;
    rejectionReason?: string;
}
export {};
