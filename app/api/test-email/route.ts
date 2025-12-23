import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/server/mailService'; // Updated path
import { auth } from '@/auth';

export async function POST(req: Request) {
    const session = await auth();
    // Only authenticated users can send test emails
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: 'L\'adresse e-mail est requise dans le corps de la requête ({ "email": "..." }).' }, { status: 400 });
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
            return NextResponse.json({
                success: true,
                message: 'E-mail de test envoyé avec succès.',
                resendId: result.id
            });
        } else {
            return NextResponse.json({
                error: 'Échec de l\'envoi de l\'e-mail.',
                details: result.error
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Erreur endpoint test-email:', error);
        return NextResponse.json({ error: 'Erreur serveur interne lors de l\'envoi du test.' }, { status: 500 });
    }
}
