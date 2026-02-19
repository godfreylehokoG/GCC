import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'admin@thewealth-mindset.com';

/**
 * Sends a confirmation email for event registration
 */
export async function sendRegistrationConfirmation(registrant, event) {
    try {
        const { data, error } = await resend.emails.send({
            from: `The Wealth Mindset <${fromEmail}>`,
            to: [registrant.email],
            subject: `Registration Confirmed: ${event.title}`,
            html: `
                <div style="font-family: 'Poppins', sans-serif; background-color: #05060f; color: #eef2f6; padding: 40px; border-radius: 20px;">
                    <h1 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">Registration Confirmed!</h1>
                    <p>Hello ${registrant.firstName},</p>
                    <p>Thank you for registering for the <strong>${event.title}</strong>. We are excited to have you join us!</p>
                    
                    <div style="background-color: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 15px; margin: 25px 0; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <h3 style="margin-top: 0; color: #fbbf24;">Event Details</h3>
                        <p><strong>Date:</strong> ${event.displayDate || 'TBD'}</p>
                        <p><strong>Time:</strong> ${event.time || 'TBD'}</p>
                        <p><strong>Venue:</strong> ${event.venue || 'TBD'}</p>
                        <p><strong>Address:</strong> ${event.address || 'TBD'}</p>
                    </div>

                    <p>Our team will reach out shortly with any additional information or technical requirements for the session.</p>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #9ca3af;">
                        © 2026 The Wealth Mindset · Legacy, Tradition, & Wealth
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error (Registration):', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send registration email:', err);
        return { success: false, error: err };
    }
}

/**
 * Sends a confirmation email for general lead interest
 */
export async function sendLeadConfirmation(lead) {
    try {
        const { data, error } = await resend.emails.send({
            from: `The Wealth Mindset <${fromEmail}>`,
            to: [lead.email],
            subject: `Welcome to The Wealth Mindset`,
            html: `
                <div style="font-family: 'Poppins', sans-serif; background-color: #05060f; color: #eef2f6; padding: 40px; border-radius: 20px;">
                    <h1 style="color: #a855f7; border-bottom: 2px solid #a855f7; padding-bottom: 10px;">Welcome to the Journey</h1>
                    <p>Hello ${lead.firstName},</p>
                    <p>Thank you for expressing interest in <strong>The Wealth Mindset</strong>. You have taken the first step toward transforming your financial future.</p>
                    
                    <p>You have been added to our VIP list for early access to our South African tour information and upcoming wealth masterclasses.</p>

                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Mark our emails as "Important" so you don't miss any updates.</li>
                        <li>Join our weekly Zoom sessions every Tuesday at 19:00 CAT.</li>
                    </ul>

                    <p>We look forward to connecting with you soon.</p>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #9ca3af;">
                        © 2026 The Wealth Mindset · Legacy, Tradition, & Wealth
                    </p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error (Lead):', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send lead email:', err);
        return { success: false, error: err };
    }
}
