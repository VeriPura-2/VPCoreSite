# VeriPura Style Guide

Source of truth: the live static site (repo VeriPura-2/VPCoreSite). Where this guide and the HTML disagree, the HTML wins, then fix this guide. Reference pages: food.veripura.com (industry solution, source file `food.html`), `core.html` (product), `index.html` (landing).

Use this for every industry solution page and every tool that lives under one (for example halal.veripura.com).

---

## 1. Naming and brand

- Company and landing page: **VeriPura™**. The brand carries the ™ mark, so does every product and solution name built on it.
- **™ rule:** put ™ (as `<sup class="tm">™</sup>`) on the header lockup, on the first mention of the brand in the hero or page text, and after each product or solution name (VeriPura Core™, VeriPura Food™, VeriPura Halal Guardian™). Do not repeat it on every mention in running text. Plain text contexts (email, page titles, meta descriptions) use "VeriPura™" once.
- Product engine: **VeriPura Core™**. Core is a product, not the company name.
- Industry solutions: **VeriPura Food™**, then Building Supplies, Cosmetics, Supplements, Pharma. Never "Edition".
- Tools inside a solution: plain product names, for example Consignment Check, Label Validator, Halal Guardian. Full name on first use: "VeriPura Halal Guardian™".
- Only Food is live. Other industries are shown as examples (dashed card, "Example" tag).
- Header lockup: logo mark (30px) + "VeriPura" + industry word in the accent color + small superscript ™. Industry pages: `<a class="brand"><img class="logo"><span>VeriPura <span class="prod">Food</span><sup class="tm">™</sup></span></a>`. Landing page (no industry word): `<span>VeriPura<sup class="tm">™</sup></span>`.
- A solution page shows "Built on VeriPura Core™" as a small link beside the nav buttons (hidden under 1180px).
- No emoji in the brand, headings, nav or buttons.

## 2. Voice and copy rules

1. **Information, not decisions.** VeriPura never approves, clears or passes a shipment or artwork. Use "findings", "review", "what to review and fix". Never "Hold", "Cleared", "Pass", "Fail", "Approved", "Compliant", "Guaranteed", "Assurance".
2. The user's team makes the decision. Say so where results are shown ("Your team makes the decision").
3. **Maturity.** Anything not built is labeled "Under development". Do not describe it as available. The exception is code figures, which carry the single label "Illustrative".
4. **Access.** Hosted API only. No licensing, no deploy-in-your-cloud, no code handover. Say "engage the rules through our hosted API", never "plug our agents into your app".
5. **No timelines or durations** (no "12-week pilot", no schedules) without Thomas's approval.
6. **Accuracy claims.** Say "measured accuracy for your documents in every pilot". Do not promise labeled test sets or published accuracy reports.
7. **Patent.** Exact wording: "covered under VeriPura's USPTO filing, U.S. provisional patent application 64/088,697". Never "protected".
8. **No em dashes.** Use commas, periods or parentheses.
9. Short sentences. Sentence case headings with a final period on section titles ("What we check."). Active voice. Concrete nouns (consignment, certificate, label, artwork).
10. Unsubstantiated numbers (costs avoided, rejection fees) need a source or come out.
    - **Exception (Thomas, 15 Oct 2026):** the core.html hero line "US$600 per day" for port delays from incomplete or inaccurate documentation stays without a source. Quote it in US$ everywhere. This exception covers that line only.
11. CTA wording: "Free trial" on Food pages. "Discuss a pilot" on all other industry pages. "Check a label", "Check halal artwork" for tools. Not "Send us a shipment" or "Free check". The page does not state trial length or terms (see rule 5); the CTA leads to a conversation.

## 3. Color

