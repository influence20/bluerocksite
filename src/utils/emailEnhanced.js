const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * Enhanced email utility for BlueRock Asset Management
 * Supports HTML emails, templates, and attachments
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Initialize template cache
    this.templates = {};
  }

  /**
   * Load an email template from file
   * @param {string} templateName - Name of the template file (without extension)
   * @returns {Promise<Function>} - Compiled Handlebars template function
   */
  async loadTemplate(templateName) {
    // Check if template is already cached
    if (this.templates[templateName]) {
      return this.templates[templateName];
    }

    // Template path
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    
    try {
      // Read template file
      const templateSource = await fs.promises.readFile(templatePath, 'utf8');
      
      // Compile template
      const template = handlebars.compile(templateSource);
      
      // Cache template
      this.templates[templateName] = template;
      
      return template;
    } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      throw new Error(`Email template ${templateName} not found`);
    }
  }

  /**
   * Send an email using a template
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.templateName - Name of the template to use
   * @param {Object} options.data - Data to pass to the template
   * @param {Array} options.attachments - Optional attachments
   * @returns {Promise<void>}
   */
  async sendTemplateEmail(options) {
    try {
      // Load template
      const template = await this.loadTemplate(options.templateName);
      
      // Render HTML with data
      const html = template(options.data);
      
      // Define email options
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html,
        // Plain text alternative
        text: options.text || this.htmlToText(html),
        // Optional attachments
        attachments: options.attachments || []
      };
      
      // Send email
      await this.transporter.sendMail(mailOptions);
      
      return true;
    } catch (error) {
      console.error('Error sending template email:', error);
      throw error;
    }
  }

  /**
   * Send a simple email without a template
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.message - Plain text message
   * @param {string} options.html - Optional HTML content
   * @param {Array} options.attachments - Optional attachments
   * @returns {Promise<void>}
   */
  async sendEmail(options) {
    try {
      // Define email options
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || '',
        attachments: options.attachments || []
      };
      
      // Send email
      await this.transporter.sendMail(mailOptions);
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send OTP email
   * @param {Object} options - OTP email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.otp - One-time password
   * @param {string} options.expiryTime - OTP expiry time
   * @param {string} options.purpose - Purpose of the OTP
   * @returns {Promise<void>}
   */
  async sendOTPEmail(options) {
    try {
      return await this.sendTemplateEmail({
        email: options.email,
        subject: `Your OTP for ${options.purpose} - BlueRock Asset Management`,
        templateName: 'otp',
        data: {
          name: options.name,
          otp: options.otp,
          expiryTime: options.expiryTime,
          purpose: options.purpose,
          year: new Date().getFullYear()
        }
      });
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new users
   * @param {Object} options - Welcome email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @returns {Promise<void>}
   */
  async sendWelcomeEmail(options) {
    try {
      return await this.sendTemplateEmail({
        email: options.email,
        subject: 'Welcome to BlueRock Asset Management',
        templateName: 'welcome',
        data: {
          name: options.name,
          loginUrl: `${process.env.FRONTEND_URL || 'https://bluerock-asset.com'}/login`,
          year: new Date().getFullYear()
        }
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send account verification email
   * @param {Object} options - Verification email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.verificationToken - Verification token
   * @returns {Promise<void>}
   */
  async sendVerificationEmail(options) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'https://bluerock-asset.com'}/verify-email/${options.verificationToken}`;
      
      return await this.sendTemplateEmail({
        email: options.email,
        subject: 'Verify Your Email - BlueRock Asset Management',
        templateName: 'verification',
        data: {
          name: options.name,
          verificationUrl,
          year: new Date().getFullYear()
        }
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param {Object} options - Password reset email options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.resetToken - Password reset token
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(options) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'https://bluerock-asset.com'}/reset-password/${options.resetToken}`;
      
      return await this.sendTemplateEmail({
        email: options.email,
        subject: 'Password Reset - BlueRock Asset Management',
        templateName: 'password-reset',
        data: {
          name: options.name,
          resetUrl,
          year: new Date().getFullYear()
        }
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send withdrawal notification email
   * @param {Object} options - Withdrawal notification options
   * @param {string} options.email - Recipient email
   * @param {string} options.name - Recipient name
   * @param {string} options.withdrawalId - Withdrawal ID
   * @param {number} options.amount - Withdrawal amount
   * @param {string} options.status - Withdrawal status
   * @param {string} options.notes - Optional notes
   * @returns {Promise<void>}
   */
  async sendWithdrawalNotification(options) {
    try {
      return await this.sendTemplateEmail({
        email: options.email,
        subject: `Withdrawal ${options.status.charAt(0).toUpperCase() + options.status.slice(1)} - BlueRock Asset Management`,
        templateName: 'withdrawal-notification',
        data: {
          name: options.name,
          withdrawalId: options.withdrawalId,
          amount: options.amount.toFixed(2),
          status: options.status,
          notes: options.notes,
          year: new Date().getFullYear()
        }
      });
    } catch (error) {
      console.error('Error sending withdrawal notification:', error);
      throw error;
    }
  }

  /**
   * Convert HTML to plain text (simple version)
   * @param {string} html - HTML content
   * @returns {string} - Plain text
   */
  htmlToText(html) {
    // Very simple HTML to text conversion
    return html
      .replace(/<style[^>]*>.*?<\/style>/gs, '')
      .replace(/<script[^>]*>.*?<\/script>/gs, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
module.exports = emailService;