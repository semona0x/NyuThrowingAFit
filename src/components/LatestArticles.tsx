import { Link } from "react-router-dom";
import { articles } from "../data/articles";

export const LatestArticles: React.FC = () => {
  return (
    <section className="px-6 md:px-8 py-12 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Latest Articles</h2>
          <Link
            to="/articles"
            className="text-sm px-3 py-1.5 rounded-full bg-black text-white hover:opacity-90"
          >
            See more
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((a) => (
            <Link
              key={a.id}
              to={`/articles/${a.slug}`}
              className="group block rounded-2xl overflow-hidden bg-zinc-100 hover:bg-zinc-200/50 transition"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={a.cover}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold leading-snug line-clamp-2">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 line-clamp-2">
                  {a.excerpt}
                </p>
                <p className="mt-2 text-xs text-zinc-500">{a.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
