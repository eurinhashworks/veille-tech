import { Resend } from 'resend';
import { CONFIG } from '../config';

// Initialisation de Resend avec la clé API de l'environnement
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

/**
 * Service central d'envoi d'e-mails via Resend
 * 
 * @param options - Options de l'e-mail (destinataire, sujet, corps HTML)
 * @returns - Résultat de l'envoi
 */
export const sendEmail = async (options: EmailOptions) => {
    try {
        const { to, subject, html, from } = options;

        const { data, error } = await resend.emails.send({
            from: from || CONFIG.MAIL.FROM,
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('❌ Erreur Resend:', error);
            throw new Error(`Détails Resend: ${error.message}`);
        }

        console.log('📧 E-mail envoyé avec succès:', data?.id);
        return { success: true, id: data?.id };
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'e-mail:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
};

/**
 * Envoie une notification de bienvenue à un nouvel utilisateur
 */
export const sendWelcomeEmail = async (email: string, username: string) => {
    return sendEmail({
        to: email,
        subject: `Bienvenue sur ${CONFIG.APP_NAME} !`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #333;">Bonjour ${username},</h2>
                <p>Bienvenue sur <strong>${CONFIG.APP_NAME}</strong>, votre outil de veille technologique intelligente.</p>
                <p>Nous sommes ravis de vous compter parmi nous.</p>
                <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
                    <p style="margin: 0;">Commencez dès maintenant à explorer les dernières tendances tech !</p>
                </div>
                <p style="margin-top: 30px;">L'équipe ${CONFIG.APP_NAME}</p>
            </div>
        `
    });
};
