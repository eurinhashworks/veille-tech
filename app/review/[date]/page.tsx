import { prisma } from '@/lib/server/prisma';
import { notFound } from 'next/navigation';
import { Share2, Printer, FileDown, Copy } from 'lucide-react';

async function getReview(date: string) {
  const review = await prisma.review.findUnique({
    where: { date: date },
    include: {
      ReviewToTag: { include: { tags: true } },
      sources: true,
      user: true,
    },
  });
  return review;
}

export default async function ReviewDetailPage({ params }: { params: { date: string } }) {
  const review = await getReview(params.date);

  if (!review) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <article className="prose prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{review.formattedDate}</h1>
          <div className="text-slate-400">
            <span>Par {review.user?.username || 'Auteur inconnu'}</span>
            <span className="mx-2">•</span>
            <span>{review.dominantCategory}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {review.ReviewToTag.map(({ tags }) => (
              <span key={tags.id} className="bg-primary/20 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {tags.name}
              </span>
            ))}
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold border-b border-slate-700 pb-2 mb-4">Résumé Flash</h2>
          <p>{review.flashSummary}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold border-b border-slate-700 pb-2 mb-4">Analyse IA</h2>
          <div dangerouslySetInnerHTML={{ __html: review.aiAnalysis || '' }} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold border-b border-slate-700 pb-2 mb-4">Sources ({review.sources.length})</h2>
          <ul className="space-y-2">
            {review.sources.map((source) => (
              <li key={source.id}>
                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="sticky bottom-8">
            <div className="mx-auto max-w-sm p-3 bg-dark-800/80 backdrop-blur-lg border border-slate-700 rounded-full flex justify-around items-center shadow-lg">
                <button className="flex flex-col items-center text-slate-300 hover:text-white transition-colors">
                    <Share2 className="w-6 h-6"/>
                    <span className="text-xs mt-1">Partager</span>
                </button>
                <button className="flex flex-col items-center text-slate-300 hover:text-white transition-colors">
                    <Printer className="w-6 h-6"/>
                    <span className="text-xs mt-1">Imprimer</span>
                </button>
                <button className="flex flex-col items-center text-slate-300 hover:text-white transition-colors">
                    <FileDown className="w-6 h-6"/>
                    <span className="text-xs mt-1">Markdown</span>
                </button>
                 <button className="flex flex-col items-center text-slate-300 hover:text-white transition-colors">
                    <Copy className="w-6 h-6"/>
                    <span className="text-xs mt-1">Copier</span>
                </button>
            </div>
        </section>
      </article>
    </div>
  );
}
