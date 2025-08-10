import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { sanitizeString, sanitizeUrl } from '@/lib/validation';

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blogFile = path.join(process.cwd(), 'data', 'blog-posts.json');
  let posts: any[] = [];
  try {
    posts = JSON.parse(await fs.readFile(blogFile, 'utf-8'));
  } catch {}
  const post = posts.find((p) => p.id === params.id);
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto pt-36 pb-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{sanitizeString(post.title, 200)}</h1>
      <div className="text-gray-500 mb-4">{sanitizeString(post.date, 50)} • {sanitizeString(post.author, 100)}</div>
      {post.image && (
        <img src={sanitizeUrl(post.image)} alt={sanitizeString(post.title, 200)} className="mb-6 rounded-lg max-h-96 object-cover w-full" />
      )}
      <div className="prose prose-lg max-w-none mb-8">
        {sanitizeString(post.content, 10000)}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-4">
          <span className="font-semibold text-gray-700">Etiketler: </span>
          {post.tags.map((tag: string) => (
            <span key={tag} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-2">{sanitizeString(tag, 50)}</span>
          ))}
        </div>
      )}
    </div>
  );
} 