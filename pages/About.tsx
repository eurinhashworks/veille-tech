import React from 'react';
import { Info, Zap, Mail, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Info className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white">À Propos</h1>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-accent-ia/20 border border-primary/30 rounded-xl p-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Zap className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">TechPulse.ai</h2>
            <p className="text-slate-300">Le futur de la veille technologique</p>
          </div>
        </div>
        <p className="text-slate-200 leading-relaxed">
          TechPulse AI est une application de veille technologique alimentée par l'intelligence artificielle.
          Elle génère quotidiennement des revues tech complètes en analysant les dernières actualités
          du monde du développement, du cloud, de la cybersécurité et de l'IA.
        </p>
      </section>

      {/* Features */}
      <section className="bg-dark-800 border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Fonctionnalités</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Génération IA</h4>
              <p className="text-sm text-slate-400">Revues tech générées par Google Gemini</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-ia/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-accent-ia" />
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Sources vérifiées</h4>
              <p className="text-sm text-slate-400">Grounding avec Google Search</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-dark-800 border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Google Gemini API', 'Lucide Icons'].map(tech => (
            <span key={tech} className="px-3 py-1.5 bg-dark-900 border border-slate-700 rounded-lg text-sm text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-dark-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
        <div className="space-y-3">
          <a href="mailto:contact@eurinhash.com" 
             className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-900 transition-colors group">
            <Mail className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span className="text-slate-300 group-hover:text-white">contact@eurinhash.com</span>
          </a>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-900/50">
            <Info className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 text-sm">Pour toute question ou suggestion</span>
          </div>
        </div>
      </section>

      <div className="mt-8 text-center text-slate-500 text-sm">
        Version 1.0.0 • Créé avec ❤️ pour la communauté tech
      </div>
    </div>
  );
};

export default About;