Define everything as tokens on `:root`. Never hard-code hex in components except the code block.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | #0F2444 | #E9EFF8 | Text, borders, primary buttons |
| `--ink-2` | #1C3560 | #CBD6E6 | Secondary text |
| `--paper` | #F6F8FB | #0B1424 | Page background |
| `--surface` | #FFFFFF | #111D33 | Cards, inputs, alt sections |
| `--slate` | #44546B | #B2BFD2 | Muted text |
| `--line` | #D8DEE7 | #2A3B57 | Borders, dividers |
| `--line-soft` | #EEF1F5 | #1C2B44 | Subtle dividers |
| `--seal` | #2E55C9 | #8AA8FF | Links, focus, hover, form focus |
| `--brand` | #0F2444 | #16305E | Dark sections |
| `--brand-2` | #1C3560 | #1F3D72 | Dark section accents |
| `--brand-text` | #D3DDEC | #DCE5F2 | Text on dark sections |
| `--brand-muted` | #A9BCDB | #B7C8E6 | Labels on dark sections |
| `--tint`, `--tint-2` | #EEF2FA, #E7ECF8 | #1A2D4D, #1E335A | Tinted fills |
| `--pass` / `--pass-bg` | #2B8A3E / #E6F4EA | #69DB7C / #173B22 | Matched evidence, "Live" tag |
| `--flag` / `--flag-bg` | #A8660F / #FBF0DD | #F2B566 / #3A2A12 | Needs review, "Under development" |
| `--miss` / `--miss-bg` | #A8352A / #F8E4E1 | #F29488 / #3C1B18 | Mismatch, missing |
| `--shadow` | #0F2444 | #3E62B8 | Offset card shadow |
| `--btn-bg` / `--btn-fg` / `--btn-hover` | #0F2444 / #FFF / #1C3560 | #E9EFF8 / #0B1424 / #FFF | Solid button |

Industry accent (`--accent`, `--accent-bg`, dark accent in dark mode):

| Solution | Accent | Accent bg |
|---|---|---|
| Food (and its tools, including Halal) | #0B7285 (dark mode #3BC9DB / #0E3A42) | #E3F4F6 |
| Building Supplies | #5C6B7A | #ECEFF2 |
| Cosmetics | #C2255C | #FCE4EC |
| Supplements | #9C36B5 | #F8F0FC |
| Pharma | #5034C4 | #EEEBFC |

**The accent is used in three places only:** the industry word in the header lockup, the kicker pill, and the hero evidence-folder border and offset shadow. Everything else is navy, slate and white. Do not introduce a new accent for a tool; it inherits its solution's accent.

Dark mode: follows `prefers-color-scheme`, with a manual toggle (a sun or moon icon button) that sets `data-theme` on `<html>` and is remembered. Every page defines tokens three times: light `:root`, `@media (prefers-color-scheme:dark){:root:not([data-theme="light"])}`, and `:root[data-theme="dark"]`. Pass, flag and miss colors are never the only signal; always pair with a label.

## 4. Typography

- Sans: **Schibsted Grotesk** (400 to 900), fallback `system-ui`. Mono: **JetBrains Mono** (400, 500) for step numbers and code.
- Self-hosted from `/fonts/` (variable Schibsted Grotesk, JetBrains Mono 400 and 500, latin and latin-ext, woff2). Declare with `@font-face` and `font-display:swap` at the top of the page stylesheet, and preload the main sans file. Do not load fonts from Google Fonts or any third party.
- Body 17px, line-height 1.55, weight 450. Supporting copy weight 500.
- H1: `clamp(40px,5.6vw,68px)`, weight 800, line-height 1.02, letter-spacing -.03em, max 12ch.
- Section title (`h2.title`): `clamp(30px,3.6vw,44px)`, weight 800, letter-spacing -.02em, max 20ch.
- Card titles 19 to 22px, weight 700. Small print 12 to 14px.
- Lede 20px in `--ink-2`. Kicker: 14px, weight 700, accent color on accent background, 6px radius.
- No serif headlines.

## 5. Layout

