/**
 * CommunityFits – smooth horizontal auto-scrolling gallery (no remount on hover)
 * - Hover 仅通过 useRef 暂停，不触发重渲染
 * - multipliedFits 用 useMemo 固定，key 稳定
 * - requestAnimationFrame 只初始化一次
 * - 只用 transform 做 hover 动画，避免回流
 */

import React, { useEffect, useMemo, useRef } from 'react';

type Fit = { id: number; image: string; caption: string };

const sampleFits: Fit[] = [
  { id: 1, image: '/hero/IMG_1473.jpg', caption: 'Street style vibes' },
  { id: 2, image: '/hero/IMG_1474.jpg', caption: 'Urban chic' },
  { id: 3, image: '/hero/IMG_1475.jpg', caption: 'Minimalist aesthetic' },
  { id: 4, image: '/hero/IMG_1476.jpg', caption: 'Bold patterns' },
  { id: 5, image: '/hero/IMG_1477.jpg', caption: 'Classic cuts' },
  { id: 6, image: '/hero/IMG_1478.jpg', caption: 'Trendy layers' },
  { id: 7, image: '/hero/IMG_1479.jpg', caption: 'Casual elegance' },
];


export const CommunityFits: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 用 ref 存暂停状态（不触发渲染）
  const isPausedRef = useRef(false);
  const handleEnter = () => { isPausedRef.current = true; };
  const handleLeave = () => { isPausedRef.current = false; };

  // 将内容重复两次做无缝轮播（总宽度的一半为原始内容）
  const multipliedFits = useMemo(() => {
    const dup = 2; // 重复两遍足够无缝
    return Array.from({ length: dup }).flatMap((_, g) =>
      sampleFits.map((f) => ({ ...f, _group: g }))
    );
  }, []);

  // 只初始化一次的 RAF 循环
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId = 0;
    const speed = 0.6; // 每帧滚动像素，按需微调

    const loop = () => {
      // 不重渲染，只读 ref 控制
      if (!isPausedRef.current) {
        el.scrollLeft += speed;

        // 原始内容宽度 = 总宽度 / 2（因为重复了两遍）
        const total = el.scrollWidth;
        const half = total / 2;
        // 超过半程后回退 half，实现无缝
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    // 开始动画
    rafId = requestAnimationFrame(loop);

    // 清理
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="community-fits" className="py-32 px-8 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-['Anton'] uppercase mb-8 motion-preset-slide-up">
            Community<br />Fits
          </h2>
          <p className="text-xl text-gray-700 font-['Inter'] max-w-2xl mx-auto">
            Share your style. Inspire the community. Every fit tells a story.
          </p>
        </div>

        {/* Horizontal Scrolling Gallery */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-8 overflow-x-hidden"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {multipliedFits.map((fit, index) => (
              <div
                key={`${fit.id}-${(fit as any)._group}-${index % sampleFits.length}`}
                className="flex-shrink-0 group"
                style={{ minWidth: '288px' }}
              >
                <div className="card relative w-72 h-96 md:h-[480px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 overflow-hidden transform hover:-translate-y-2 will-change-transform">
                  <img
                    src={fit.image}
                    alt={fit.caption}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />
                  {/* 渐变罩层（可加文字时用） */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Touch Scrolling Hint */}
        <div className="text-center mt-8 md:hidden">
          <p className="text-sm text-gray-500 font-['Inter']">Swipe to explore more fits →</p>
        </div>
      </div>

      {/* 隐藏滚动条（跨浏览器） */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};
