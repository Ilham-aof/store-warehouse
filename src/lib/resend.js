import "server-only";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPassword(email, resetUrl, userName) {
  const { data, error } = await resend.emails.send({
    from: "Store Warehouse <onboarding@resend.dev>",
    to: email,
    subject: "Reset Password Store Warehouse",
    html: `
  <div style="
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    font-family: Arial, Helvetica, sans-serif;
    color: #333333;
    background-color: #ffffff;
  ">
    <h2 style="
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      color: #18181b;
      margin: 0 0 30px;
    ">
      Reset Password
    </h2>

<p style="font-size: 18px; line-height: 1.5; margin: 0 0 10px;">
  Kepada <strong>${userName}</strong>,
</p>

<p style="font-size: 18px; text-align: justify; line-height: 1.5; margin: 0 0 10px;">
  Kami menerima permintaan untuk mengatur ulang password akun Anda. Jika Anda tidak meminta reset password, abaikan email ini.   Jika Anda memang meminta pengaturan ulang kata sandi, silakan tekan tombol di bawah ini.
</p>

    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          background-color: #1e293b;
          color: #fef9c3;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>
    </div>

    <p style="
      font-size: 16px;
      line-height: 1.7;
      color: #71717a;
      margin: 25px 0 0;
      text-align: center;
    ">
      Link berlaku selama 15 menit.
    </p>
  </div>
`,
  });

  if (error) {
    return {
      success: false,
      error,
    };
  }

  return {
    success: true,
    data,
  };
}
