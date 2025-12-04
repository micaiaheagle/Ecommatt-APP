
// Email Service for Ecommatt Farm App
// Uses EmailJS for client-side email sending (requires configuration)

// TODO: Replace these with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

interface EmailData {
    to_email: string;
    to_name?: string;
    subject: string;
    message: string;
    [key: string]: any;
}

export const sendEmail = async (data: EmailData): Promise<boolean> => {
    console.log(`[EmailService] Attempting to send email to ${data.to_email}...`);
    
    // Check if EmailJS is configured (Basic check)
    if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.warn('[EmailService] EmailJS not configured. Simulating success.');
        console.log('[EmailService] Payload:', data);
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    }

    try {
        // Dynamic import to avoid build errors if package is missing, 
        // though typically you'd install 'emailjs-com' or '@emailjs/browser'
        // For this implementation, we will use a fetch implementation to the EmailJS API 
        // to avoid dependency issues if the package isn't installed.
        
        const payload = {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: data
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log('[EmailService] Email sent successfully!');
            return true;
        } else {
            const errorText = await response.text();
            console.error('[EmailService] Failed to send email:', errorText);
            return false;
        }
    } catch (error) {
        console.error('[EmailService] Error sending email:', error);
        return false;
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    return sendEmail({
        to_email: email,
        to_name: name,
        subject: 'Welcome to Ecommatt Farm Manager',
        message: `Hi ${name},\n\nWelcome to Ecommatt Farm Manager! We are excited to have you on board.\n\nBest Regards,\nThe Ecommatt Team`
    });
};

export const sendVerificationEmail = async (email: string, code: string) => {
    return sendEmail({
        to_email: email,
        subject: 'Verify your Ecommatt Account',
        message: `Your verification code is: ${code}`
    });
};

export const sendAlertEmail = async (emails: string[], subject: string, message: string) => {
    // EmailJS usually sends to one recipient at a time unless using a specific feature.
    // We will loop for now or just send to the first one for the prototype.
    console.log(`[EmailService] Sending alert to ${emails.length} recipients.`);
    
    const results = await Promise.all(emails.map(email => 
        sendEmail({
            to_email: email,
            subject: `[ALERT] ${subject}`,
            message: message
        })
    ));

    return results.every(r => r === true);
};