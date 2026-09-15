// lib/notifications.ts
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

interface ContactNotificationPayload {
  artistName: string;
  artistSlug: string;
  visitorName?: string;
  visitorEmail?: string;
  contactType: string;
  message?: string;
}

export async function sendAdminContactNotification(payload: ContactNotificationPayload) {
  try {
    const settings = await db.notificationSetting.findFirst();
    if (!settings || !settings.enabled || !settings.adminEmail) {
      console.log("Notifications disabled or unconfigured.");
      return { success: false, reason: "disabled" };
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost || process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: settings.smtpPort || parseInt(process.env.SMTP_PORT || "587", 10),
      auth: {
        user: settings.smtpUser || process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });

    const mailOptions = {
      from: `"Dayton Rich System" <no-reply@daytonrich.com>`,
      to: settings.adminEmail,
      subject: `[Lead / Contact] New inquiry for artist: ${payload.artistName}`,
      text: `Hello Admin,\n\nA visitor has interacted with ${payload.artistName} via ${payload.contactType}.\n\nVisitor Name: ${payload.visitorName || "Not Provided"}\nVisitor Email: ${payload.visitorEmail || "Not Provided"}\nMessage: ${payload.message || "None"}\n\nView Artist Profile: https://daytonrich.com/artists/${payload.artistSlug}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #111; color: #eee; border-radius: 8px;">
          <h2 style="color: #10b981;">New Artist Contact Inquiry</h2>
          <p><strong>Artist:</strong> ${payload.artistName}</p>
          <p><strong>Interaction Type:</strong> ${payload.contactType}</p>
          <hr style="border-color: #333;" />
          <p><strong>Visitor Name:</strong> ${payload.visitorName || "Not Provided"}</p>
          <p><strong>Visitor Email:</strong> ${payload.visitorEmail || "Not Provided"}</p>
          <p><strong>Message:</strong> ${payload.message || "None provided"}</p>
          <br/>
          <a href="https://daytonrich.com/artists/${payload.artistSlug}" style="background: #10b981; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Profile</a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err: any) {
    // Log error securely without exposing SMTP credentials in plain text or stack
    console.error("Email notification delivery failure:", err.message);
    return { success: false, error: err.message };
  }
}