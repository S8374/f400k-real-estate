import { VerifyAgentDto, VerifyPropertyDto } from './create-verified.dto';
declare const CombinedVerifyDto_base: import("@nestjs/mapped-types").MappedType<VerifyAgentDto & VerifyPropertyDto>;
export declare class CombinedVerifyDto extends CombinedVerifyDto_base {
}
declare const UpdateVerifiedDto_base: import("@nestjs/mapped-types").MappedType<Partial<CombinedVerifyDto>>;
export declare class UpdateVerifiedDto extends UpdateVerifiedDto_base {
    id?: string;
}
export {};
