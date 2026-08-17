"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWelcomeEmail = getWelcomeEmail;
const styles_1 = require("./styles");
function getWelcomeEmail(name) {
    return `
    <div style="${(0, styles_1.getBaseStyle)()}">
      <div style="${(0, styles_1.getHeaderStyle)()}">
        <h1 style="margin: 0; color: #1a202c;">Welcome to Our Platform!</h1>
      </div>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Welcome to our platform! We are excited to have you join our community.</p>
      <p>We're dedicated to providing you with the best experience possible.</p>
      <div style="text-align: center;">
        <a href="#" style="${(0, styles_1.getButtonStyle)()}">Get Started</a>
      </div>
      <div style="${(0, styles_1.getFooterStyle)()}">
        <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
      </div>
    </div>
  `;
}
//# sourceMappingURL=welcome.js.map