# Original Requirements (verbatim)
building a fashion website called nyu throwing a fit and i need distinguished title NYUThrowingAFit
Use design style: Artistic (like Nike)

Embed this Instagram Post: https://www.instagram.com/nyuthrowingafit/
Must use English language to response me.

# Single Sentence Overview:
- This project is a single-page, high-impact fashion brand website for "NYUThrowingAFit," designed to capture an edgy, artistic aesthetic by mimicking Nike's visual language and driving engagement to the brand's Instagram feed.

# Goals & Success
- **Primary Goal:** Create a visually stunning "brand statement" page that establishes the "NYUThrowingAFit" identity as artistic, bold, and modern.
- **Success Metric #1:** Visitor scrolls down to the embedded Instagram feed section.
- **Success Metric #2:** Visitor clicks the "Follow on IG" CTA.
- **Success Metric #3:** [Inferred—Confidence: High] Visitor submits their email through the newsletter signup form to capture leads for future drops or news.

# Scope & Priority
- **CRITICAL:** A single `HomePage` will be created containing all sections. No other pages will be built.
- **P0: Hero Section:** A full-screen, visually arresting hero with the brand title.
- **P0: Instagram Embed Section:** A dedicated section to display the Instagram feed as requested.
- **P1: Manifesto Section:** [Inferred] A short, typography-driven section to define the brand's ethos.
- **P1: Final CTA / Email Capture:** [Inferred] A section to encourage newsletter signups. This form MUST be fully functional.
- **P0: Footer:** Mandatory footer with "Made with Heyboss.ai" link.

# World-Class Design System (tight token table)

**Style Reference Process:**
1.  **Industry Analysis:** The project is for a fashion brand with an "artistic" and edgy feel.
2.  **Reference Selection:** The user explicitly requested **Nike** as the design style reference. This is a perfect match for a modern, bold, and athletic-adjacent fashion aesthetic.
3.  **Enhancement Rule:** We will strictly adhere to Nike's design principles for maximum visual impact.
4.  **Nike Default Rule:** User's choice aligns with the default high-impact style, ensuring a world-class outcome.

**Style Reference:** "Nike (reason: explicitly requested by user, and its bold, high-contrast, typography-driven style is a perfect fit for an edgy fashion brand)."
**IP Disclaimer:** "Inspiration only—no copying brand assets/logos/text; convert into neutral tokens below."

**DESIGN FAILURE PREVENTION CHECKLIST:**
✅ Specific company name mentioned as style reference: **Nike**
✅ Exact font names from the company: **Futura Bold Condensed** (or a close alternative like `Anton`), and `Inter`.
✅ Specific color codes from company palette: `#111111` (Off-Black), `#FFFFFF` (White).
✅ Detailed layout descriptions mimicking company patterns: **Asymmetrical grids, full-screen hero, generous whitespace**.
✅ At least 8 specific company style references throughout different sections: **Included below**.
✅ Hero section designed with company's specific layout patterns: **Nike's signature full-screen, text-centric hero**.
✅ Typography scales and sizing from company's actual design: **Specified in section details**.
✅ Specific spacing, margins, and visual hierarchy patterns: **Specified in section details**.

| Token | Value | Notes |
| --- | --- | --- |
| Primary | `#FFFFFF` (White) | For text and key elements, mimicking Nike's high-contrast on dark backgrounds. |
| Surface | `#111111` (Off-Black) | Main background color. Avoids pure #000 for a more premium, Nike-like feel. |
| Radius | `0px` | Sharp, geometric corners, reflecting Nike's bold and precise aesthetic. |
| Shadow | `none` | We will rely on contrast and layout, not shadows, for depth, following Nike's modern design. |
| Heading Font | `Futura Bold Condensed`, `Anton` | **CRITICAL:** Use the exact Futura Bold Condensed font, a hallmark of Nike's brand. `Anton` is a strong web-safe fallback. |
| Body Font | `Inter` | A clean, highly-readable sans-serif that complements the boldness of Futura, similar to Nike's functional body copy fonts. |
**Signature Moment:** A full-screen hero where the title "NYUThrowingAFit" appears in massive, uppercase Futura Bold Condensed font. The letters animate in slightly for a dynamic, Nike-style entrance.

# Pages & Interactions (tight table)
| Page/Section | Key Content | Primary CTA → Action |
| --- | --- | --- |
| **Home** | Contains Hero, Manifesto, Instagram Feed, Final CTA, and Footer sections. | "Explore" → `/#feed` |

---

### **Section Details: `HomePage`**

#### **1. Hero Section (`#hero`)**
-   **ID & Purpose:** `hero`. To make a bold, unforgettable first impression that screams "fashion" and "artistic," directly inspired by Nike's iconic hero sections.
-   **Copy:**
    -   Headline: `NYUThrowingAFit`
