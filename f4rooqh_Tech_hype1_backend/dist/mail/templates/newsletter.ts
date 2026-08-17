import {
  getBaseStyle,
  getHeaderStyle,
  getFooterStyle,
} from './styles';

export function getNewsletterAdminEmail(subscriberEmail: string): string {
  return `
    <div style="${getBaseStyle()}">
      <div style="${getHeaderStyle()}">
        <h1 style="margin: 0; color: #1a202c;">New Newsletter Subscriber!</h1>
      </div>
      <p>Hello Admin,</p>
      <p>A new user has subscribed to the newsletter.</p>
      <p><strong>Email:</strong> ${subscriberEmail}</p>
      <div style="${getFooterStyle()}">
        <p>&copy; ${new Date().getFullYear()} SakRuya. All rights reserved.</p>
      </div>
    </div>
  `;
}
