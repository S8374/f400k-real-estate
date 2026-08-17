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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const message_dto_1 = require("./dto/message.dto");
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    async startConversation(req, dto) {
        const userId = req.user.userId;
        return this.messageService.startConversation(userId, dto);
    }
    async getConversations(req) {
        const userId = req.user.userId;
        return this.messageService.getConversations(userId);
    }
    async getHistory(req, conversationId, limit) {
        const userId = req.user.userId;
        return this.messageService.getMessageHistory(userId, conversationId, limit);
    }
    async updateMessage(req, messageId, content) {
        const userId = req.user.userId;
        return this.messageService.updateMessage(userId, { messageId, content });
    }
    async deleteMessage(req, messageId) {
        const userId = req.user.userId;
        return this.messageService.deleteMessage(userId, { messageId });
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)('conversation'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_dto_1.StartConversationDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "startConversation", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('history/:conversationId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('edit-message/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Post)('remove-message/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map