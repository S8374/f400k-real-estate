"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBuyerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_buyer_dto_1 = require("./create-buyer.dto");
class UpdateBuyerDto extends (0, mapped_types_1.PartialType)(create_buyer_dto_1.CreateBuyerDto) {
}
exports.UpdateBuyerDto = UpdateBuyerDto;
//# sourceMappingURL=update-buyer.dto.js.map