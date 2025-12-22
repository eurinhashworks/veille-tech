import express from 'express';
import { sendEmail } from '../lib/mailService';

/**
 * Endpoint de test pour l'envoi d'e-mails via Resend
 * POST /api/test-email
 */
export default async function testEmailHandler(req: express.Request, res: express.Response) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'L\'adresse e-mail est requise dans le corps de la requête ({ "email": "..." }).' });
    }

    try {
        const result = await sendEmail({
            to: email,
            subject: 'Test de configuration Resend - Eureka AI',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1 style="color: #4f46e5;">Bravo !</h1>
                    <p>Si vous recevez cet e-mail, c'est que votre configuration <strong>Resend</strong> est opérationnelle sur Eureka AI.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Ceci est un e-mail de test automatisé.</p>
                </div>
            `
        });

        if (result.success) {
            return res.json({
                success: true,
                message: 'E-mail de test envoyé avec succès.',
                resendId: result.id
            });
        } else {
            return res.status(500).json({
                error: 'Échec de l\'envoi de l\'e-mail.',
                details: result.error
            });
        }
    } catch (error) {
        console.error('Erreur endpoint test-email:', error);
        return res.status(500).json({ error: 'Erreur serveur interne lors de l\'envoi du test.' });
    }
}
