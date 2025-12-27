# 🚀 GUIDE RAPIDE - CORRECTION AUTHENTIFICATION

## ✅ Votre schéma Prisma est DÉJÀ CORRECT !

La table `Verification` existe déjà dans votre `schema.prisma` (lignes 66-75).

## 🔧 Commandes à Exécuter (Dans l'ordre)

### **1. Générer le Client Prisma**
```bash
npx prisma generate
```

### **2. Pousser vers la Base de Données**
```bash
npx prisma db push
```

### **3. Vérifier que tout fonctionne**
```bash
npx prisma studio
```
Cela ouvrira une interface web pour voir vos tables.

---

## 📧 Configuration Email avec Resend

### **1. Installer Resend**
```bash
npm install resend
```

### **2. Ajouter à `.env`**
```env
RESEND_API_KEY=re_votre_clé_resend_ici
```

### **3. Créer le service email**

Créez le fichier `lib/email.ts` :

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'EUREKA <onboarding@resend.dev>', // Changez en production
      to: [email],
      subject: 'Votre code de connexion EUREKA',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; background: #f3f4f6; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; }
              .logo { text-align: center; margin-bottom: 30px; }
              .logo h1 { color: #10b981; font-size: 32px; margin: 0; }
              .code-box { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
              .code { font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #111827; font-family: 'Courier New', monospace; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <h1>✨ EUREKA</h1>
              </div>
              <h2 style="color: #111827; margin-bottom: 20px;">Votre code de connexion</h2>
              <p style="color: #6b7280; line-height: 1.6;">
                Utilisez le code ci-dessous pour vous connecter à votre compte EUREKA :
              </p>
              <div class="code-box">
                <div class="code">${otp}</div>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                ⏱️ Ce code expire dans <strong>10 minutes</strong>.
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                Si vous n'avez pas demandé ce code, ignorez cet email.
              </p>
              <div class="footer">
                <p>© 2024 EUREKA - Intelligence Tech par IA</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return { success: false, error };
    }

    console.log('✅ Email envoyé:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error };
  }
}
```

### **4. Mettre à jour `auth.ts`**

Modifiez votre fichier `auth.ts` :

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendOTP } from "@/lib/email";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailOtp: {
    enabled: true,
    sendVerificationOtp: async ({ email, otp }) => {
      console.log(`📧 Envoi OTP à ${email}: ${otp}`);
      const result = await sendOTP(email, otp);
      if (!result.success) {
        throw new Error('Échec envoi email');
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
});

export type Session = typeof auth.$Infer.Session;
```

---

## 🎯 Flux Utilisateur Final

### **Connexion avec Email + OTP**

1. **Utilisateur va sur `/login`**
2. **Entre son email** → `user@example.com`
3. **Clique "Envoyer le code"**
4. **Reçoit un email** avec le code à 6 chiffres
5. **Entre le code** → `123456`
6. **Connexion réussie** → Redirection `/dashboard`

### **Avantages de ce système**

✅ **Pas de mot de passe** → Moins de friction
✅ **Plus sécurisé** → Code temporaire (10 min)
✅ **Meilleure UX** → Pas besoin de "mot de passe oublié"
✅ **Moins de support** → Pas de réinitialisation de mot de passe

---

## 📝 Variables d'Environnement Complètes

Votre fichier `.env` doit contenir :

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="votre_secret_super_long_et_aleatoire"
BETTER_AUTH_URL="http://localhost:3000"

# Resend Email
RESEND_API_KEY="re_votre_clé_resend"

# Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY="votre_clé_gemini"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🧪 Tester l'Authentification

### **1. Démarrer le serveur**
```bash
npm run dev
```

### **2. Aller sur la page login**
```
http://localhost:3000/login
```

### **3. Tester le flux**
- Entrer votre email
- Vérifier la console pour voir le code OTP
- Entrer le code
- Vérifier la redirection vers `/dashboard`

---

## ⚠️ En Production

### **Changements nécessaires** :

1. **Email "from"** : Changer `onboarding@resend.dev` par votre domaine
2. **BETTER_AUTH_URL** : Changer par votre URL de production
3. **Vérification email** : Activer `requireEmailVerification: true`
4. **HTTPS** : Obligatoire en production

---

## 🆘 Dépannage

### **Problème : "Table verifications does not exist"**
```bash
npx prisma db push --force-reset
npx prisma generate
```

### **Problème : "Email not sent"**
- Vérifier `RESEND_API_KEY` dans `.env`
- Vérifier les logs de Resend Dashboard
- Tester avec `onboarding@resend.dev` d'abord

### **Problème : "Session expired"**
- Vérifier `BETTER_AUTH_SECRET` est défini
- Vérifier les cookies dans le navigateur
- Nettoyer les cookies et réessayer

---

## ✅ Checklist Finale

- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté
- [ ] `npm install resend` exécuté
- [ ] `lib/email.ts` créé
- [ ] `auth.ts` mis à jour
- [ ] `.env` configuré avec RESEND_API_KEY
- [ ] Serveur redémarré
- [ ] Test de connexion réussi

---

**Votre authentification sera 100% fonctionnelle ! 🎉**
