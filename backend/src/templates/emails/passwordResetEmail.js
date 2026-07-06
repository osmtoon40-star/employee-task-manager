const buildPasswordResetEmail = ({ name, resetUrl }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Reset your Employee Task Manager password</title>
  </head>
  <body style="margin:0;background:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;background:#0F172A;color:#F8FAFC;">
                <div style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;background:#2563eb;border-radius:9px;font-weight:800;">E</div>
                <span style="margin-left:10px;font-size:16px;font-weight:700;vertical-align:middle;">Employee Task Manager</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 12px;font-size:24px;line-height:32px;color:#111827;">Reset your password</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:24px;color:#4b5563;">Hi ${name}, we received a request to reset the password for your Employee Task Manager account.</p>
                <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:8px;">Reset Password</a>
                <p style="margin:24px 0 0;font-size:14px;line-height:22px;color:#4b5563;">This secure link expires in 15 minutes. If you did not request this change, ignore this email and your password will remain unchanged.</p>
                <div style="margin-top:22px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:10px;background:#f8fafc;color:#64748b;font-size:13px;line-height:20px;">
                  For your security, Employee Task Manager will never ask you to share your password or reset token.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;border-top:1px solid #e5e7eb;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} Employee Task Manager. Enterprise Task Management.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

module.exports = buildPasswordResetEmail;
