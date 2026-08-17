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
exports.AdminVerifyKycDto = exports.CreateKycDocumentDto = exports.DocumentType = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
var DocumentType;
(function (DocumentType) {
    DocumentType["PASSPORT"] = "PASSPORT";
    DocumentType["NATIONAL_ID"] = "NATIONAL_ID";
    DocumentType["DRIVING_LICENSE"] = "DRIVING_LICENSE";
    DocumentType["RESIDENT_ID"] = "RESIDENT_ID";
    DocumentType["PROOF_OF_ADDRESS"] = "PROOF_OF_ADDRESS";
    DocumentType["BANK_STATEMENT"] = "BANK_STATEMENT";
    DocumentType["TAX_CERTIFICATE"] = "TAX_CERTIFICATE";
    DocumentType["COMPANY_REGISTRATION"] = "COMPANY_REGISTRATION";
    DocumentType["TRADE_LICENSE"] = "TRADE_LICENSE";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
class CreateKycDocumentDto {
    userId;
    documentType;
    fileUrl;
    notes;
}
exports.CreateKycDocumentDto = CreateKycDocumentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateKycDocumentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(DocumentType),
    __metadata("design:type", String)
], CreateKycDocumentDto.prototype, "documentType", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateKycDocumentDto.prototype, "fileUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateKycDocumentDto.prototype, "notes", void 0);
class AdminVerifyKycDto {
    documentId;
    adminId;
    status;
    rejectionReason;
}
exports.AdminVerifyKycDto = AdminVerifyKycDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdminVerifyKycDto.prototype, "documentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AdminVerifyKycDto.prototype, "adminId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.KycStatus),
    __metadata("design:type", String)
], AdminVerifyKycDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], AdminVerifyKycDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=create-kyc-document.dto.js.map