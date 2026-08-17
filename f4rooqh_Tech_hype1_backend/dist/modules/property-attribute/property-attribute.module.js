"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyAttributeModule = void 0;
const common_1 = require("@nestjs/common");
const property_attribute_service_1 = require("./property-attribute.service");
const property_attribute_controller_1 = require("./property-attribute.controller");
let PropertyAttributeModule = class PropertyAttributeModule {
};
exports.PropertyAttributeModule = PropertyAttributeModule;
exports.PropertyAttributeModule = PropertyAttributeModule = __decorate([
    (0, common_1.Module)({
        controllers: [property_attribute_controller_1.PropertyAttributeController],
        providers: [property_attribute_service_1.PropertyAttributeService],
        exports: [property_attribute_service_1.PropertyAttributeService],
    })
], PropertyAttributeModule);
//# sourceMappingURL=property-attribute.module.js.map