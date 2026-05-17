import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { name, email, phone, employeeSize } = await req.json();

        const apiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.BREVO_SENDER_EMAIL || 'yusrflow@gmail.com';

        if (!apiKey) {
            console.error('BREVO_API_KEY is not set');
            return NextResponse.json({ error: 'Mail service not configured' }, { status: 500 });
        }

        // 1. Send Confirmation Email to User
        const userEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'Yusrflow', email: senderEmail },
                to: [{ email: email, name: name }],
                subject: 'Welcome to the First 50 | Yusrflow',
                htmlContent: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Congratulations, ${name}!</h2>
                        <p>You have successfully entered the queue for Yusrflow's Early Adopter Program.</p>
                        <p>We are excited to help your business automate NDMO/PDPL compliance and optimize SaaS efficiency.</p>
                        <p>Our team will reach out to you shortly at ${phone} to discuss the next steps.</p>
                        <br />
                        <p>Best regards,<br />The Yusrflow Team</p>
                    </div>
                `,
            }),
        });

        // 2. Send Notification Email to Yusrflow Team
        const adminEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'Yusrflow System', email: senderEmail },
                to: [{ email: 'yusrflow@gmail.com', name: 'Yusrflow Team' }],
                subject: 'New Lead: ' + name,
                htmlContent: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>New Early Access Application</h2>
                        <p><strong>Company:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Employee Size:</strong> ${employeeSize}</p>
                    </div>
                `,
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