- Max width 1160px (`.wrap`), 24px side gutters. Sections have 88px vertical padding (hero 72/88).
- Section rhythm alternates: default (paper), `.alt` (surface with top and bottom border), `.dark` (brand background, light text).
- Radius: buttons and inputs 8px, cards 12px, hero folder 14px, pills 999px.
- Borders 1.5px (`--line` for cards, `--ink` for the lead card). Lead cards and the hero folder get the offset shadow: `6px 6px 0 var(--shadow)` (8px on the hero folder). No blurred drop shadows except the dropdown and open mobile menu.
- Grids collapse to one column at 860px (3-up cards), 900px (flows), 960px (4-up to 2-up), 560px (rule cards).

## 6. Components

- **Nav**: sticky, blurred `--nav-bg`, 64px high. Links 15px weight 500. Right side: "Built on VeriPura Core™", theme toggle, solid CTA button. Below 1120px the links collapse into a Menu button with 48px rows; below 640px the nav CTA moves into the menu.
- **Food tools dropdown** (solution pages with several tools): label "Food tools" with a chevron. Opens on hover, focus or click, Escape closes. Items are tool name plus a one-line description. In the mobile menu it shows as a flat list.
- **Breadcrumbs**: under the nav on every page except the landing page. Home / Industry solutions / This page. Matching JSON-LD is written into the page HTML with canonical URLs.
- **Buttons**: `.btn` 15px weight 600, padding 13px 18px, 8px radius. `.btn-solid` for the single primary action, `.btn-ghost` for secondary. One solid button per view.
- **Tool strip**: pill links under the hero naming the solution's tools.
- **Tool card** (`.tool`): surface, 1.5px line border, title, two or three sentences, one text link pinned to the bottom. Three across on desktop.
- **Solution card** (`.app`): live solution has an ink border and offset shadow with a green "Live" tag. Example solutions have a dashed border, transparent fill and an "Example" tag with a dashed outline.
- **Capability cards** (core.html, "What Core covers today"): grouped Find, Collect, Check, Screen, Prove, Work with your team. Each card carries one status, Live or Under development, plus an optional one-line note saying why (for example "Built and tested. Not in production yet."). Filter buttons: All, Live, Under development. Do not print a date on the list. Say "Statuses are updated as capabilities ship" and keep the cards current.
- **Status tags**: `Live` (pass colors), `Under development` (flag colors), `Example` (dashed outline). On example industry pages, the tag in the hero kicker is a link reading "Discuss a pilot" that goes to the contact form, not "Under development".
- **Evidence folder** (hero visual): illustrative, labeled "Illustrative example. All data is fictional. Your team makes the decision." Items show Done, Matched, Mismatch, Review or Not checked tags (Not checked uses the slate dot and tint fill). Never use Pass or Fail. A check that could not run is Not checked, never Matched. Final state reads "Review: 1 mismatch, 1 flag".
- **Dark flow** (nine stages grouped Find, Check, Prove): mono step numbers, hairline dividers.
- **Code figure**: navy block, caption bar "Your system calls VeriPura Food" and "Illustrative". Response uses `status: "review"` and `findings`, never a verdict.
- **FAQ**: native `<details>`, 18px bold summary, "+" marker, hairline borders. Include the patent question.
- **Form**: labels 14px weight 600 above inputs, 16px inputs (prevents iOS zoom), `--seal` focus ring `0 0 0 3px rgba(46,85,201,.18)`. Submit via Formspree. Privacy link beside the form.
- **Footer**: slate text, links About, In the media, Core, Privacy, social icons (34px circles).

## 7. Industry solution page template (order)

1. Nav and breadcrumbs
2. Hero: kicker, H1, lede, two CTAs, tool strip, note, evidence folder
3. Problem (alt)
4. How it works (dark, nine stages)
5. Developer section: "Engage VeriPura {Industry}'s rules from your own systems." Kicker "For teams that run their own systems". Hosted API only
6. What we check (alt): example rules only, labeled as examples
7. Try the tools: one card per live tool
8. Two ways to work with us: co-development pilot, managed agents
9. Partners (dark, optional)
10. FAQ
11. Contact: "Start with one consignment.", form, social, calendar link
12. Footer

