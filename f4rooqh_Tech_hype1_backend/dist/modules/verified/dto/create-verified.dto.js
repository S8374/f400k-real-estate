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
exports.VerificationFilterDto = exports.VerifyPropertyDto = exports.VerifyAgentDto = void 0;
const class_validator_1 = require("class-validator");
class VerifyAgentDto {
    agentId;
    adminId;
    isRegaVerified;
    isNafathVerified;
    notes;
}
exports.VerifyAgentDto = VerifyAgentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VerifyAgentDto.prototype, "agentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VerifyAgentDto.prototype, "adminId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyAgentDto.prototype, "isRegaVerified", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyAgentDto.prototype, "isNafathVerified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyAgentDto.prototype, "notes", void 0);
class VerifyPropertyDto {
    propertyId;
    adminId;
    isRegaVerified;
    sakNumber;
    notes;
}
exports.VerifyPropertyDto = VerifyPropertyDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VerifyPropertyDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VerifyPropertyDto.prototype, "adminId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyPropertyDto.prototype, "isRegaVerified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyPropertyDto.prototype, "sakNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyPropertyDto.prototype, "notes", void 0);
class VerificationFilterDto {
    type;
    pendingOnly;
    agentId;
}
exports.VerificationFilterDto = VerificationFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerificationFilterDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerificationFilterDto.prototype, "pendingOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], VerificationFilterDto.prototype, "agentId", void 0);
//# sourceMappingURL=create-verified.dto.js.map