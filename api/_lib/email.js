import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || 'admin@thewealth-mindset.com';

/**
 * Sends a confirmation email for event registration
 */
export async function sendRegistrationConfirmation(registrant, event) {
    const isPaid = (event.amount && event.amount > 0);
    const refPrefix = event.paymentReference ? `[Ref: ${event.paymentReference}] ` : '';
    const subject = `${refPrefix}${isPaid ? 'Action Required: Payment' : 'Confirmed'}: ${event.title}`;

    try {
        const { data, error } = await resend.emails.send({
            from: `The Wealth Mindset <${fromEmail}>`,
            to: [registrant.email],
            subject: subject,
            html: `
                <div style="font-family: 'Poppins', sans-serif; background-color: #05060f; color: #eef2f6; padding: 40px; border-radius: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://thewealth-mindset.com/WealthMindset-removebg.png" alt="Legacy Wealth" style="height: 60px; width: auto;">
                    </div>
                    
                    <h1 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 15px; text-align: center;">
                        ${isPaid ? 'Secure Your Seat' : 'Registration Confirmed!'}
                    </h1>
                    
                    <p>Hello ${registrant.firstName},</p>
                    <p>
                        ${isPaid
                    ? `You've taken the first step toward attending <strong>${event.title}</strong>. Please complete your payment using the reference below to finalize your registration.`
                    : `Your registration for <strong>${event.title}</strong> is confirmed. We look forward to seeing you!`}
                    </p>
                    
                    <div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 15px; margin: 25px 0; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="margin-bottom: 20px;">
                            <h3 style="margin-top: 0; color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</h3>
                            <div style="background-color: #6366f1; color: white; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 20px; font-weight: bold; display: inline-block;">
                                ${event.paymentReference || 'GGC-REG-PENDING'}
                            </div>
                            <p style="font-size: 12px; color: #9ca3af; margin-top: 8px;">Please keep this reference code for your records${isPaid ? ' and use it as your payment reference' : ''}.</p>
                        </div>
                        
                        <h3 style="margin-top: 25px; color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Event Details</h3>
                        <p style="margin: 8px 0;"><strong>Date:</strong> ${event.displayDate || 'TBD'}</p>
                        <p style="margin: 8px 0;"><strong>Venue:</strong> ${event.venue || 'TBD'}</p>
                        <p style="margin: 8px 0;"><strong>Address:</strong> ${event.address || 'TBD'}</p>
                        
                        ${isPaid ? `
                            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 25px 0;">
                            <h3 style="margin-top: 0; color: #6366f1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Payment Summary</h3>
                            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${event.currency} ${event.amount}</p>
                            <p style="font-size: 13px; color: #9ca3af; line-height: 1.6;">
                                Send your Proof of Payment to our team via WhatsApp or reply to this email to expedite your verification.
                            </p>
                        ` : ''}
                    </div>

                    <p style="line-height: 1.6;">Our team will reach out shortly with any additional information or technical requirements for the session.</p>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
                        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                            © 2026 The Wealth Mindset · Legacy, Tradition, & Wealth
                        </p>
                        <p style="font-size: 10px; color: #4b5563; margin-top: 8px;">
                            This is an automated message. Please keep your reference code secure.
                        </p>
                    </div>
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
