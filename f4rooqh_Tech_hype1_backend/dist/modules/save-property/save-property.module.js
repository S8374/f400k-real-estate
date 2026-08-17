"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedListingModule = void 0;
const common_1 = require("@nestjs/common");
const save_property_controller_1 = require("./save-property.controller");
const save_property_service_1 = require("./save-property.service");
let SavedListingModule = class SavedListingModule {
};
exports.SavedListingModule = SavedListingModule;
exports.SavedListingModule = SavedListingModule = __decorate([
    (0, common_1.Module)({
        controllers: [save_property_controller_1.SavedListingController],
        providers: [save_property_service_1.SavedListingService],
        exports: [save_property_service_1.SavedListingService],
    })
], SavedListingModule);
//# sourceMappingURL=save-property.module.js.map