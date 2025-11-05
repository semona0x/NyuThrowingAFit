import { useParams, Link } from "react-router-dom";
import { getArticleBySlug } from "../../data/articles";

export const ArticlePage: React.FC = () => {
  const { slug } = useParams();
  const article = getArticleBySlug(slug || "");

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-8">
        <div>
          <p className="text-2xl font-semibold mb-4">Article not found</p>
          <Link to="/articles" className="underline">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white text-black">
      <article className="max-w-3xl mx-auto px-6 md:px-8 py-10">
        {/* 面包屑 */}
        <nav className="text-xs text-zinc-500 mb-4">
          <Link to="/" className="underline">Home</Link> <span> / </span>
          <Link to="/articles" className="underline">Articles</Link> <span> / </span>
          <span className="text-zinc-700">{article.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          {article.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {article.author ? `${article.author} • ` : ""}{article.date}
        </p>

        {/* 首图 */}
        <div className="mt-6 rounded-2xl overflow-hidden bg-zinc-100">
          <img src={article.cover} alt={article.title} className="w-full object-cover" />
        </div>

        {/* 正文 */}
        <div className="prose prose-zinc max-w-none mt-8">
          {article.content.map((b, i) => {
            if (b.type === "p") return <p key={i}>{b.text}</p>;
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "img")
              return (
                <figure key={i} className="my-8">
                  <img src={b.src} alt={b.alt || ""} className="rounded-xl w-full object-cover" />
                  {b.caption && (
                    <figcaption className="mt-2 text-xs text-zinc-500">
                      {b.caption}
                    </figcaption>
                  )}
                </figure>
              );
            return null;
          })}
        </div>
      </article>
    </main>
  );
};
