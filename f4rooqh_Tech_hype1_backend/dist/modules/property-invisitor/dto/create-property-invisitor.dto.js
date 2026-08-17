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
exports.CreatePropertyInvisitorDto = exports.Relationship = exports.IdType = void 0;
const class_validator_1 = require("class-validator");
var IdType;
(function (IdType) {
    IdType["PASSPORT"] = "PASSPORT";
    IdType["NATIONAL_ID"] = "NATIONAL_ID";
    IdType["DRIVING_LICENSE"] = "DRIVING_LICENSE";
    IdType["RESIDENT_ID"] = "RESIDENT_ID";
    IdType["OTHER"] = "OTHER";
})(IdType || (exports.IdType = IdType = {}));
var Relationship;
(function (Relationship) {
    Relationship["OWNER"] = "OWNER";
    Relationship["TENANT"] = "TENANT";
    Relationship["FAMILY_MEMBER"] = "FAMILY_MEMBER";
    Relationship["FRIEND"] = "FRIEND";
    Relationship["COLLEAGUE"] = "COLLEAGUE";
    Relationship["LEGAL_REPRESENTATIVE"] = "LEGAL_REPRESENTATIVE";
    Relationship["OTHER"] = "OTHER";
})(Relationship || (exports.Relationship = Relationship = {}));
class CreatePropertyInvisitorDto {
    propertyId;
    userId;
    name;
    email;
    phoneNumber;
    relationship;
    idNumber;
    idType;
    additionalInfo;
}
exports.CreatePropertyInvisitorDto = CreatePropertyInvisitorDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 255),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Relationship),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "idNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(IdType),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "idType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 1000),
    __metadata("design:type", String)
], CreatePropertyInvisitorDto.prototype, "additionalInfo", void 0);
//# sourceMappingURL=create-property-invisitor.dto.js.map