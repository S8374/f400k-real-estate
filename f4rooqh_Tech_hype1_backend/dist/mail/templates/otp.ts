import { getBaseStyle, getHeaderStyle, getFooterStyle } from './styles';

export function getOtpEmail(otp: string): string {
  return `
    <div style="${getBaseStyle()} box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); padding: 40px 30px;">
      <div style="${getHeaderStyle()} border-bottom: none; padding-bottom: 0;">
        <img src="https://sakruya.com/logo/logo.png" alt="Sakruya Logo" style="height: 60px; margin-bottom: 15px;" />
        <h1 style="margin: 0; color: #1a202c; font-size: 24px;">Your Login OTP</h1>
      </div>
      <div style="padding: 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
        <p>Hello,</p>
        <p>Please use the following One-Time Password (OTP) to verify your account securely:</p>
      </div>
      <div style="text-align: center; margin: 25px 0;">
        <div style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; background-color: #ecfdf5; padding: 15px 30px; border-radius: 12px; border: 2px dashed #34d399; box-shadow: 0 2px 4px rgba(52, 211, 153, 0.1);">
          ${otp}
        </div>
      </div>
      <div style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
        <p style="margin: 5px 0;">This code will expire in <strong>5 minutes</strong>.</p>
        <p style="margin: 5px 0;">If you did not request this, please ignore this email.</p>
      </div>
      <div style="${getFooterStyle()} margin-top: 40px; padding-top: 25px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Sakruya. All rights reserved.</p>
      </div>
    </div>
  `;
}