-   **Component/Interaction Notes:**
    -   **Layout:** Full-screen (`100vh`). The background will be a high-quality, muted, black-and-white video loop of abstract urban textures or street fashion shots (if no video is available, use a static high-contrast fashion photograph).
    -   **Typography:** The headline will be set in massive `Futura Bold Condensed` (e.g., `14vw`), uppercase, colored white (`#FFFFFF`). It should be centered, dominating the screen in true **Nike fashion**.
    -   **CTA:** A single, minimalist text link or ghost button at the bottom center: "Explore", which smoothly scrolls to the `#feed` section.
-   **Visual Notes:** Mimic **Nike's** dramatic, minimalist hero sections. The entire focus is on the powerful typography and atmospheric background. Generous negative space is key.

#### **2. Manifesto Section (`#manifesto`)**
-   **ID & Purpose:** `manifesto`. [Inferred] To quickly establish the brand's voice and attitude using short, punchy copy, a technique often used by **Nike**.
-   **Copy:**
    -   Headline: `[Inferred—Confidence: High]` **WE DON'T FOLLOW.**
    -   Body: `[Inferred—Confidence: High]` **WE ARE THE MOVEMENT. BORN ON THE STREETS OF NYC. THIS ISN'T JUST A LOOK, IT'S A STATEMENT.**
-   **Component/Interaction Notes:**
    -   **Layout:** Employ a **Nike-style asymmetrical layout**. The headline and body text are left-aligned in a column taking up ~40% of the screen width, with empty space on the right to create tension and focus.
    -   **Typography:** Headline in `Futura Bold Condensed` (`48px`), body text in `Inter` (`18px`), all in white (`#FFFFFF`). The line breaks must be short and impactful, another **Nike** signature.

#### **3. Instagram Feed Section (`#feed`)**
-   **ID & Purpose:** `feed`. To fulfill the user's core requirement of embedding the Instagram content, making it the centerpiece of the page.
-   **Copy:**
    -   Headline: `[Inferred—Confidence: High]` **THE FEED**
    -   CTA Button: `[Inferred—Confidence: High]` **FOLLOW ON IG**
-   **Component/Interaction Notes:**
    -   **Layout:** A full-width section with significant padding on the top and bottom to make it a focal point, as **Nike** does with its product showcases.
    -   **Headline:** Centered, large `Futura Bold Condensed` (`72px`).
    -   **Embed:** The Instagram feed will be embedded here. Since Instagram does not provide a native profile grid embed, this will require a third-party service (like Lightwidget or Snapwidget). The component should be a container that holds the `<iframe>` or script from the service.
    -   **CTA:** Below the embed, a large, solid white button with black text. This button will link directly to the Instagram URL: `https://www.instagram.com/nyuthrowingafit/` and open in a new tab. This button style mimics **Nike's** clear, unmissable call-to-action buttons.

#### **4. Final CTA Section (`#subscribe`)**
-   **ID & Purpose:** `subscribe`. [Inferred] To capture user emails for future communication, building an audience.
-   **Copy:**
    -   Headline: `[Inferred—Confidence: High]` **JOIN THE MOVEMENT.**
    -   Sub-headline: `[Inferred—Confidence: High]` Get exclusive access to drops, events, and stories.
-   **Component/Interaction Notes:**
    -   **Layout:** A clean, centered layout. The design should be minimalist to focus attention on the action, a pattern seen in **Nike's** conversion-focused footers.
    -   **Form:** A single input field for "Email Address" with a submit button labeled "SUBMIT". The form MUST be functional and connected to a backend endpoint to collect emails.
    -   **Typography:** Headline in `Futura Bold Condensed` (`48px`), sub-headline in `Inter` (`16px`).

#### **5. Footer Section (`#footer`)**
-   **ID & Purpose:** `footer`. To provide site credits as required.
-   **Copy:** `Made with ` <a href="https://heyboss.ai" style="color: #0066cc; text-decoration: underline;">Heyboss.ai</a>
-   **Component/Interaction Notes:**
    -   The text should be small, centered, and unobtrusive at the very bottom of the page. This maintains the clean, premium **Nike aesthetic** while fulfilling requirements.

# Assumptions, Inferences & Open Questions
-   **[Inferred—Confidence: High]** You want a single, impactful landing page to launch the brand, not a multi-page e-commerce site at this stage.
-   **[Inferred—Confidence: High]** The brand's aesthetic is edgy, urban, and minimalist, making the requested Nike design style a perfect fit.
-   **[Inferred—Confidence: Medium]** The provided URL (`https://www.instagram.com/nyuthrowingafit/`) is for the profile, so the intent is to embed the entire photo grid. This requires a third-party tool, as Instagram doesn't offer a native profile embed.
-   **[Inferred—Confidence: High]** I have added a newsletter signup form as a crucial feature for a new brand to build its audience. This will be a fully functional form.

-   **Open Questions:**
    1.  The provided Instagram link is to a profile page. Are you okay with using a third-party tool (like Lightwidget) to embed the grid, or did you want to feature one specific post instead?
    2.  Do you have a specific high-contrast, black-and-white video loop or photograph you'd like to use for the hero background?
    3.  Is the primary call-to-action to "Follow on Instagram" or to "Sign up for the newsletter"? I can prioritize one over the other in the design.