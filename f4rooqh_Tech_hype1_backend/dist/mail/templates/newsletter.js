"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsletterAdminEmail = getNewsletterAdminEmail;
const styles_1 = require("./styles");
function getNewsletterAdminEmail(subscriberEmail) {
    return `
    <div style="${(0, styles_1.getBaseStyle)()}">
      <div style="${(0, styles_1.getHeaderStyle)()}">
        <h1 style="margin: 0; color: #1a202c;">New Newsletter Subscriber!</h1>
      </div>
      <p>Hello Admin,</p>
      <p>A new user has subscribed to the newsletter.</p>
      <p><strong>Email:</strong> ${subscriberEmail}</p>
      <div style="${(0, styles_1.getFooterStyle)()}">
        <p>&copy; ${new Date().getFullYear()} SakRuya. All rights reserved.</p>
      </div>
    </div>
  `;
}
//# sourceMappingURL=newsletter.js.map