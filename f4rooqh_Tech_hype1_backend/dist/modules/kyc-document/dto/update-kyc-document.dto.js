"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKycDocumentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const create_kyc_document_dto_1 = require("./create-kyc-document.dto");
const client_1 = require("@prisma/client");
class UpdateKycDocumentDto extends (0, mapped_types_1.PartialType)(create_kyc_document_dto_1.CreateKycDocumentDto) {
    id;
    verificationStatus;
    rejectionReason;
}
exports.UpdateKycDocumentDto = UpdateKycDocumentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateKycDocumentDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.KycStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateKycDocumentDto.prototype, "verificationStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateKycDocumentDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=update-kyc-document.dto.js.map