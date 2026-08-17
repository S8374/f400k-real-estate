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
exports.BulkCreatePropertyViewDto = exports.CreatePropertyViewDto = exports.ViewSource = void 0;
const class_validator_1 = require("class-validator");
var ViewSource;
(function (ViewSource) {
    ViewSource["WEBSITE"] = "WEBSITE";
    ViewSource["MOBILE_APP"] = "MOBILE_APP";
    ViewSource["SOCIAL_MEDIA"] = "SOCIAL_MEDIA";
    ViewSource["EMAIL"] = "EMAIL";
    ViewSource["WHATSAPP"] = "WHATSAPP";
    ViewSource["DIRECT_LINK"] = "DIRECT_LINK";
    ViewSource["SEARCH_ENGINE"] = "SEARCH_ENGINE";
    ViewSource["REFERRAL"] = "REFERRAL";
    ViewSource["ADMIN_PANEL"] = "ADMIN_PANEL";
    ViewSource["OTHER"] = "OTHER";
})(ViewSource || (exports.ViewSource = ViewSource = {}));
class CreatePropertyViewDto {
    propertyId;
    userId;
    source;
    viewedAt;
}
exports.CreatePropertyViewDto = CreatePropertyViewDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePropertyViewDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePropertyViewDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ViewSource),
    __metadata("design:type", String)
], CreatePropertyViewDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePropertyViewDto.prototype, "viewedAt", void 0);
class BulkCreatePropertyViewDto {
    propertyId;
    userId;
    source;
    viewedAt;
    sessionId;
}
exports.BulkCreatePropertyViewDto = BulkCreatePropertyViewDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkCreatePropertyViewDto.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BulkCreatePropertyViewDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ViewSource),
    __metadata("design:type", String)
], BulkCreatePropertyViewDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkCreatePropertyViewDto.prototype, "viewedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkCreatePropertyViewDto.prototype, "sessionId", void 0);
//# sourceMappingURL=create-property-view.dto.js.map