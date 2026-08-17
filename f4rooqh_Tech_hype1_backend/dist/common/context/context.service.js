"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ContextService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextService = exports.REQUEST_ID_KEY = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("./storage");
exports.REQUEST_ID_KEY = 'requestId';
let ContextService = ContextService_1 = class ContextService {
    logger = new common_1.Logger(ContextService_1.name);
    getStore() {
        const store = storage_1.requestContext.getStore();
        if (!store) {
            this.logger.warn('AsyncLocalStorage store not found. Middleware may be missing.');
            return new Map();
        }
        return store;
    }
    get(key) {
        return this.getStore().get(key);
    }
    set(key, value) {
        this.getStore().set(key, value);
    }
    getRequestId() {
        return this.get(exports.REQUEST_ID_KEY);
    }
};
exports.ContextService = ContextService;
exports.ContextService = ContextService = ContextService_1 = __decorate([
    (0, common_1.Injectable)()
], ContextService);
//# sourceMappingURL=context.service.js.map