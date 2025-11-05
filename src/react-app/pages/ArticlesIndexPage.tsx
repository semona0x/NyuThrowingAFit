import { Link } from "react-router-dom";
import { articles } from "../../data/articles";

export const ArticlesIndexPage: React.FC = () => {
  return (
    <main className="bg-white text-black min-h-screen">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-['Anton'] uppercase tracking-tight">
              Latest Articles
            </h1>
            <p className="mt-3 text-zinc-500 text-base md:text-lg">
              Stories, drops, and culture from the community that wears it.
            </p>
          </div>
          <Link
            to="/"
            className="text-sm md:text-base underline underline-offset-4 text-zinc-500 hover:text-black transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/articles/${a.slug}`}
              className="group block rounded-3xl overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={a.cover}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-zinc-400">
                  {a.date}
                </p>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold leading-snug line-clamp-2">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 line-clamp-3">
                  {a.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-zinc-800 group-hover:text-black transition-colors">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
