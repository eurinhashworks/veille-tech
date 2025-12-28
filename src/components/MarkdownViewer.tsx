import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const sections: React.ReactNode[] = [];
  const lines = content.split('\n');
  
  let currentList: React.ReactNode[] = [];
  
  // Helper to parse bold text **text**
  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => 
      part.startsWith('**') && part.endsWith('**') 
      ? <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong> 
      : part
    );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // --- List Item Handling ---
    // Detects - or * at start of line
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        currentList.push(
            <li key={`li-${index}`} className="mb-2 text-slate-300 pl-2 leading-relaxed">
                {parseBold(content)}
            </li>
        );
        return; // Don't add to sections yet, wait for list to end
    }

    // --- List Flushing ---
    // If we were building a list but hit a non-list line, wrap it in <ul> and push to sections
    if (currentList.length > 0) {
        sections.push(
            <ul key={`ul-${index}`} className="list-disc list-inside mb-6 space-y-1 marker:text-primary ml-2">
                {currentList}
            </ul>
        );
        currentList = [];
    }

    if (!trimmed) return; // Ignore empty lines (except to flush lists)

    // --- Headers ---
    if (trimmed.startsWith('# ')) {
        // H1 - Main Title
        sections.push(
            <h1 key={index} className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-8 mt-4 leading-tight">
                {trimmed.slice(2)}
            </h1>
        );
    } else if (trimmed.startsWith('## ')) {
        // H2 - Categories
        sections.push(
            <h2 key={index} className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-slate-700/80 flex items-center gap-3">
                {trimmed.slice(3)}
            </h2>
        );
    } else if (trimmed.startsWith('### ') || trimmed.match(/^\d+\.\s/)) {
         // H3 or Numbered sections (Impact, etc)
         sections.push(
            <h3 key={index} className="text-lg font-bold text-blue-300 mt-6 mb-2 uppercase tracking-wide">
                {trimmed.replace(/^###\s/, '')}
            </h3>
         );
    }
    // --- Blockquote / Punchline ---
    else if (trimmed.startsWith('> ')) {
        sections.push(
            <blockquote key={index} className="border-l-4 border-primary pl-6 py-4 my-8 italic text-lg text-slate-300 bg-slate-800/40 rounded-r-xl shadow-sm">
                "{trimmed.slice(2)}"
            </blockquote>
        );
    }
    // --- Standard Paragraph ---
    else {
        sections.push(
            <p key={index} className="mb-4 text-slate-300 leading-relaxed text-base">
                {parseBold(trimmed)}
            </p>
        );
    }
  });

  // Flush any remaining list items at the end of document
  if (currentList.length > 0) {
      sections.push(
        <ul key="ul-end" className="list-disc list-inside mb-6 space-y-1 marker:text-primary ml-2">
            {currentList}
        </ul>
      );
  }

  return (
    <div className="font-sans selection:bg-primary/30 selection:text-white max-w-none">
        {sections}
    </div>
  );
};

export default MarkdownViewer;