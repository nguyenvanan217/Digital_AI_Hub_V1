import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendResetPasswordEmail({
    to,
    fromApp = 'admin',
}: {
    to: string;
    fromApp: 'admin' | 'web';
}): Promise<void> {
    try {
        const payload = {
            email: to,
            action: 'reset_password',
        };

        const resetToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5m' });
        const url = `${fromApp === 'admin' ? process.env.APP_URL : process.env.WEB_URL}/reset-password?token=${resetToken}`;
        await resend.emails.send({
            from: 'Trường Mầm non Vân Trường <no-reply@vangbacdatan.com>',
            to,
            subject: 'Đặt lại mật khẩu',
            html: `
                <h2>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ tài khoản của bạn.</p>
                    <p>Vui lòng nhấn vào nút bên dưới để đặt lại:</p>
                    <p>Lưu ý đường dẫn chỉ cho hiệu lực trong 5 phút!</p>
                     <a href="${url}" 
                        style="
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                        ">
                        Đặt lại mật khẩu
                    </a>
      `,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
