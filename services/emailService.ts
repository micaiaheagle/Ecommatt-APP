import { EmailNotification, User } from '../types';

const STORAGE_KEY = 'ECOMATT_EMAIL_QUEUE';
export const emailQueue: EmailNotification[] = [];

export const sendEmail = async (to: string, subject: string, body: string, type: 'signup' | 'verification' | 'alert' | 'reminder'): Promise<EmailNotification> => {
  const notification: EmailNotification = {
    id: `email_${Date.now()}`,
    to,
    subject,
    body,
    type,
    status: 'pending'
  };
  emailQueue.push(notification);
  saveEmailQueue(emailQueue);
  setTimeout(async () => {
    notification.status = 'sent';
    notification.sentAt = new Date().toISOString();
    updateEmailStatus(notification);
    console.log(`[EMAIL SENT] ${subject} to ${to}`);
  }, 500);
  return notification;
};

export const sendVerificationEmail = async (user: User, code: string): Promise<EmailNotification> => {
  const subject = 'Verify Your Ecomatt Account';
  const body = `<h2>Welcome to Ecomatt Farm Management!</h2><p>Hi ${user.name},</p><p>Your verification code is: <strong>${code}</strong></p><p>This code expires in 24 hours.</p><p>If you didn't request this, please ignore this email.</p><p>Best regards,<br/>Ecomatt Team</p>`;
  return sendEmail(user.email, subject, body, 'verification');
};

export const sendWelcomeEmail = async (user: User): Promise<EmailNotification> => {
  const subject = 'Welcome to Ecomatt Farm Management';
  const body = `<h2>Account Verified!</h2><p>Hi ${user.name},</p><p>Your account has been successfully verified. You can now access all features of Ecomatt Farm Management.</p><p>Get started by completing your farm profile in the onboarding section.</p><p>Best regards,<br/>Ecomatt Team</p>`;
  return sendEmail(user.email, subject, body, 'signup');
};

export const sendAlertEmail = async (to: string, title: string, message: string): Promise<EmailNotification> => {
  const subject = `Ecomatt Alert: ${title}`;
  const body = `<h2>${title}</h2><p>${message}</p><p>Log in to your Ecomatt Farm Management account to take action.</p><p>Best regards,<br/>Ecomatt Team</p>`;
  return sendEmail(to, subject, body, 'alert');
};

export const saveEmailQueue = (queue: EmailNotification[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const loadEmailQueue = (): EmailNotification[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const updateEmailStatus = (notification: EmailNotification): void => {
  const queue = loadEmailQueue();
  const index = queue.findIndex(e => e.id === notification.id);
  if (index !== -1) {
    queue[index] = notification;
    saveEmailQueue(queue);
  }
};

export const getEmailHistory = (): EmailNotification[] => {
  return loadEmailQueue();
};