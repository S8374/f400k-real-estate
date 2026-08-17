"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyVerificationStatusDto = exports.AgentVerificationStatusDto = void 0;
class AgentVerificationStatusDto {
    userId;
    fullName;
    email;
    agencyName;
    licenseId;
    isRegaVerified;
    isNafathVerified;
    trustScore;
    documents;
}
exports.AgentVerificationStatusDto = AgentVerificationStatusDto;
class PropertyVerificationStatusDto {
    id;
    title;
    agentId;
    agentName;
    isRegaVerified;
    sakNumber;
    status;
    price;
    createdAt;
}
exports.PropertyVerificationStatusDto = PropertyVerificationStatusDto;
//# sourceMappingURL=verification-status.dto.js.map