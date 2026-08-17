"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('CurrentUser decorator - request.user:', request.user);
    if (!request.user) {
        console.log('CurrentUser decorator - user is undefined');
        return null;
    }
    return request.user;
});
//# sourceMappingURL=current-user.decorator.js.map