// src/data/articles.ts

export type Article = {
  id: string;
  slug: string;               // 用于路由
  title: string;
  excerpt: string;            // 首页预览文案
  cover: string;              // 封面图
  date: string;
  author?: string;
  content: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "img"; src: string; alt?: string; caption?: string }
  >;
};

export const articles: Article[] = [
  // ========= 文章 1：Ölend =========
  {
    id: "olend-takes-nyc",
    slug: "olend-takes-nyc",
    title: "Ölend Takes New York: The Everyday Bag Everyone’s Talking About",
    excerpt:
      "On NYC streets this fall, Ölend’s functional-meets-minimal bag is everywhere. Here’s how the city’s coolest girls are styling it.",
    cover: "/hero/article001.png",
    date: "October 28, 2025",
    author: "Jamie Alanna Bloom",
    content: [
      {
        type: "p",
        text:
          "There’s a new bag making waves on the streets of New York, and the city’s coolest girls can’t stop talking about it. The Ölend bag has become the essential accessory of the season, spotted everywhere from SoHo coffee runs to late-afternoon classes at NYU. Whether it’s holding laptops, notebooks, or the usual 'just-in-case' essentials, NYC girls are declaring that they can’t leave the house without it. The buzz? It’s equal parts functionality and style — that perfect balance of structured minimalism with a soft, effortless touch. So, we hit the streets to see just how the girls are styling their Ölend bags this fall."
      },

      { type: "h2", text: "1. Orange Crush" },
      { type: "img", src: "/hero/article002.jpg" },
      {
        type: "p",
        text:
          "A pop of color never hurt anyone, especially when it’s this good. The orange Ona Soft Bag brings warmth and personality to even the simplest outfits. One girl styles hers with a tan zip-front utility coat and dark-wash jeans, grounding the look with crisp white sneakers featuring maroon accents. The orange steals the show here, bold, confident, and unapologetically bright against a neutral fall palette."
      },

      { type: "h2", text: "2. The Leopard Revival" },
      { type: "img", src: "/hero/article003.jpg" },
      {
        type: "p",
        text:
          "Leopard is officially back, and it’s rewriting the rules of fall fashion. One downtown girl pairs her Ölend with a white cable-knit sweater and fitted jeans, finishing the look with black Adidas Sambas and (of course) wired headphones. It’s that signature NYC combination of old-school ease and modern polish."
      },

      { type: "h2", text: "3. Monochrome in Motion" },
      { type: "img", src: "/hero/article004.jpg" },
      {
        type: "p",
        text:
          "All-black, always timeless, but never boring. This look is pure understated sophistication: a sleek black tank tucked into tailored trousers, finished with glossy patent heels. The royal blue Ölend bag brings a soft hit of color that tones down the formality and makes the look feel effortlessly daytime-ready."
      },

      { type: "h2", text: "4. Lemon Quiet Luxury" },
      { type: "img", src: "/hero/article005.jpg" },
      {
        type: "p",
        text:
          "The color of calm confidence. She’s wearing a crisp white tank and matching jeans cinched with a bold black belt, a classic base that allows the lemon-yellow bag to shine. The look is tied together with velvet loafers featuring a golden emblem that echoes the bag’s tone. Quiet luxury that whispers rather than shouts."
      },

      { type: "h2", text: "5. The Red Edit" },
      { type: "img", src: "/hero/article006.jpg" },
      {
        type: "p",
        text:
          "For those craving just a hint of romance, the red bag delivers. Styled with a pleated denim midi skirt and a baby-blue button-down, the look feels playful yet poised. A rose-embellished belt adds a touch of softness, while black buckle loafers ground the outfit. Feminine without being fussy — Brooklyn brunch meets modern-day coquette."
      },

      { type: "h2", text: "6. Lower East Side Layers" },
      { type: "img", src: "/hero/article007.jpg" },
      {
        type: "p",
        text:
          "Y2K meets modern minimalism in this downtown moment. The sage green bag is paired with a denim mini skirt, a buttoned vest layered over a crisp collared shirt, and slouchy leather boots. Early-2000s attitude with a 2026 twist — nostalgic, structured, and perfectly imperfect."
      },

      { type: "h2", text: "7. Chocolate: The Color of The Season" },
      { type: "img", src: "/hero/article008.jpg" },
      {
        type: "p",
        text:
          "The chocolate colorway might just be the color of the season. Rich, warm, and endlessly wearable — it’s that new neutral everyone’s reaching for. Styled with an oversized black blazer, crisp white tee, and relaxed distressed jeans. A pair of classic loafers complete the look — polished but still undone."
      },

      { type: "h2", text: "8. The Off-Duty Classic" },
      { type: "img", src: "/hero/article009.jpg" },
      {
        type: "p",
        text:
          "The black Ölend remains the most iconic of them all. Styled with vintage flair, this look screams 'model off-duty': a black ruffled tank, tailored mini shorts, and saddle ankle boots with chain detailing. Oversized sunglasses finish the look — pure downtown energy."
      },

      { type: "h2", text: "9. Stripes Into Fall" },
      { type: "img", src: "/hero/article010.jpg" },
      {
        type: "p",
        text:
          "Summer may be over, but navy stripes are here to stay. She pairs the bag with a black leather trench, fitted mom jeans, and bright white sneakers for that crisp transitional moment. It’s giving coastal ease with city edge — proof stripes can work year-round."
      },

      { type: "img", src: "/hero/article011.jpg", caption: "Jamie Alanna Bloom" },
      {
        type: "p",
        text:
          "Jamie Alanna Bloom is the Public Relations Coordinator at OOTD. She graduated from Syracuse University and brings a trend-aware perspective to brand communication and media strategy. Her experience spans editorial styling, campaign direction, and design — all rooted in a love for subtle elegance and timeless fashion storytelling."
      }
    ]
  },

  // ========= 文章 2：Haute Halloween =========
  {
    id: "haute-halloween-2025",
    slug: "haute-halloween-effortlessly-chic",
    title: "Haute Halloween: How to Achieve an Effortlessly Chic Costume",
    excerpt:
      "Fashion-girl approved Halloween looks you can actually pull off — dramatic, elegant, and re-wearable.",
    cover: "/hero/article101.png",
    date: "October 31, 2025",
    author: "Jamie Alanna Bloom",
    content: [
      {
        type: "p",
        text:
          "Halloween is fast approaching, but when you're part of the fashion world, you're not reaching for the basic, worn-out cat ears buried somewhere in the back of your closet. No, you're looking for a way to elevate your spooky style, something with flair, fashion, and a touch of drama. After some digging (and a lot of scrolling), we've rounded up the most stylish, fashion-girl-approved costume ideas that you can actually pull off this Halloween, and maybe even wear again. Here are some of our absolute favorites:"
      },

      { type: "h2", text: "1. French Cancan Dancer / Showgirl" },
      { type: "img", src: "/hero/article102.jpeg", caption: "Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "If there are feathers involved, consider us already intrigued. Pair them with a vintage corset and you’ve got a costume that won't be collecting dust once November hits. This look is dramatic, glamorous, and head-turning in all the right ways. Whether you’re going full Moulin Rouge or just adding subtle showgirl flair, this ensemble gives you a feminine, classy way to do Halloween without sacrificing your style. Bonus points for red lipstick and a strong champagne-in-hand energy."
      },

      { type: "h2", text: "2. Vintage Sailor" },
      { type: "img", src: "/hero/article103.jpeg", caption: "Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "We’ll always have a soft spot for vintage vibes, especially when it comes to Halloween. But this isn’t your typical “plastic package costume” sailor. We’re talking curated, elegant, and fashion-forward. While navy blue is the classic go-to, try red for a fresh and unexpected take. Think vintage military jackets, crisp white collars, structured captain’s hats, and sleek silhouettes. It’s nautical, but for the runway."
      },

      { type: "h2", text: "3. Marie Antoinette" },
      { type: "img", src: "/hero/article104.jpeg", caption: "Cream off-shoulder corset with lace skirt • Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "\"Let them eat cake\" — but make it fashion. This historical icon never really goes out of style. Think soft blush or cream corsets, layers of lace, pearls, and all the Versailles-worthy accessories. The goal is to make history come alive in the chicest, most decadent way possible."
      },

      { type: "h2", text: "4. Antique Ladybug" },
      { type: "img", src: "/hero/article105.jpeg", caption: "Red polka-dot dress • Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "Over-the-top costumes often end up worn once and forgotten. That’s why we love a simple idea like a ladybug, especially when you can create it from pieces you already own. Add sheer black tights, dainty red wings, and a touch of polka-dot for a playful, trendy take that looks effortless."
      },

      { type: "h2", text: "5. Ringmaster" },
      { type: "img", src: "/hero/article106.jpeg", caption: "Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "We’re officially welcoming back the military coat — and what better excuse than Halloween? A circus-inspired ringmaster look is bold, editorial, and a guaranteed hit. Pair a vintage officer coat with a black mini or shorts, sleek flats or heeled boots, and dramatic eye makeup."
      },

      { type: "h2", text: "6. Runway Witch" },
      { type: "img", src: "/hero/article107.jpeg", caption: "Black hat with veil • Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "Yes, the witch is forever iconic — but she doesn’t have to be cliché. Swap the standard black dress for something sheer, olive-toned, or unexpected. A mossy mini, structured hat, layered vintage jewelry, and a smoky eye brings this classic firmly into 2025."
      },

      { type: "h2", text: "7. Mime" },
      { type: "img", src: "/hero/article108.jpeg", caption: "Lace top, corset, Mary Janes • Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "Channel your inner dark side the understated way. Black and white is timeless, elegant, and easy to style — striped or lace tops, tailored trousers or a skirt, gloves, and face paint with a high-fashion twist. A little drama, a little silence, très Parisienne."
      },

      { type: "h2", text: "8. Medieval Princess" },
      { type: "img", src: "/hero/article109.jpeg", caption: "White medieval dress with gold trim • Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "A timeless take with an antique twist. Go for a flowing dress in soft pastels — muted yellow, powder blue, blush — and add a corset to cinch the waist. Finish with a ribboned hat or delicate headpiece for that regal touch. Castle-core meets editorial."
      },

      { type: "h2", text: "9. 1920s Flapper" },
      { type: "img", src: "/hero/article110.jpeg", caption: "Image Credit: Pinterest" },
      {
        type: "p",
        text:
          "We couldn’t end without the forever-chic flapper. The roaring twenties were all about elegance and excess. Choose fringe or beaded dresses, layer pearls, feathers, sequins — and don’t forget a jeweled headband. Vintage glam with a hint of party girl."
      },

      { type: "img", src: "/hero/article111.jpeg", caption: "Jamie Alanna Bloom" },
      {
        type: "p",
        text:
          "Jamie Alanna Bloom is the Public Relations Coordinator at OOTD. She graduated from Syracuse University, and brings a fresh, trend-aware perspective to brand communication and media strategy. Her experience spans editorial styling and writing, seasonal campaigns, and behind-the-scenes design work, all rooted in a deep love for fashion. She’s especially fond of subtle elegance — and the power of a well-told style story."
      }
    ]
  }
];

// 工具函数保持不变
export const getArticleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);