## 8. Mobile and accessibility

- Check every page at 390px, 768px and desktop before merging. Mobile changes use media queries only so desktop is unchanged.
- Tap targets at least 44px. No horizontal scroll (`scrollWidth` equals viewport).
- Visible focus: 3px `--seal` outline, 3px offset. Respect `prefers-reduced-motion`.
- Landmarks: `nav aria-label="Main"`, breadcrumb `nav aria-label="Breadcrumb"`. Every `aria-labelledby` must point to an existing id. Images carry alt text unless decorative.
- Contrast: body and muted text meet WCAG AA in both themes.

## 9. Icons and assets

- `favicon.ico` (16, 32, 48), `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` (180). Navy rounded square, gold check ring. Link with `?v=2` and bump the version when icons change. The thin transparent logo is unreadable at tab size; do not use it as a favicon.
- Logo mark: `vp-logo.png`, also embedded as a data URI in each page.
- Social: LinkedIn linkedin.com/company/veripura, X x.com/VeriPura, Instagram instagram.com/veri.pura, Telegram t.me/VeriPura.

---

## 10. Migrating halal.veripura.com to this style

Current page (from the copy provided): dark navy with emerald and gold accents, serif-style headline, emoji mark (mosque), all-caps mono labels, 18-market selector, pricing cards, "Export Assurance" tag.

Do:
1. Replace the palette with the section 3 tokens, light by default with the dark toggle. Use the **Food accent** (#0B7285), not green or gold.
2. Swap fonts for Schibsted Grotesk and JetBrains Mono. Remove serif headlines.
3. Header: logo mark + "VeriPura Halal Guardian" with the tool name in the accent color, ™ superscript after the full name, "Built on VeriPura Core™" link, theme toggle, "Sign in" button. Add a "VeriPura Food" link back to veripura.com food page. Remove the emoji.
4. Hero: kicker "VeriPura Food™ tool", H1 in sentence case ("Review halal packaging artwork before it goes to print."), lede 20px, solid CTA "Upload artwork", ghost CTA "Try sample artwork".
5. Market selector: pill buttons using `.toolstrip` styling; the "More" list in a dropdown. Selected pill uses `--ink` fill.
6. Results panel: use the evidence-folder pattern with Done, Review and Mismatch tags. Show findings and the fixes needed. Keep a score only if it is labeled as an information score, not a verdict, and never as pass or fail.
7. Pricing: three `.model` cards, the lead card (best value) with the offset shadow. One solid button per card.
8. Footer: Terms, Privacy, FAQ, Press, copyright line "VeriPura™", "Powered by VeriPura Core™". Replace the "Food Label Artwork Validator" copyright text.
9. Fix the stylesheet: self-host fonts with `@font-face`, not a late `@import`; fix the `aria-labelledby` ids reported by Chrome.
10. Add breadcrumbs (Home / Food / Halal Guardian) or a back link, favicons from section 9, and the same dark mode behavior.

Copy to change (rules in section 2):
- "Export Assurance" tag: remove or replace with "Pre-audit review". "Assurance" implies a guarantee.
- "Compliance score 0 to 100" and "compliance" language: reframe as findings to review. Halal status is decided by the certifier, say so near results.
- "Avoid customs detention, destroyed packaging, and $5,000+ certification rejections": remove or source it.
- "Protect Your Export Shipments": reframe as "Find issues before you print".
- "in 30 seconds": keep only if it is measured and repeatable.
- "Unlimited" and "Priority" plan claims: confirm they match what is built, otherwise label "Under development".
- Indonesia banner (17 October 2026, BPJPH Law 33/2014): fine on the tool page while it is current, remove after the date passes. Keep it out of veripura.com copy.
- Show an "Illustrative example" label on the sample artwork result, and "Your team makes the decision."

Keep from the current page: the market list, sample artwork flow, pricing tiers, Stripe checkout, Google sign-in, FAQ, Press page.
