import React, { useState } from 'react';
import { Download, FileText, Mail, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { Review } from '../types';
import Button from '../components/Button';

interface ExportProps {
  review: Review;
}

const Export: React.FC<ExportProps> = ({ review }) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const exportAsPDF = () => {
    window.print();
  };

  const exportAsMarkdown = () => {
    const content = `${review.content}\n\n---\n\n**Avis de l'IA:**\n${review.metadata.aiAnalysis}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revue-tech-${review.metadata.date}.md`;
    a.click();
  };

  const exportAsHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Revue Tech - ${review.metadata.date}</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #2563eb; }
    h2 { color: #1e40af; margin-top: 30px; }
    .meta { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="meta">
    <strong>Date:</strong> ${review.metadata.formattedDate}<br>
    <strong>Auteur:</strong> ${review.metadata.username}<br>
    <strong>Catégorie:</strong> ${review.metadata.dominantCategory}
  </div>
  ${review.content.replace(/\n/g, '<br>')}
  <hr>
  <p><strong>Avis de l'IA:</strong> ${review.metadata.aiAnalysis}</p>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revue-tech-${review.metadata.date}.html`;
    a.click();
  };

  const copyToClipboard = () => {
    const text = `${review.content}\n\n---\n\nAvis de l'IA: ${review.metadata.aiAnalysis}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateShareLink = () => {
    const link = `${window.location.origin}?review=${review.metadata.id}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="bg-dark-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-white">Export & Partage</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Button
          onClick={exportAsPDF}
          variant="secondary"
          className="flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Exporter en PDF
        </Button>

        <Button
          onClick={exportAsMarkdown}
          variant="secondary"
          className="flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Exporter en Markdown
        </Button>

        <Button
          onClick={exportAsHTML}
          variant="secondary"
          className="flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Exporter en HTML
        </Button>

        <Button
          onClick={copyToClipboard}
          variant="secondary"
          className="flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copié !' : 'Copier le texte'}
        </Button>

        <Button
          onClick={generateShareLink}
          variant="secondary"
          className="flex items-center justify-center gap-2 md:col-span-2"
        >
          <LinkIcon className="w-4 h-4" />
          Générer un lien de partage
        </Button>
      </div>

      {shareLink && (
        <div className="mt-4 p-3 bg-dark-900 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-500 mb-2">Lien de partage:</p>
          <p className="text-sm text-primary font-mono break-all">{shareLink}</p>
        </div>
      )}
    </div>
  );
};

export default Export;
