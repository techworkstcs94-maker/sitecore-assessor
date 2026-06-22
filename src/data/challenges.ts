import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  // ─── BEGINNER TIER ──────────────────────────────────────────────────────────
  {
    id: 'b1-hero-banner',
    tier: 'beginner',
    category: 'React Component',
    title: 'Hero Banner Component',
    points: 50,
    timeLimit: 15,
    brief: `<p>Create a reusable <code>HeroBanner</code> React component that accepts props and renders a structured hero section.</p>`,
    tasks: [
      `<p>Accept <code>title</code>, <code>description</code>, and <code>ctaText</code> props (all strings).</p>`,
      `<p>Render an <code>h1</code> for the title, a <code>p</code> for the description, and a <code>button</code> for the CTA.</p>`,
      `<p>Apply <code>className="hero-banner"</code> to the root wrapper element.</p>`,
      `<p>Export the component as the default export.</p>`,
    ],
    hint: 'Use a <div className="hero-banner"> as the root, then nest the h1, p, and button inside it.',
    starterCode: `import React from 'react';

interface HeroBannerProps {
  title: string;
  description: string;
  ctaText: string;
}

export default function HeroBanner({ title, description, ctaText }: HeroBannerProps) {
  // TODO: implement the component
  return null;
}
`,
    solution: `import React from 'react';

interface HeroBannerProps {
  title: string;
  description: string;
  ctaText: string;
}

export default function HeroBanner({ title, description, ctaText }: HeroBannerProps) {
  return (
    <div className="hero-banner">
      <h1>{title}</h1>
      <p>{description}</p>
      <button>{ctaText}</button>
    </div>
  );
}
`,
    tests: [
      {
        id: 'b1-t1',
        name: 'Has hero-banner class on root',
        points: 15,
        validator: `return code.includes('className="hero-banner"') || code.includes("className='hero-banner'");`,
        errorMessage: 'Root element must have className="hero-banner"',
      },
      {
        id: 'b1-t2',
        name: 'Renders h1 element',
        points: 10,
        validator: `return /<h1[^>]*>/.test(code);`,
        errorMessage: 'Must render an <h1> element for the title',
      },
      {
        id: 'b1-t3',
        name: 'Renders p element',
        points: 10,
        validator: `return /<p[^>]*>/.test(code);`,
        errorMessage: 'Must render a <p> element for the description',
      },
      {
        id: 'b1-t4',
        name: 'Renders button element',
        points: 10,
        validator: `return /<button[^>]*>/.test(code);`,
        errorMessage: 'Must render a <button> element for the CTA',
      },
      {
        id: 'b1-t5',
        name: 'Uses props in JSX',
        points: 5,
        validator: `return code.includes('{title}') && code.includes('{description}') && code.includes('{ctaText}');`,
        errorMessage: 'Must render the title, description and ctaText props in JSX',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:40px">
<div class="hero-banner" style="background:#131D2E;border-radius:8px;padding:48px;max-width:600px;border-left:3px solid #7C5CFC">
  <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:16px">Transform Your Digital Experience</h1>
  <p style="font-size:1.1rem;color:#7A8BA8;margin-bottom:32px">Build, personalize and optimize experiences at scale with Sitecore XM Cloud.</p>
  <button style="background:#7C5CFC;color:#E8EEF8;border:none;padding:12px 28px;border-radius:4px;font-size:1rem;cursor:pointer">Get Started →</button>
</div></body></html>`,
  },

  {
    id: 'b2-card-grid',
    tier: 'beginner',
    category: 'CSS/Layout',
    title: 'Card Grid Layout',
    points: 50,
    timeLimit: 15,
    brief: `<p>Implement a CSS Grid-based card layout that responds to different screen sizes.</p>`,
    tasks: [
      `<p>Create a <code>.card-grid</code> container using CSS Grid with 3 columns on desktop.</p>`,
      `<p>Cards in <code>.card</code> must collapse to 1 column on mobile (max-width: 768px).</p>`,
      `<p>Each <code>.card</code> must have <code>border-radius: 8px</code>, a box-shadow, and <code>padding: 24px</code>.</p>`,
      `<p>Export a React component that renders a grid of cards from a <code>cards</code> prop.</p>`,
    ],
    hint: 'Use grid-template-columns: repeat(3, 1fr) and a media query or CSS custom properties for the responsive breakpoint.',
    starterCode: `import React from 'react';

interface CardItem {
  id: string;
  title: string;
  content: string;
}

interface CardGridProps {
  cards: CardItem[];
}

// Add your CSS styles here (as a <style> tag or CSS-in-JS)
export default function CardGrid({ cards }: CardGridProps) {
  // TODO: implement the card grid
  return null;
}
`,
    solution: `import React from 'react';

interface CardItem {
  id: string;
  title: string;
  content: string;
}

interface CardGridProps {
  cards: CardItem[];
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <>
      <style>{\`
        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .card {
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          padding: 24px;
          background: #131D2E;
        }
        @media (max-width: 768px) {
          .card-grid { grid-template-columns: 1fr; }
        }
      \`}</style>
      <div className="card-grid">
        {cards.map(card => (
          <div key={card.id} className="card">
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}
`,
    tests: [
      {
        id: 'b2-t1',
        name: 'Has .card-grid class',
        points: 15,
        validator: `return code.includes('card-grid');`,
        errorMessage: 'Must use .card-grid class on the container',
      },
      {
        id: 'b2-t2',
        name: 'Uses CSS Grid',
        points: 15,
        validator: `return code.includes('display: grid') || code.includes('display:grid') || code.includes('grid-template-columns');`,
        errorMessage: 'Must use CSS Grid (display: grid) for the layout',
      },
      {
        id: 'b2-t3',
        name: 'Has .card class with padding',
        points: 10,
        validator: `return code.includes('card') && code.includes('padding: 24px') || code.includes('padding:24px') || code.includes('p-6');`,
        errorMessage: 'Cards must have className="card" with padding: 24px',
      },
      {
        id: 'b2-t4',
        name: 'Has box-shadow on cards',
        points: 5,
        validator: `return code.includes('box-shadow');`,
        errorMessage: 'Cards must have a box-shadow',
      },
      {
        id: 'b2-t5',
        name: 'Has border-radius: 8px',
        points: 5,
        validator: `return code.includes('border-radius: 8px') || code.includes('border-radius:8px') || code.includes('rounded-lg') || code.includes('rounded-[8px]');`,
        errorMessage: 'Cards must have border-radius: 8px',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><head><style>
body{background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px}
.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.4);padding:24px;background:#131D2E;border:1px solid #1E2D45}
.card h3{margin-bottom:8px;color:#E8EEF8}.card p{color:#7A8BA8}
</style></head><body><div class="card-grid">
<div class="card"><h3>Experience Edge</h3><p>Deliver content at the edge for maximum performance.</p></div>
<div class="card"><h3>Personalization</h3><p>Tailor experiences to each visitor segment.</p></div>
<div class="card"><h3>Analytics</h3><p>Understand how content drives engagement.</p></div>
</div></body></html>`,
  },

  {
    id: 'b3-content-filter',
    tier: 'beginner',
    category: 'JavaScript Logic',
    title: 'Content Filter Function',
    points: 50,
    timeLimit: 20,
    brief: `<p>Write a <code>filterContent</code> function that filters an array of content items by a search query and category.</p>`,
    tasks: [
      `<p>Function signature: <code>filterContent(items, query, category)</code></p>`,
      `<p>Filter items where <code>item.title</code> contains <code>query</code> (case-insensitive).</p>`,
      `<p>If <code>category === "all"</code>, skip the category filter; otherwise filter by <code>item.category</code>.</p>`,
      `<p>Return the filtered array. If <code>query</code> is empty, skip the text filter.</p>`,
    ],
    hint: 'Use Array.prototype.filter() and String.prototype.toLowerCase() for case-insensitive matching.',
    starterCode: `interface ContentItem {
  id: string;
  title: string;
  category: string;
  body: string;
}

export function filterContent(
  items: ContentItem[],
  query: string,
  category: string
): ContentItem[] {
  // TODO: implement filtering
  return items;
}
`,
    solution: `interface ContentItem {
  id: string;
  title: string;
  category: string;
  body: string;
}

export function filterContent(
  items: ContentItem[],
  query: string,
  category: string
): ContentItem[] {
  return items.filter(item => {
    const matchesQuery = !query || item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesQuery && matchesCategory;
  });
}
`,
    tests: [
      {
        id: 'b3-t1',
        name: 'Function is exported',
        points: 10,
        validator: `return code.includes('export function filterContent') || code.includes('export const filterContent');`,
        errorMessage: 'filterContent must be exported',
      },
      {
        id: 'b3-t2',
        name: 'Uses case-insensitive matching',
        points: 15,
        validator: `return code.includes('toLowerCase') || code.includes('toUpperCase') || code.includes('/i');`,
        errorMessage: 'Must use case-insensitive comparison (toLowerCase or regex with /i)',
      },
      {
        id: 'b3-t3',
        name: 'Handles category="all"',
        points: 15,
        validator: `return code.includes('"all"') || code.includes("'all'");`,
        errorMessage: 'Must handle the case where category is "all"',
      },
      {
        id: 'b3-t4',
        name: 'Uses filter or equivalent',
        points: 10,
        validator: `return code.includes('.filter(') || code.includes('reduce(');`,
        errorMessage: 'Must use Array.filter() or equivalent to return filtered results',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><head><style>
body{background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px}
input,select{background:#131D2E;color:#E8EEF8;border:1px solid #1E2D45;padding:8px 12px;border-radius:4px;margin-right:8px;margin-bottom:16px}
.item{background:#131D2E;padding:16px;border-radius:4px;margin-bottom:8px;border:1px solid #1E2D45}
</style></head><body>
<input placeholder="Search titles..." oninput="doFilter()">
<select onchange="doFilter()"><option value="all">All Categories</option><option>Components</option><option>Layouts</option></select>
<div id="results"></div>
<script>
const items=[{title:'Hero Component',category:'Components'},{title:'Card Grid',category:'Layouts'},{title:'Nav Component',category:'Components'}];
function doFilter(){
  const q=document.querySelector('input').value.toLowerCase();
  const c=document.querySelector('select').value;
  const r=items.filter(i=>(!q||i.title.toLowerCase().includes(q))&&(c==='all'||i.category===c));
  document.getElementById('results').innerHTML=r.map(i=>'<div class="item">'+i.title+' <span style="color:#7A8BA8">'+i.category+'</span></div>').join('');
}
doFilter();
</script></body></html>`,
  },

  {
    id: 'b4-accordion',
    tier: 'beginner',
    category: 'React Component',
    title: 'Accordion Component',
    points: 50,
    timeLimit: 20,
    brief: `<p>Build an <code>Accordion</code> React component with expand/collapse behaviour. Only one item may be open at a time.</p>`,
    tasks: [
      `<p>Accept an <code>items</code> prop of type <code>Array&lt;{question: string, answer: string}&gt;</code>.</p>`,
      `<p>Use <code>useState</code> to track which item is currently open (by index).</p>`,
      `<p>Clicking an already-open item closes it. Clicking a different item closes the current and opens the new one.</p>`,
      `<p>Show a <code>+</code> icon when closed and a <code>-</code> icon when open, next to each question.</p>`,
    ],
    hint: 'Store the open index as a number | null in state. Set to null to close all, set to the index to open one.',
    starterCode: `import React, { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  // TODO: implement accordion
  return null;
}
`,
    solution: `import React, { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className="accordion-trigger"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span>{item.question}</span>
            <span>{openIndex === index ? '-' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="accordion-content">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
`,
    tests: [
      {
        id: 'b4-t1',
        name: 'Uses useState',
        points: 15,
        validator: `return code.includes('useState');`,
        errorMessage: 'Must use React useState hook to track open state',
      },
      {
        id: 'b4-t2',
        name: 'Shows + and - indicators',
        points: 15,
        validator: `return (code.includes("'+'") || code.includes('"+\"') || code.includes('\`+\`')) && (code.includes("'-'") || code.includes('"-"') || code.includes('\`-\`'));`,
        errorMessage: 'Must display + when closed and - when open',
      },
      {
        id: 'b4-t3',
        name: 'Maps over items prop',
        points: 10,
        validator: `return code.includes('.map(') && code.includes('items');`,
        errorMessage: 'Must map over the items prop to render each accordion item',
      },
      {
        id: 'b4-t4',
        name: 'Has onClick handler',
        points: 10,
        validator: `return code.includes('onClick');`,
        errorMessage: 'Must have an onClick handler to toggle items',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><head><style>
body{background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px;max-width:600px}
.accordion-item{border:1px solid #1E2D45;border-radius:4px;margin-bottom:8px;overflow:hidden}
.accordion-trigger{width:100%;background:#131D2E;color:#E8EEF8;border:none;padding:16px;text-align:left;cursor:pointer;display:flex;justify-content:space-between;font-size:1rem}
.accordion-trigger:hover{background:#1A2640}
.accordion-content{padding:16px;background:#0D1421;color:#7A8BA8}
</style></head><body>
<div id="acc"></div>
<script>
const items=[{q:'What is Sitecore XM Cloud?',a:'A cloud-native CMS for composable digital experiences.'},
{q:'What is JSS?',a:'JavaScript Services — the SDK for headless Sitecore development.'},
{q:'What is Experience Edge?',a:'Sitecore\'s globally distributed CDN for content delivery.'}];
let open=null;
function render(){
  document.getElementById('acc').innerHTML=items.map((it,i)=>\`
<div class="accordion-item">
  <button class="accordion-trigger" onclick="toggle(\${i})"><span>\${it.q}</span><span>\${open===i?'-':'+'}</span></button>
  \${open===i?'<div class="accordion-content"><p>'+it.a+'</p></div>':''}
</div>\`).join('');
}
function toggle(i){open=open===i?null:i;render();}
render();
</script></body></html>`,
  },

  {
    id: 'b5-sitecore-fields',
    tier: 'beginner',
    category: 'Sitecore JSS',
    title: 'Basic Sitecore Field Rendering',
    points: 50,
    timeLimit: 20,
    brief: `<p>Render a content card using Sitecore JSS-style field props, with <code>data-sc-field</code> attributes for Experience Editor compatibility.</p>`,
    tasks: [
      `<p>Accept a <code>fields</code> prop matching <code>{Title: {value: string}, Body: {value: string}, Image: {value: {src: string, alt: string}}}</code>.</p>`,
      `<p>Render the Title in an <code>h2</code>, Body in a <code>p</code>, and Image in an <code>img</code>.</p>`,
      `<p>Add <code>data-sc-field="Title"</code>, <code>data-sc-field="Body"</code>, and <code>data-sc-field="Image"</code> attributes to the respective elements.</p>`,
      `<p>Export the component as the default export named <code>ContentCard</code>.</p>`,
    ],
    hint: 'In Sitecore JSS, fields are always objects with a .value property. Access them as fields.Title.value.',
    starterCode: `import React from 'react';

interface SitecoreTextField { value: string; }
interface SitecoreImageField { value: { src: string; alt: string }; }

interface ContentCardFields {
  Title: SitecoreTextField;
  Body: SitecoreTextField;
  Image: SitecoreImageField;
}

interface ContentCardProps {
  fields: ContentCardFields;
}

export default function ContentCard({ fields }: ContentCardProps) {
  // TODO: render with data-sc-field attributes
  return null;
}
`,
    solution: `import React from 'react';

interface SitecoreTextField { value: string; }
interface SitecoreImageField { value: { src: string; alt: string }; }

interface ContentCardFields {
  Title: SitecoreTextField;
  Body: SitecoreTextField;
  Image: SitecoreImageField;
}

interface ContentCardProps {
  fields: ContentCardFields;
}

export default function ContentCard({ fields }: ContentCardProps) {
  return (
    <div className="content-card">
      <img
        src={fields.Image.value.src}
        alt={fields.Image.value.alt}
        data-sc-field="Image"
      />
      <h2 data-sc-field="Title">{fields.Title.value}</h2>
      <p data-sc-field="Body">{fields.Body.value}</p>
    </div>
  );
}
`,
    tests: [
      {
        id: 'b5-t1',
        name: 'Has data-sc-field="Title"',
        points: 15,
        validator: `return code.includes('data-sc-field="Title"') || code.includes("data-sc-field='Title'");`,
        errorMessage: 'Must add data-sc-field="Title" to the title element',
      },
      {
        id: 'b5-t2',
        name: 'Has data-sc-field="Body"',
        points: 15,
        validator: `return code.includes('data-sc-field="Body"') || code.includes("data-sc-field='Body'");`,
        errorMessage: 'Must add data-sc-field="Body" to the body element',
      },
      {
        id: 'b5-t3',
        name: 'Has data-sc-field="Image"',
        points: 10,
        validator: `return code.includes('data-sc-field="Image"') || code.includes("data-sc-field='Image'");`,
        errorMessage: 'Must add data-sc-field="Image" to the image element',
      },
      {
        id: 'b5-t4',
        name: 'Accesses field .value property',
        points: 10,
        validator: `return code.includes('.value') && code.includes('fields.Title') && code.includes('fields.Body');`,
        errorMessage: 'Must access field values via fields.Title.value and fields.Body.value',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px">
<div style="background:#131D2E;border-radius:4px;overflow:hidden;max-width:400px;border:1px solid #1E2D45">
  <img src="https://placehold.co/400x200/131D2E/7C5CFC?text=XM+Cloud" alt="XM Cloud" data-sc-field="Image" style="width:100%;display:block">
  <div style="padding:24px">
    <h2 data-sc-field="Title" style="margin-bottom:12px;font-size:1.4rem">Sitecore XM Cloud</h2>
    <p data-sc-field="Body" style="color:#7A8BA8;line-height:1.6">The modern, cloud-native CMS for enterprise headless delivery.</p>
  </div>
</div></body></html>`,
  },

  {
    id: 'b6-nextjs-page',
    tier: 'beginner',
    category: 'Next.js',
    title: 'Next.js Page with getStaticProps',
    points: 50,
    timeLimit: 20,
    brief: `<p>Create a Next.js page component that fetches data using <code>getStaticProps</code> and includes proper <code>Head</code> metadata.</p>`,
    tasks: [
      `<p>Export a <code>getStaticProps</code> function that returns <code>{ props: { articles } }</code> from a mock data array.</p>`,
      `<p>The page component should accept and render the <code>articles</code> prop (array of <code>{id, title, summary}</code>).</p>`,
      `<p>Include a <code>Head</code> component (from <code>next/head</code>) with a <code>title</code> and <code>meta description</code>.</p>`,
      `<p>Export the page component as the default export.</p>`,
    ],
    hint: 'getStaticProps must return { props: { ... } }. For the mock data, just define it inline inside the function.',
    starterCode: `import Head from 'next/head';

interface Article {
  id: string;
  title: string;
  summary: string;
}

interface Props {
  articles: Article[];
}

// TODO: add getStaticProps

export default function ArticlesPage({ articles }: Props) {
  // TODO: render articles list with Head component
  return null;
}
`,
    solution: `import Head from 'next/head';

interface Article {
  id: string;
  title: string;
  summary: string;
}

interface Props {
  articles: Article[];
}

export async function getStaticProps() {
  const articles: Article[] = [
    { id: '1', title: 'Getting Started with XM Cloud', summary: 'Introduction to Sitecore XM Cloud.' },
    { id: '2', title: 'JSS Fundamentals', summary: 'Learn JavaScript Services basics.' },
  ];
  return { props: { articles } };
}

export default function ArticlesPage({ articles }: Props) {
  return (
    <>
      <Head>
        <title>Articles | XM Cloud Portal</title>
        <meta name="description" content="Browse the latest articles about Sitecore XM Cloud." />
      </Head>
      <main>
        {articles.map(article => (
          <article key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
          </article>
        ))}
      </main>
    </>
  );
}
`,
    tests: [
      {
        id: 'b6-t1',
        name: 'Exports getStaticProps',
        points: 20,
        validator: `return code.includes('export async function getStaticProps') || code.includes('export function getStaticProps') || code.includes('exports.getStaticProps');`,
        errorMessage: 'Must export a getStaticProps function',
      },
      {
        id: 'b6-t2',
        name: 'Returns { props: { articles } }',
        points: 15,
        validator: `return code.includes('props') && code.includes('articles') && (code.includes('return {') || code.includes('return{'));`,
        errorMessage: 'getStaticProps must return { props: { articles } }',
      },
      {
        id: 'b6-t3',
        name: 'Includes Head component',
        points: 10,
        validator: `return code.includes('<Head>') || code.includes('<Head ');`,
        errorMessage: 'Must include a <Head> component from next/head',
      },
      {
        id: 'b6-t4',
        name: 'Has meta description',
        points: 5,
        validator: `return code.includes('meta') && code.includes('description');`,
        errorMessage: 'Must include a <meta name="description"> tag inside Head',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><head><title>Articles | XM Cloud Portal</title><meta name="description" content="Browse articles."></head>
<body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px">
<main>
  <article style="background:#131D2E;padding:20px;border-radius:4px;margin-bottom:12px;border:1px solid #1E2D45">
    <h2 style="margin-bottom:8px">Getting Started with XM Cloud</h2>
    <p style="color:#7A8BA8">Introduction to Sitecore XM Cloud and its capabilities.</p>
  </article>
  <article style="background:#131D2E;padding:20px;border-radius:4px;border:1px solid #1E2D45">
    <h2 style="margin-bottom:8px">JSS Fundamentals</h2>
    <p style="color:#7A8BA8">Learn JavaScript Services basics for headless development.</p>
  </article>
</main></body></html>`,
  },

  // ─── INTERMEDIATE TIER ──────────────────────────────────────────────────────
  {
    id: 'i1-multilist',
    tier: 'intermediate',
    category: 'Sitecore JSS',
    title: 'Sitecore Multilist Rendering',
    points: 75,
    timeLimit: 25,
    brief: `<p>Render a navigable card list from a Sitecore multilist field. Each item has Sitecore-structured fields.</p>`,
    tasks: [
      `<p>Accept a <code>items</code> prop: <code>Array&lt;{id: string, fields: {Title: {value: string}, Link: {value: {href: string, text: string}}, Image: {value: {src: string, alt: string}}}}&gt;</code></p>`,
      `<p>Render each item as a clickable card with the image, title, and a link.</p>`,
      `<p>Handle the empty state: if items is empty or undefined, render <code>&lt;p&gt;No items found.&lt;/p&gt;</code>.</p>`,
      `<p>Links should use the <code>href</code> from the Link field value.</p>`,
    ],
    hint: 'Always guard against empty arrays early. Access nested field values via item.fields.Title.value.',
    starterCode: `import React from 'react';

interface SitecoreTextField { value: string; }
interface SitecoreImageField { value: { src: string; alt: string }; }
interface SiteCoreLinkField { value: { href: string; text: string }; }

interface MultilistItem {
  id: string;
  fields: {
    Title: SitecoreTextField;
    Link: SiteCoreLinkField;
    Image: SitecoreImageField;
  };
}

interface MultilistProps {
  items?: MultilistItem[];
}

export default function MultilistRendering({ items }: MultilistProps) {
  // TODO: render card list with empty state handling
  return null;
}
`,
    solution: `import React from 'react';

interface SitecoreTextField { value: string; }
interface SitecoreImageField { value: { src: string; alt: string }; }
interface SiteCoreLinkField { value: { href: string; text: string }; }

interface MultilistItem {
  id: string;
  fields: {
    Title: SitecoreTextField;
    Link: SiteCoreLinkField;
    Image: SitecoreImageField;
  };
}

interface MultilistProps {
  items?: MultilistItem[];
}

export default function MultilistRendering({ items }: MultilistProps) {
  if (!items || items.length === 0) {
    return <p>No items found.</p>;
  }

  return (
    <ul className="multilist">
      {items.map(item => (
        <li key={item.id} className="multilist-item">
          <a href={item.fields.Link.value.href}>
            <img src={item.fields.Image.value.src} alt={item.fields.Image.value.alt} />
            <h3>{item.fields.Title.value}</h3>
            <span>{item.fields.Link.value.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
`,
    tests: [
      {
        id: 'i1-t1',
        name: 'Handles empty state',
        points: 20,
        validator: `return (code.includes('No items found') || code.includes('no items') || code.includes('empty')) && (code.includes('length === 0') || code.includes('length==0') || code.includes('!items') || code.includes('?.length'));`,
        errorMessage: 'Must render an empty state message when items is empty or undefined',
      },
      {
        id: 'i1-t2',
        name: 'Renders link with href from field',
        points: 20,
        validator: `return code.includes('Link.value.href') || code.includes('Link?.value?.href') || code.includes('fields.Link');`,
        errorMessage: 'Must use the Link field value href for the anchor tag',
      },
      {
        id: 'i1-t3',
        name: 'Renders image from Image field',
        points: 15,
        validator: `return code.includes('Image.value.src') || code.includes('Image?.value?.src');`,
        errorMessage: 'Must render an image using the Image field value src',
      },
      {
        id: 'i1-t4',
        name: 'Maps over items with key prop',
        points: 20,
        validator: `return code.includes('.map(') && code.includes('key=');`,
        errorMessage: 'Must map over items and provide a key prop',
      },
    ],
    previewHtml: '',
  },

  {
    id: 'i2-usesitecorecontext',
    tier: 'intermediate',
    category: 'React Component',
    title: 'useSitecoreContext Hook',
    points: 75,
    timeLimit: 25,
    brief: `<p>Build a custom <code>useSitecoreContext</code> hook that reads from a React Context provider and returns structured site data.</p>`,
    tasks: [
      `<p>Create a <code>SitecoreContext</code> React Context with a default value of <code>null</code>.</p>`,
      `<p>Create a <code>SitecoreContextProvider</code> component that accepts <code>value</code> and <code>children</code> props.</p>`,
      `<p>Implement <code>useSitecoreContext()</code> that reads from context. Must return <code>{siteName, language, pageEditing, route}</code> with sensible defaults when context is null.</p>`,
      `<p>Export all three: <code>SitecoreContext</code>, <code>SitecoreContextProvider</code>, <code>useSitecoreContext</code>.</p>`,
    ],
    hint: 'Use useContext(SitecoreContext) and provide fallback values with the nullish coalescing operator ??',
    starterCode: `import React, { createContext, useContext } from 'react';

interface SitecoreContextValue {
  siteName: string;
  language: string;
  pageEditing: boolean;
  route: string;
}

// TODO: create context, provider, and hook
`,
    solution: `import React, { createContext, useContext } from 'react';

interface SitecoreContextValue {
  siteName: string;
  language: string;
  pageEditing: boolean;
  route: string;
}

const defaultContext: SitecoreContextValue = {
  siteName: '',
  language: 'en',
  pageEditing: false,
  route: '/',
};

export const SitecoreContext = createContext<SitecoreContextValue | null>(null);

interface ProviderProps {
  value: SitecoreContextValue;
  children: React.ReactNode;
}

export function SitecoreContextProvider({ value, children }: ProviderProps) {
  return (
    <SitecoreContext.Provider value={value}>
      {children}
    </SitecoreContext.Provider>
  );
}

export function useSitecoreContext(): SitecoreContextValue {
  const ctx = useContext(SitecoreContext);
  return {
    siteName: ctx?.siteName ?? defaultContext.siteName,
    language: ctx?.language ?? defaultContext.language,
    pageEditing: ctx?.pageEditing ?? defaultContext.pageEditing,
    route: ctx?.route ?? defaultContext.route,
  };
}
`,
    tests: [
      {
        id: 'i2-t1',
        name: 'Creates a React Context',
        points: 20,
        validator: `return code.includes('createContext');`,
        errorMessage: 'Must use createContext() to create the SitecoreContext',
      },
      {
        id: 'i2-t2',
        name: 'Exports useSitecoreContext hook',
        points: 20,
        validator: `return code.includes('export function useSitecoreContext') || code.includes('export const useSitecoreContext');`,
        errorMessage: 'Must export useSitecoreContext as a named export',
      },
      {
        id: 'i2-t3',
        name: 'Handles null context with defaults',
        points: 20,
        validator: `return (code.includes('??') || code.includes('|| ') || code.includes('ctx?')) && (code.includes("'en'") || code.includes('"en"'));`,
        errorMessage: 'Must handle null context gracefully with sensible defaults (e.g., language: "en")',
      },
      {
        id: 'i2-t4',
        name: 'Exports SitecoreContextProvider',
        points: 15,
        validator: `return code.includes('SitecoreContextProvider') && code.includes('export');`,
        errorMessage: 'Must export a SitecoreContextProvider component',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px">
<div style="background:#131D2E;padding:24px;border-radius:4px;border:1px solid #1E2D45;max-width:480px">
  <h3 style="margin-bottom:16px;color:#7C5CFC">useSitecoreContext() output</h3>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px;color:#7A8BA8">siteName</td><td style="padding:8px;color:#22D48F;font-family:monospace">"my-site"</td></tr>
    <tr style="background:#0D1421"><td style="padding:8px;color:#7A8BA8">language</td><td style="padding:8px;color:#22D48F;font-family:monospace">"en"</td></tr>
    <tr><td style="padding:8px;color:#7A8BA8">pageEditing</td><td style="padding:8px;color:#F5A623;font-family:monospace">false</td></tr>
    <tr style="background:#0D1421"><td style="padding:8px;color:#7A8BA8">route</td><td style="padding:8px;color:#22D48F;font-family:monospace">"/home"</td></tr>
  </table>
</div></body></html>`,
  },

  {
    id: 'i3-dynamic-route-isr',
    tier: 'intermediate',
    category: 'Next.js',
    title: 'Dynamic Route with ISR',
    points: 75,
    timeLimit: 30,
    brief: `<p>Create a Next.js dynamic route <code>[slug].tsx</code> using <code>getStaticPaths</code> and <code>getStaticProps</code> with Incremental Static Regeneration.</p>`,
    tasks: [
      `<p>Export <code>getStaticPaths</code> that generates paths from a mock content array. Use <code>fallback: 'blocking'</code>.</p>`,
      `<p>Export <code>getStaticProps</code> that receives the <code>slug</code> param and returns the matching content item as props.</p>`,
      `<p>Set <code>revalidate: 60</code> in the returned props object for ISR.</p>`,
      `<p>The page component should render the content item's title and body.</p>`,
    ],
    hint: 'getStaticPaths must return { paths: [...], fallback: "blocking" }. getStaticProps receives { params: { slug } }.',
    starterCode: `// [slug].tsx
interface ContentItem {
  slug: string;
  title: string;
  body: string;
}

const mockContent: ContentItem[] = [
  { slug: 'intro-to-xm-cloud', title: 'Intro to XM Cloud', body: 'XM Cloud is...' },
  { slug: 'jss-getting-started', title: 'JSS Getting Started', body: 'JSS is...' },
];

// TODO: export getStaticPaths and getStaticProps

interface Props {
  item: ContentItem;
}

export default function ArticlePage({ item }: Props) {
  // TODO: render article
  return null;
}
`,
    solution: `// [slug].tsx
interface ContentItem {
  slug: string;
  title: string;
  body: string;
}

const mockContent: ContentItem[] = [
  { slug: 'intro-to-xm-cloud', title: 'Intro to XM Cloud', body: 'XM Cloud is the cloud-native CMS.' },
  { slug: 'jss-getting-started', title: 'JSS Getting Started', body: 'JSS enables headless delivery.' },
];

export async function getStaticPaths() {
  const paths = mockContent.map(item => ({ params: { slug: item.slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const item = mockContent.find(c => c.slug === params.slug);
  if (!item) return { notFound: true };
  return { props: { item }, revalidate: 60 };
}

interface Props {
  item: ContentItem;
}

export default function ArticlePage({ item }: Props) {
  return (
    <article>
      <h1>{item.title}</h1>
      <p>{item.body}</p>
    </article>
  );
}
`,
    tests: [
      {
        id: 'i3-t1',
        name: 'Exports getStaticPaths',
        points: 20,
        validator: `return code.includes('export') && code.includes('getStaticPaths');`,
        errorMessage: 'Must export getStaticPaths',
      },
      {
        id: 'i3-t2',
        name: 'Uses fallback: blocking',
        points: 20,
        validator: `return code.includes("fallback: 'blocking'") || code.includes('fallback:"blocking"') || code.includes('fallback: "blocking"');`,
        errorMessage: 'getStaticPaths must return fallback: "blocking"',
      },
      {
        id: 'i3-t3',
        name: 'Has revalidate: 60 for ISR',
        points: 20,
        validator: `return code.includes('revalidate: 60') || code.includes('revalidate:60');`,
        errorMessage: 'getStaticProps must return revalidate: 60',
      },
      {
        id: 'i3-t4',
        name: 'Exports getStaticProps with params',
        points: 15,
        validator: `return code.includes('getStaticProps') && code.includes('params') && code.includes('slug');`,
        errorMessage: 'getStaticProps must accept { params: { slug } } and use it',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:32px;max-width:680px">
<div style="margin-bottom:12px"><span style="background:#0D2640;color:#4DA6FF;padding:4px 10px;border-radius:4px;font-size:0.8rem">ISR · revalidate: 60s</span></div>
<article>
  <h1 style="font-size:2rem;margin-bottom:16px">Intro to XM Cloud</h1>
  <p style="color:#7A8BA8;line-height:1.7">XM Cloud is the cloud-native CMS that enables enterprise teams to build, manage, and optimize digital experiences at scale with a headless-first approach.</p>
</article></body></html>`,
  },

  {
    id: 'i4-responsive-nav',
    tier: 'intermediate',
    category: 'CSS/Layout',
    title: 'Responsive Navigation with Sitecore Links',
    points: 75,
    timeLimit: 25,
    brief: `<p>Build a responsive navigation component with a hamburger menu on mobile and horizontal links on desktop.</p>`,
    tasks: [
      `<p>Accept a <code>links</code> prop: <code>Array&lt;{label: string, href: string, isActive: boolean}&gt;</code>.</p>`,
      `<p>On desktop (&gt;768px): render links horizontally.</p>`,
      `<p>On mobile: show a hamburger button; clicking it toggles the mobile menu open/closed.</p>`,
      `<p>Active links should have a visually distinct active style. Use smooth CSS transition on mobile menu open/close.</p>`,
    ],
    hint: 'Use useState for the mobile menu open state. Apply conditional className based on isActive prop.',
    starterCode: `import React, { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  isActive: boolean;
}

interface NavProps {
  links: NavLink[];
}

export default function Navigation({ links }: NavProps) {
  // TODO: implement responsive navigation
  return null;
}
`,
    solution: `import React, { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  isActive: boolean;
}

interface NavProps {
  links: NavLink[];
}

export default function Navigation({ links }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="site-nav">
      <style>{\`
        .site-nav { background: #0D1421; border-bottom: 1px solid #1E2D45; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 56px; }
        .nav-links { display: flex; gap: 24px; list-style: none; }
        .nav-links a { color: #7A8BA8; text-decoration: none; padding: 4px 0; border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
        .nav-links a.active, .nav-links a:hover { color: #E8EEF8; border-bottom-color: #7C5CFC; }
        .hamburger { display: none; background: none; border: none; color: #E8EEF8; cursor: pointer; font-size: 1.5rem; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-links.open { display: flex; flex-direction: column; position: absolute; top: 56px; left: 0; right: 0; background: #0D1421; padding: 16px 24px; border-bottom: 1px solid #1E2D45; animation: slide-in 0.2s ease-out; }
          .hamburger { display: block; }
        }
      \`}</style>
      <span className="brand">SC Portal</span>
      <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
        {mobileOpen ? '✕' : '☰'}
      </button>
      <ul className={\`nav-links\${mobileOpen ? ' open' : ''}\`}>
        {links.map(link => (
          <li key={link.href}>
            <a href={link.href} className={link.isActive ? 'active' : ''}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
`,
    tests: [
      {
        id: 'i4-t1',
        name: 'Uses useState for mobile menu',
        points: 20,
        validator: `return code.includes('useState');`,
        errorMessage: 'Must use useState to track mobile menu open state',
      },
      {
        id: 'i4-t2',
        name: 'Has hamburger button',
        points: 20,
        validator: `return code.includes('hamburger') || code.includes('menu-toggle') || code.includes('mobile') || (code.includes('☰') || code.includes('menu'));`,
        errorMessage: 'Must include a hamburger/toggle button for mobile',
      },
      {
        id: 'i4-t3',
        name: 'Maps over links prop',
        points: 15,
        validator: `return code.includes('links') && code.includes('.map(');`,
        errorMessage: 'Must map over the links prop to render nav items',
      },
      {
        id: 'i4-t4',
        name: 'Handles isActive styling',
        points: 20,
        validator: `return code.includes('isActive') && (code.includes('active') || code.includes('Active'));`,
        errorMessage: 'Must apply different styling to active links',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><head><style>
body{background:#070B14;margin:0}
.site-nav{background:#0D1421;border-bottom:1px solid #1E2D45;padding:0 24px;display:flex;align-items:center;height:56px;gap:32px}
.brand{color:#E8EEF8;font-weight:600}
ul{display:flex;gap:24px;list-style:none;padding:0;margin:0}
a{color:#7A8BA8;text-decoration:none;padding:4px 0;border-bottom:2px solid transparent;font-family:system-ui}
a.active,a:hover{color:#E8EEF8;border-bottom-color:#7C5CFC}
</style></head><body>
<nav class="site-nav">
  <span class="brand">SC Portal</span>
  <ul>
    <li><a href="#" class="active">Home</a></li>
    <li><a href="#">Articles</a></li>
    <li><a href="#">Components</a></li>
    <li><a href="#">Settings</a></li>
  </ul>
</nav></body></html>`,
  },

  {
    id: 'i5-typescript-interfaces',
    tier: 'intermediate',
    category: 'TypeScript',
    title: 'TypeScript Interfaces for Sitecore Fields',
    points: 75,
    timeLimit: 25,
    brief: `<p>Define TypeScript interfaces for common Sitecore field types and write a type-safe generic <code>renderField</code> function.</p>`,
    tasks: [
      `<p>Define interfaces: <code>TextField</code>, <code>ImageField</code>, <code>LinkField</code>, <code>DateField</code>, and <code>MultilistField&lt;T&gt;</code>.</p>`,
      `<p>All field interfaces must have a <code>value</code> property of the appropriate type.</p>`,
      `<p>Write a generic <code>renderField&lt;T&gt;(field: {value: T}, formatter?: (val: T) => string): string</code> function.</p>`,
      `<p>Export all interfaces and the renderField function.</p>`,
    ],
    hint: 'MultilistField<T> uses a generic: interface MultilistField<T> { value: T[] }. renderField can default to String(value) if no formatter provided.',
    starterCode: `// Define Sitecore field type interfaces

// TODO: TextField
// TODO: ImageField
// TODO: LinkField
// TODO: DateField
// TODO: MultilistField<T>

// TODO: renderField<T> generic function
`,
    solution: `export interface TextField {
  value: string;
}

export interface ImageField {
  value: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export interface LinkField {
  value: {
    href: string;
    text: string;
    target?: string;
    querystring?: string;
  };
}

export interface DateField {
  value: string; // ISO 8601 date string
}

export interface MultilistField<T> {
  value: T[];
}

export function renderField<T>(
  field: { value: T },
  formatter?: (val: T) => string
): string {
  if (formatter) return formatter(field.value);
  return String(field.value);
}
`,
    tests: [
      {
        id: 'i5-t1',
        name: 'Defines TextField interface',
        points: 10,
        validator: `return code.includes('interface TextField') || code.includes('type TextField');`,
        errorMessage: 'Must define a TextField interface',
      },
      {
        id: 'i5-t2',
        name: 'Defines ImageField interface',
        points: 10,
        validator: `return code.includes('interface ImageField') || code.includes('type ImageField');`,
        errorMessage: 'Must define an ImageField interface',
      },
      {
        id: 'i5-t3',
        name: 'Defines generic MultilistField<T>',
        points: 20,
        validator: `return code.includes('MultilistField') && code.includes('<T>') && code.includes('value: T[]') || code.includes('value:T[]');`,
        errorMessage: 'Must define a generic MultilistField<T> interface with value: T[]',
      },
      {
        id: 'i5-t4',
        name: 'Exports renderField generic function',
        points: 20,
        validator: `return code.includes('renderField') && code.includes('export') && code.includes('<T>');`,
        errorMessage: 'Must export a generic renderField<T> function',
      },
      {
        id: 'i5-t5',
        name: 'LinkField and DateField defined',
        points: 15,
        validator: `return code.includes('LinkField') && code.includes('DateField');`,
        errorMessage: 'Must define both LinkField and DateField interfaces',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:'JetBrains Mono',monospace;padding:24px;font-size:0.9rem">
<pre style="background:#131D2E;padding:24px;border-radius:4px;border:1px solid #1E2D45;overflow-x:auto"><code><span style="color:#7C5CFC">interface</span> <span style="color:#22D48F">TextField</span> { <span style="color:#4DA6FF">value</span>: <span style="color:#F5A623">string</span> }
<span style="color:#7C5CFC">interface</span> <span style="color:#22D48F">ImageField</span> { <span style="color:#4DA6FF">value</span>: { src: <span style="color:#F5A623">string</span>; alt: <span style="color:#F5A623">string</span> } }
<span style="color:#7C5CFC">interface</span> <span style="color:#22D48F">LinkField</span>  { <span style="color:#4DA6FF">value</span>: { href: <span style="color:#F5A623">string</span>; text: <span style="color:#F5A623">string</span> } }
<span style="color:#7C5CFC">interface</span> <span style="color:#22D48F">DateField</span>  { <span style="color:#4DA6FF">value</span>: <span style="color:#F5A623">string</span> }
<span style="color:#7C5CFC">interface</span> <span style="color:#22D48F">MultilistField</span>&lt;<span style="color:#4DA6FF">T</span>&gt; { <span style="color:#4DA6FF">value</span>: <span style="color:#4DA6FF">T</span>[] }

<span style="color:#7C5CFC">function</span> <span style="color:#22D48F">renderField</span>&lt;<span style="color:#4DA6FF">T</span>&gt;(field, formatter?) { ... }</code></pre></body></html>`,
  },

  {
    id: 'i6-memoised-component',
    tier: 'intermediate',
    category: 'Performance',
    title: 'Memoised ProductList Component',
    points: 75,
    timeLimit: 30,
    brief: `<p>Optimise a slow ProductList component using <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> without breaking its props interface.</p>`,
    tasks: [
      `<p>Wrap the component export with <code>React.memo</code>.</p>`,
      `<p>Use <code>useMemo</code> to compute the filtered and sorted list from props.</p>`,
      `<p>Use <code>useCallback</code> for any event handler functions passed to children.</p>`,
      `<p>Do not change the component's props interface — it must remain backward compatible.</p>`,
    ],
    hint: 'Wrap the whole component: export default React.memo(ProductList). Add dependencies correctly to useMemo/useCallback or the optimisation won\'t work.',
    starterCode: `import React, { useMemo, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ProductListProps {
  products: Product[];
  filterCategory: string;
  sortBy: 'name' | 'price';
  onProductClick: (product: Product) => void;
}

// TODO: optimise this component with React.memo, useMemo, useCallback
function ProductList({ products, filterCategory, sortBy, onProductClick }: ProductListProps) {
  // Simulate slow render
  const filtered = products
    .filter(p => filterCategory === 'all' || p.category === filterCategory)
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price);

  const handleClick = (product: Product) => {
    onProductClick(product);
  };

  return (
    <ul>
      {filtered.map(product => (
        <li key={product.id} onClick={() => handleClick(product)}>
          {product.name} - \${product.price}
        </li>
      ))}
    </ul>
  );
}

export default ProductList;
`,
    solution: `import React, { useMemo, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface ProductListProps {
  products: Product[];
  filterCategory: string;
  sortBy: 'name' | 'price';
  onProductClick: (product: Product) => void;
}

function ProductList({ products, filterCategory, sortBy, onProductClick }: ProductListProps) {
  const filtered = useMemo(() =>
    products
      .filter(p => filterCategory === 'all' || p.category === filterCategory)
      .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : a.price - b.price),
    [products, filterCategory, sortBy]
  );

  const handleClick = useCallback((product: Product) => {
    onProductClick(product);
  }, [onProductClick]);

  return (
    <ul>
      {filtered.map(product => (
        <li key={product.id} onClick={() => handleClick(product)}>
          {product.name} - \${product.price}
        </li>
      ))}
    </ul>
  );
}

export default React.memo(ProductList);
`,
    tests: [
      {
        id: 'i6-t1',
        name: 'Uses React.memo',
        points: 25,
        validator: `return code.includes('React.memo(');`,
        errorMessage: 'Must wrap the component with React.memo()',
      },
      {
        id: 'i6-t2',
        name: 'Uses useMemo for filtered list',
        points: 25,
        validator: `return code.includes('useMemo(');`,
        errorMessage: 'Must use useMemo() to memoise the filtered/sorted list',
      },
      {
        id: 'i6-t3',
        name: 'Uses useCallback for handlers',
        points: 25,
        validator: `return code.includes('useCallback(');`,
        errorMessage: 'Must use useCallback() for click handlers',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px">
<div style="background:#0D3D28;border:1px solid #22D48F;border-radius:4px;padding:16px;margin-bottom:16px">
  <strong style="color:#22D48F">✓ Performance Optimised</strong>
  <p style="color:#7A8BA8;margin-top:8px;font-size:0.9rem">Component memoised with React.memo · useMemo filters on [products, filterCategory, sortBy] · useCallback stabilises handlers</p>
</div>
<ul style="list-style:none;padding:0">
  <li style="padding:12px;background:#131D2E;border-radius:4px;margin-bottom:8px;cursor:pointer;border:1px solid #1E2D45">XM Cloud Starter Kit — $199</li>
  <li style="padding:12px;background:#131D2E;border-radius:4px;margin-bottom:8px;cursor:pointer;border:1px solid #1E2D45">JSS SDK — $0</li>
</ul></body></html>`,
  },

  // ─── EXPERIENCED TIER ───────────────────────────────────────────────────────
  {
    id: 'e1-layout-service-parser',
    tier: 'experienced',
    category: 'Sitecore JSS',
    title: 'Sitecore JSS Layout Service Parser',
    points: 100,
    timeLimit: 35,
    brief: `<p>Write a <code>parseLayoutServiceResponse</code> function that extracts route data, placeholders, and component props from a raw Sitecore Layout Service JSON response. Handle nested placeholders recursively.</p>`,
    tasks: [
      `<p>Function signature: <code>parseLayoutServiceResponse(response: unknown): ParsedLayout</code></p>`,
      `<p>Extract <code>route</code> from <code>response.sitecore.route</code>.</p>`,
      `<p>Recursively extract all placeholders (including nested) from the route's <code>placeholders</code> object.</p>`,
      `<p>Return <code>{route, placeholders: Record&lt;string, ComponentRendering[]&gt;, language}</code> typed in TypeScript.</p>`,
    ],
    hint: 'Use a recursive helper that walks the placeholders object. Each placeholder value is an array of renderings, each of which may itself have nested placeholders.',
    starterCode: `interface ComponentRendering {
  componentName: string;
  uid: string;
  fields?: Record<string, unknown>;
  params?: Record<string, string>;
  placeholders?: Record<string, ComponentRendering[]>;
}

interface ParsedLayout {
  route: Record<string, unknown>;
  placeholders: Record<string, ComponentRendering[]>;
  language: string;
}

// TODO: implement parseLayoutServiceResponse
export function parseLayoutServiceResponse(response: unknown): ParsedLayout {
  return { route: {}, placeholders: {}, language: 'en' };
}
`,
    solution: `interface ComponentRendering {
  componentName: string;
  uid: string;
  fields?: Record<string, unknown>;
  params?: Record<string, string>;
  placeholders?: Record<string, ComponentRendering[]>;
}

interface ParsedLayout {
  route: Record<string, unknown>;
  placeholders: Record<string, ComponentRendering[]>;
  language: string;
}

function extractPlaceholders(
  placeholders: Record<string, ComponentRendering[]> | undefined,
  result: Record<string, ComponentRendering[]>
): void {
  if (!placeholders) return;
  for (const [key, renderings] of Object.entries(placeholders)) {
    result[key] = renderings;
    for (const rendering of renderings) {
      if (rendering.placeholders) {
        extractPlaceholders(rendering.placeholders, result);
      }
    }
  }
}

export function parseLayoutServiceResponse(response: unknown): ParsedLayout {
  const r = response as {
    sitecore?: {
      context?: { language?: string };
      route?: {
        placeholders?: Record<string, ComponentRendering[]>;
        [key: string]: unknown;
      };
    };
  };

  const route = r?.sitecore?.route ?? {};
  const language = r?.sitecore?.context?.language ?? 'en';
  const placeholders: Record<string, ComponentRendering[]> = {};

  extractPlaceholders(route.placeholders as Record<string, ComponentRendering[]>, placeholders);

  return { route, placeholders, language };
}
`,
    tests: [
      {
        id: 'e1-t1',
        name: 'Exports parseLayoutServiceResponse',
        points: 20,
        validator: `return code.includes('export function parseLayoutServiceResponse') || code.includes('export const parseLayoutServiceResponse');`,
        errorMessage: 'Must export parseLayoutServiceResponse as a named export',
      },
      {
        id: 'e1-t2',
        name: 'Implements recursive placeholder extraction',
        points: 30,
        validator: `return (code.includes('function extractPlaceholders') || code.includes('recursive') || code.match(/function\s+\w+\([^)]*placeholder/)) && code.includes('placeholders');`,
        errorMessage: 'Must use a recursive function to extract nested placeholders',
      },
      {
        id: 'e1-t3',
        name: 'Returns typed ParsedLayout object',
        points: 20,
        validator: `return code.includes('ParsedLayout') && code.includes('route') && code.includes('placeholders') && code.includes('language');`,
        errorMessage: 'Must return a ParsedLayout with route, placeholders, and language fields',
      },
      {
        id: 'e1-t4',
        name: 'Has TypeScript interfaces defined',
        points: 30,
        validator: `return code.includes('interface ComponentRendering') && code.includes('interface ParsedLayout');`,
        errorMessage: 'Must define TypeScript interfaces for ComponentRendering and ParsedLayout',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:'JetBrains Mono',monospace;padding:24px;font-size:0.85rem">
<pre style="background:#131D2E;padding:24px;border-radius:4px;border:1px solid #1E2D45;overflow-x:auto"><code>parseLayoutServiceResponse(lsResponse)
<span style="color:#22D48F">// →</span> {
  <span style="color:#4DA6FF">route</span>: { name: <span style="color:#F5A623">'home'</span>, displayName: <span style="color:#F5A623">'Home'</span> },
  <span style="color:#4DA6FF">language</span>: <span style="color:#F5A623">'en'</span>,
  <span style="color:#4DA6FF">placeholders</span>: {
    <span style="color:#F5A623">'jss-main'</span>: [{ componentName: <span style="color:#F5A623">'HeroBanner'</span>, ... }],
    <span style="color:#F5A623">'jss-header'</span>: [{ componentName: <span style="color:#F5A623">'Navigation'</span>, ... }],
    <span style="color:#F5A623">'hero-content'</span>: [{ componentName: <span style="color:#F5A623">'ContentBlock'</span>, ... }]  <span style="color:#3D5070">// nested!</span>
  }
}</code></pre></body></html>`,
  },

  {
    id: 'e2-dynamic-placeholder',
    tier: 'experienced',
    category: 'Sitecore JSS',
    title: 'Custom DynamicPlaceholder Component',
    points: 100,
    timeLimit: 35,
    brief: `<p>Build a <code>&lt;DynamicPlaceholder&gt;</code> React component that dynamically resolves and renders components from a component factory registry.</p>`,
    tasks: [
      `<p>Props: <code>name: string</code>, <code>rendering: ComponentRendering</code>, <code>componentFactory: Record&lt;string, React.ComponentType&lt;unknown&gt;&gt;</code></p>`,
      `<p>Look up <code>rendering.placeholders[name]</code> to get the array of component renderings for this placeholder.</p>`,
      `<p>For each rendering in the array, look up its <code>componentName</code> in the <code>componentFactory</code>. Render it, passing <code>fields</code> and <code>params</code> as props.</p>`,
      `<p>If a component is not in the factory, render a fallback: <code>&lt;div data-missing-component={componentName}&gt;</code>.</p>`,
    ],
    hint: 'componentFactory is a plain object: { HeroBanner: HeroBannerComponent, ... }. Use componentFactory[rendering.componentName] to look up.',
    starterCode: `import React from 'react';

interface ComponentRendering {
  componentName: string;
  uid: string;
  fields?: Record<string, unknown>;
  params?: Record<string, string>;
  placeholders?: Record<string, ComponentRendering[]>;
}

interface DynamicPlaceholderProps {
  name: string;
  rendering: ComponentRendering;
  componentFactory: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export default function DynamicPlaceholder({ name, rendering, componentFactory }: DynamicPlaceholderProps) {
  // TODO: resolve and render components from the factory
  return null;
}
`,
    solution: `import React from 'react';

interface ComponentRendering {
  componentName: string;
  uid: string;
  fields?: Record<string, unknown>;
  params?: Record<string, string>;
  placeholders?: Record<string, ComponentRendering[]>;
}

interface DynamicPlaceholderProps {
  name: string;
  rendering: ComponentRendering;
  componentFactory: Record<string, React.ComponentType<Record<string, unknown>>>;
}

export default function DynamicPlaceholder({ name, rendering, componentFactory }: DynamicPlaceholderProps) {
  const renderings = rendering.placeholders?.[name] ?? [];

  return (
    <div data-placeholder={name}>
      {renderings.map(r => {
        const Component = componentFactory[r.componentName];
        if (!Component) {
          return <div key={r.uid} data-missing-component={r.componentName} />;
        }
        return (
          <Component
            key={r.uid}
            fields={r.fields ?? {}}
            params={r.params ?? {}}
          />
        );
      })}
    </div>
  );
}
`,
    tests: [
      {
        id: 'e2-t1',
        name: 'Looks up componentName in factory',
        points: 30,
        validator: `return code.includes('componentFactory[') && code.includes('componentName');`,
        errorMessage: 'Must look up componentFactory[rendering.componentName] to resolve component',
      },
      {
        id: 'e2-t2',
        name: 'Renders fallback for missing components',
        points: 25,
        validator: `return code.includes('data-missing-component') || code.includes('missing') || code.includes('fallback');`,
        errorMessage: 'Must render a fallback element (with data-missing-component attribute) for unknown components',
      },
      {
        id: 'e2-t3',
        name: 'Passes fields and params to component',
        points: 25,
        validator: `return code.includes('fields') && code.includes('params') && code.includes('<Component');`,
        errorMessage: 'Must pass fields and params as props to each resolved component',
      },
      {
        id: 'e2-t4',
        name: 'Uses data-placeholder attribute',
        points: 20,
        validator: `return code.includes('data-placeholder');`,
        errorMessage: 'Must add data-placeholder={name} to the wrapper element',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px">
<div style="border:2px dashed #1E2D45;border-radius:4px;padding:16px;margin-bottom:12px">
  <span style="color:#3D5070;font-size:0.8rem">data-placeholder="jss-main"</span>
  <div style="background:#131D2E;border-radius:4px;padding:16px;margin-top:12px;border:1px solid #1E2D45">
    <span style="color:#7C5CFC;font-size:0.8rem">HeroBanner</span>
    <p style="color:#7A8BA8;margin-top:4px;font-size:0.9rem">Component resolved from factory ✓</p>
  </div>
  <div style="background:#3D0F1A;border-radius:4px;padding:12px;margin-top:8px;border:1px solid #F0476B">
    <span style="color:#F0476B;font-size:0.8rem">data-missing-component="UnknownWidget" — fallback rendered</span>
  </div>
</div></body></html>`,
  },

  {
    id: 'e3-middleware-personalisation',
    tier: 'experienced',
    category: 'Next.js',
    title: 'Next.js Middleware for Sitecore Personalisation',
    points: 100,
    timeLimit: 40,
    brief: `<p>Write Next.js Edge Middleware (<code>middleware.ts</code>) that reads a Sitecore personalisation cookie, evaluates rules, and rewrites the request to a personalised path.</p>`,
    tasks: [
      `<p>Read a cookie named <code>sc_audience</code> from the request (e.g., <code>"enterprise"</code>, <code>"developer"</code>, <code>"default"</code>).</p>`,
      `<p>Match the audience against a rules object: <code>{ enterprise: '/variants/enterprise', developer: '/variants/developer' }</code>.</p>`,
      `<p>If a match is found, rewrite the request to the variant path using <code>NextResponse.rewrite</code>. Otherwise, let the request pass through.</p>`,
      `<p>Export a <code>config</code> object with <code>matcher</code> to only run on <code>/</code> and <code>/pages/:path*</code>. Must run on Edge Runtime.</p>`,
    ],
    hint: 'Use request.cookies.get("sc_audience")?.value in Edge Middleware. NextResponse.rewrite(new URL(variantPath, request.url)).',
    starterCode: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const personalisationRules: Record<string, string> = {
  enterprise: '/variants/enterprise',
  developer: '/variants/developer',
};

// TODO: implement middleware and export config
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
`,
    solution: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const personalisationRules: Record<string, string> = {
  enterprise: '/variants/enterprise',
  developer: '/variants/developer',
};

export function middleware(request: NextRequest) {
  const audience = request.cookies.get('sc_audience')?.value;

  if (audience && personalisationRules[audience]) {
    const variantPath = personalisationRules[audience];
    return NextResponse.rewrite(new URL(variantPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/pages/:path*'],
  runtime: 'edge',
};
`,
    tests: [
      {
        id: 'e3-t1',
        name: 'Reads sc_audience cookie',
        points: 25,
        validator: `return code.includes('sc_audience') && code.includes('cookies');`,
        errorMessage: 'Must read the "sc_audience" cookie from the request',
      },
      {
        id: 'e3-t2',
        name: 'Uses NextResponse.rewrite',
        points: 25,
        validator: `return code.includes('NextResponse.rewrite');`,
        errorMessage: 'Must use NextResponse.rewrite() to redirect to variant path',
      },
      {
        id: 'e3-t3',
        name: 'Exports config with matcher',
        points: 25,
        validator: `return code.includes('export const config') && code.includes('matcher');`,
        errorMessage: 'Must export a config object with a matcher array',
      },
      {
        id: 'e3-t4',
        name: 'Falls through for unmatched audiences',
        points: 25,
        validator: `return code.includes('NextResponse.next()');`,
        errorMessage: 'Must call NextResponse.next() when no personalisation rule matches',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:'JetBrains Mono',monospace;padding:24px;font-size:0.85rem">
<pre style="background:#131D2E;padding:24px;border-radius:4px;border:1px solid #1E2D45"><code><span style="color:#3D5070">// Cookie: sc_audience=enterprise</span>
GET / → <span style="color:#22D48F">rewrite → /variants/enterprise</span>

<span style="color:#3D5070">// Cookie: sc_audience=developer</span>
GET /pages/docs → <span style="color:#22D48F">rewrite → /variants/developer</span>

<span style="color:#3D5070">// No cookie / unknown audience</span>
GET /pages/about → <span style="color:#4DA6FF">pass through (NextResponse.next())</span>

<span style="color:#3D5070">// Runs on Edge Runtime — zero cold start</span></code></pre></body></html>`,
  },

  {
    id: 'e4-content-query-hook',
    tier: 'experienced',
    category: 'React Component',
    title: 'GraphQL Content Query Hook',
    points: 100,
    timeLimit: 35,
    brief: `<p>Build a <code>useContentQuery</code> hook using native <code>fetch</code> (no Apollo). It must handle loading/error/data states and cache results.</p>`,
    tasks: [
      `<p>Signature: <code>useContentQuery&lt;T&gt;(query: string, variables?: Record&lt;string, unknown&gt;): {data: T | null, loading: boolean, error: Error | null, refetch: () => void}</code></p>`,
      `<p>POST the query and variables to a GraphQL endpoint (accept <code>endpoint</code> as a param or env var).</p>`,
      `<p>Cache results in a <code>useRef</code> Map keyed by <code>JSON.stringify({query, variables})</code>. Return cached data immediately on re-render.</p>`,
      `<p>Expose a <code>refetch</code> function that bypasses cache and re-fetches.</p>`,
    ],
    hint: 'useRef persists across renders without triggering re-renders — perfect for a cache Map. Track a refetch counter in useState to trigger the useEffect.',
    starterCode: `import { useState, useEffect, useRef, useCallback } from 'react';

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useContentQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  endpoint?: string
): QueryResult<T> {
  // TODO: implement hook with caching
  return { data: null, loading: false, error: null, refetch: () => {} };
}
`,
    solution: `import { useState, useEffect, useRef, useCallback } from 'react';

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useContentQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  endpoint = '/api/graphql'
): QueryResult<T> {
  const cache = useRef<Map<string, T>>(new Map());
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchCounter, setRefetchCounter] = useState(0);

  const cacheKey = JSON.stringify({ query, variables });

  useEffect(() => {
    let cancelled = false;

    const cached = refetchCounter === 0 ? cache.current.get(cacheKey) : undefined;
    if (cached !== undefined) {
      setData(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then((json: { data: T }) => {
        if (!cancelled) {
          cache.current.set(cacheKey, json.data);
          setData(json.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [cacheKey, endpoint, refetchCounter]);

  const refetch = useCallback(() => {
    cache.current.delete(cacheKey);
    setRefetchCounter(c => c + 1);
  }, [cacheKey]);

  return { data, loading, error, refetch };
}
`,
    tests: [
      {
        id: 'e4-t1',
        name: 'Uses useRef for cache',
        points: 25,
        validator: `return code.includes('useRef') && code.includes('Map') && code.includes('cache');`,
        errorMessage: 'Must use useRef to store a Map for caching results',
      },
      {
        id: 'e4-t2',
        name: 'Uses JSON.stringify as cache key',
        points: 20,
        validator: `return code.includes('JSON.stringify') && (code.includes('query') || code.includes('variables'));`,
        errorMessage: 'Must use JSON.stringify({query, variables}) as the cache key',
      },
      {
        id: 'e4-t3',
        name: 'Exposes refetch function',
        points: 25,
        validator: `return code.includes('refetch') && (code.includes('useCallback') || code.includes('() =>'));`,
        errorMessage: 'Must expose a refetch function that re-fetches data',
      },
      {
        id: 'e4-t4',
        name: 'Uses fetch with POST method',
        points: 15,
        validator: `return code.includes("method: 'POST'") || code.includes('method:"POST"') || code.includes('method: "POST"');`,
        errorMessage: 'Must use fetch with method: "POST" for GraphQL requests',
      },
      {
        id: 'e4-t5',
        name: 'Returns loading, error, data',
        points: 15,
        validator: `return code.includes('loading') && code.includes('error') && code.includes('data');`,
        errorMessage: 'Must return { data, loading, error, refetch } from the hook',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:'JetBrains Mono',monospace;padding:24px;font-size:0.85rem">
<pre style="background:#131D2E;padding:24px;border-radius:4px;border:1px solid #1E2D45"><code><span style="color:#7C5CFC">const</span> { data, loading, error, refetch } =
  <span style="color:#22D48F">useContentQuery</span>&lt;Article[]&gt;(
    ARTICLES_QUERY,
    { language: <span style="color:#F5A623">'en'</span> }
  );

<span style="color:#3D5070">// ① First call  → fetch + cache</span>
<span style="color:#3D5070">// ② Re-render   → return cached instantly</span>
<span style="color:#3D5070">// ③ refetch()   → bypass cache, re-fetch</span></code></pre></body></html>`,
  },

  {
    id: 'e5-cdp-tracker',
    tier: 'experienced',
    category: 'JavaScript Logic',
    title: 'Sitecore CDP Event Tracker',
    points: 100,
    timeLimit: 35,
    brief: `<p>Write a <code>SitecoreCDPTracker</code> TypeScript class that POSTs analytics events to the Sitecore CDP REST API. Queue events called before <code>init()</code>.</p>`,
    tasks: [
      `<p>Implement: <code>init(clientKey: string, targetURL: string): void</code></p>`,
      `<p>Implement: <code>trackPageView(route: string): Promise&lt;void&gt;</code></p>`,
      `<p>Implement: <code>trackEvent(eventName: string, data: Record&lt;string, unknown&gt;): Promise&lt;void&gt;</code></p>`,
      `<p>Implement: <code>identify(email: string, traits: Record&lt;string, unknown&gt;): Promise&lt;void&gt;</code></p>`,
      `<p>If any track/identify method is called before <code>init()</code>, queue the call and flush the queue once <code>init()</code> is called.</p>`,
    ],
    hint: 'Store a private queue array of { method, args } objects. In init(), flush the queue by calling each method with its stored args.',
    starterCode: `type QueuedCall = {
  method: 'trackPageView' | 'trackEvent' | 'identify';
  args: unknown[];
};

export class SitecoreCDPTracker {
  private clientKey = '';
  private targetURL = '';
  private initialized = false;
  private queue: QueuedCall[] = [];

  // TODO: implement init, trackPageView, trackEvent, identify
}
`,
    solution: `type QueuedCall = {
  method: 'trackPageView' | 'trackEvent' | 'identify';
  args: unknown[];
};

export class SitecoreCDPTracker {
  private clientKey = '';
  private targetURL = '';
  private initialized = false;
  private queue: QueuedCall[] = [];

  init(clientKey: string, targetURL: string): void {
    this.clientKey = clientKey;
    this.targetURL = targetURL;
    this.initialized = true;

    const pending = [...this.queue];
    this.queue = [];
    for (const call of pending) {
      if (call.method === 'trackPageView') this.trackPageView(call.args[0] as string);
      else if (call.method === 'trackEvent') this.trackEvent(call.args[0] as string, call.args[1] as Record<string, unknown>);
      else if (call.method === 'identify') this.identify(call.args[0] as string, call.args[1] as Record<string, unknown>);
    }
  }

  async trackPageView(route: string): Promise<void> {
    if (!this.initialized) { this.queue.push({ method: 'trackPageView', args: [route] }); return; }
    await this.post({ event: 'VIEW', route });
  }

  async trackEvent(eventName: string, data: Record<string, unknown>): Promise<void> {
    if (!this.initialized) { this.queue.push({ method: 'trackEvent', args: [eventName, data] }); return; }
    await this.post({ event: eventName, ...data });
  }

  async identify(email: string, traits: Record<string, unknown>): Promise<void> {
    if (!this.initialized) { this.queue.push({ method: 'identify', args: [email, traits] }); return; }
    await this.post({ event: 'IDENTITY', email, ...traits });
  }

  private async post(payload: Record<string, unknown>): Promise<void> {
    await fetch(this.targetURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.clientKey,
      },
      body: JSON.stringify(payload),
    });
  }
}
`,
    tests: [
      {
        id: 'e5-t1',
        name: 'Has init() method',
        points: 20,
        validator: `return code.includes('init(') && (code.includes('clientKey') || code.includes('targetURL'));`,
        errorMessage: 'Must implement an init(clientKey, targetURL) method',
      },
      {
        id: 'e5-t2',
        name: 'Queues events before init',
        points: 30,
        validator: `return code.includes('queue') && (code.includes('push(') || code.includes('.push({'));`,
        errorMessage: 'Must queue events when called before init() using an array',
      },
      {
        id: 'e5-t3',
        name: 'Flushes queue on init',
        points: 25,
        validator: `return code.includes('queue') && (code.includes('for (') || code.includes('forEach') || code.includes('for('));`,
        errorMessage: 'Must flush the queue (replay queued calls) when init() is called',
      },
      {
        id: 'e5-t4',
        name: 'Uses fetch with POST',
        points: 25,
        validator: `return code.includes("method: 'POST'") || code.includes('method:"POST"') || code.includes('method: "POST"');`,
        errorMessage: 'Must use fetch with method: POST to send events to the CDP API',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><body style="background:#070B14;color:#E8EEF8;font-family:'JetBrains Mono',monospace;padding:24px;font-size:0.85rem">
<pre style="background:#131D2E;padding:24px;border-radius:4px;border:1px solid #1E2D45"><code><span style="color:#7C5CFC">const</span> tracker = <span style="color:#7C5CFC">new</span> <span style="color:#22D48F">SitecoreCDPTracker</span>();

<span style="color:#3D5070">// Called before init — queued!</span>
tracker.<span style="color:#4DA6FF">trackPageView</span>(<span style="color:#F5A623">'/home'</span>);
tracker.<span style="color:#4DA6FF">identify</span>(<span style="color:#F5A623">'user@example.com'</span>, { plan: <span style="color:#F5A623">'enterprise'</span> });

<span style="color:#3D5070">// init() flushes queue → both POSTed immediately</span>
tracker.<span style="color:#22D48F">init</span>(<span style="color:#F5A623">'my-client-key'</span>, <span style="color:#F5A623">'https://api.boxever.com/v1.2'</span>);</code></pre></body></html>`,
  },

  {
    id: 'e6-edge-rendering',
    tier: 'experienced',
    category: 'Performance',
    title: 'Edge Rendering with Streaming',
    points: 100,
    timeLimit: 40,
    brief: `<p>Refactor an SSR page to use Next.js Edge Runtime with React Suspense streaming, dynamic imports with loading skeletons, and stale-while-revalidate via Cache-Control headers.</p>`,
    tasks: [
      `<p>Add <code>export const runtime = 'edge'</code> to the page or route handler.</p>`,
      `<p>Use <code>dynamic(() => import('./HeavyComponent'), { loading: () => &lt;Skeleton /&gt; })</code> for at least one component.</p>`,
      `<p>Wrap lazy-loaded sections with <code>&lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;</code>.</p>`,
      `<p>In a route handler (<code>route.ts</code>), set <code>Cache-Control: s-maxage=60, stale-while-revalidate=300</code> header.</p>`,
    ],
    hint: 'Edge Runtime pages must not use Node.js APIs. Use next/dynamic with ssr:false only for client components. For streaming, Suspense works server-side in App Router.',
    starterCode: `import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// TODO: add Edge Runtime export
// TODO: dynamic import with loading skeleton
// TODO: Suspense wrapper
// TODO: Cache-Control in route handler

function Skeleton() {
  return <div className="skeleton" aria-busy="true" />;
}

export default function EdgePage() {
  return (
    <main>
      <h1>Edge Rendering Demo</h1>
      {/* TODO: wrap content in Suspense with dynamic import */}
    </main>
  );
}
`,
    solution: `import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

export const runtime = 'edge';

function Skeleton() {
  return <div className="skeleton" style={{ background: '#131D2E', borderRadius: 4, height: 200, animation: 'pulse 1.5s ease-in-out infinite' }} aria-busy="true" />;
}

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

export default function EdgePage() {
  return (
    <main>
      <h1>Edge Rendering Demo</h1>
      <Suspense fallback={<Skeleton />}>
        <HeavyComponent />
      </Suspense>
    </main>
  );
}

// In route.ts:
// export const runtime = 'edge';
// export function GET() {
//   return new Response(JSON.stringify({ ok: true }), {
//     headers: {
//       'Content-Type': 'application/json',
//       'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
//     },
//   });
// }
`,
    tests: [
      {
        id: 'e6-t1',
        name: 'Exports Edge Runtime',
        points: 25,
        validator: `return code.includes("runtime = 'edge'") || code.includes('runtime = "edge"');`,
        errorMessage: 'Must export runtime = "edge" to opt into Edge Runtime',
      },
      {
        id: 'e6-t2',
        name: 'Uses next/dynamic with loading',
        points: 25,
        validator: `return code.includes('dynamic(') && code.includes('loading:') || code.includes('loading: ()');`,
        errorMessage: 'Must use next/dynamic with a loading skeleton fallback',
      },
      {
        id: 'e6-t3',
        name: 'Uses React Suspense',
        points: 25,
        validator: `return code.includes('<Suspense') && code.includes('fallback=');`,
        errorMessage: 'Must wrap lazy-loaded content with <Suspense fallback={...}>',
      },
      {
        id: 'e6-t4',
        name: 'Has stale-while-revalidate Cache-Control',
        points: 25,
        validator: `return code.includes('stale-while-revalidate') && code.includes('Cache-Control');`,
        errorMessage: 'Must set Cache-Control with stale-while-revalidate in a route handler',
      },
    ],
    previewHtml: `<!DOCTYPE html><html><head><style>
body{background:#070B14;color:#E8EEF8;font-family:system-ui;padding:24px}
.skeleton{background:linear-gradient(90deg,#131D2E 25%,#1A2640 50%,#131D2E 75%);background-size:200% 100%;border-radius:4px;height:160px;animation:shimmer 1.5s infinite}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.badge{background:#0D2640;color:#4DA6FF;padding:4px 10px;border-radius:4px;font-size:0.8rem;margin-bottom:16px;display:inline-block}
.loaded{background:#131D2E;border-radius:4px;padding:24px;border:1px solid #1E2D45}
</style></head><body>
<span class="badge">Edge Runtime · Streaming · s-maxage=60, stale-while-revalidate=300</span>
<h1 style="margin-bottom:16px">Edge Rendering Demo</h1>
<div id="comp" class="skeleton"></div>
<script>setTimeout(()=>{document.getElementById('comp').outerHTML='<div class="loaded"><h3>HeavyComponent loaded ✓</h3><p style="color:#7A8BA8">Streamed after Suspense resolved</p></div>'},1500)</script>
</body></html>`,
  },
];

export function getChallengesByTier(tier: string): Challenge[] {
  return challenges.filter(c => c.tier === tier);
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id);
}

export function getTotalPointsForTier(tier: string): number {
  return getChallengesByTier(tier).reduce((sum, c) => sum + c.points, 0);
}

export function getTotalTimeLimitForTier(tier: string): number {
  return getChallengesByTier(tier).reduce((sum, c) => sum + c.timeLimit, 0);
}
