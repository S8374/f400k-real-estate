"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommonEmail = getCommonEmail;
const styles_1 = require("./styles");
function getCommonEmail(title, message) {
    return `
    <div style="${(0, styles_1.getBaseStyle)()}">
      <div style="${(0, styles_1.getHeaderStyle)()}">
        <h1 style="margin: 0; color: #1a202c;">${title}</h1>
      </div>
      <p>Hello,</p>
      <p>${message}</p>
      <div style="${(0, styles_1.getFooterStyle)()}">
        <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
      </div>
    </div>
  `;
}
//# sourceMappingURL=common.js.map