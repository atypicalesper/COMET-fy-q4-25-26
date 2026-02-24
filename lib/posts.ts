export interface Post {
  slug: string;
  title: string;
  date: string;
  week: number;
  tags: string[];
  excerpt: string;
  content: string;
}

const posts: Post[] = [
  {
    slug: "week-1-app-router-fundamentals",
    title: "Week 1: App Router Fundamentals",
    date: "2026-02-10",
    week: 1,
    tags: ["next.js", "app-router", "routing"],
    excerpt:
      "Setting up a Next.js 15 project and understanding the App Router mental model — file-based routing, Server vs Client Components, and the special files.",
    content: `
## What I covered

This week was all about internalising the App Router. Coming from the Pages Router, the shift in mental model is real.

**Key things that clicked:**

The biggest difference is that *all* components default to Server Components. You opt into the client with \`"use client"\`. This changes how you think about data fetching — instead of \`getServerSideProps\` or \`useEffect\`, you just \`await\` directly in the component.

**Special files I drilled:**

- \`page.tsx\` — the route UI
- \`layout.tsx\` — wraps children, persists on navigation (sidebar, nav)
- \`loading.tsx\` — automatic Suspense boundary while the page loads
- \`error.tsx\` — client-side error boundary per segment
- \`not-found.tsx\` — custom 404 per segment

**Nested layouts** are the feature I was most surprised by. You can have a \`/dashboard/layout.tsx\` that wraps all dashboard routes with a sidebar, without it affecting the rest of the app.

## Code I wrote

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
\`\`\`

## What's next

Week 2 is UI and component design with Tailwind. I want to build a small design system — buttons, inputs, a card component — before moving to data fetching.
    `,
  },
  {
    slug: "week-2-tailwind-and-components",
    title: "Week 2: Tailwind CSS & Component Design",
    date: "2026-02-17",
    week: 2,
    tags: ["tailwind", "components", "design-system"],
    excerpt:
      "Building reusable components with Tailwind CSS, using cva for variants, cn() for class merging, and thinking about component API design.",
    content: `
## What I covered

Set up Tailwind and spent most of the week thinking about component API design. The goal was a small system I'd actually reuse — Button, Input, and a Card.

**The \`cn()\` utility:**

\`\`\`ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
\`\`\`

This solves the annoying problem where passing \`px-4\` to a component that already has \`px-2\` results in both classes existing in the DOM. \`twMerge\` deduplicates them correctly.

**CVA for variants:**

Instead of messy ternary chains, \`class-variance-authority\` lets you declare variants declaratively:

\`\`\`ts
const buttonVariants = cva('base-classes', {
  variants: {
    variant: { primary: '...', ghost: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
\`\`\`

Type-safe, clean, and you get autocompletion on variant props.

## What clicked

Keeping Client Components as leaf nodes. The component tree should be: Server Component (data fetching) → Server Component (layout) → Client Component (interactive button at the bottom). Not the other way around.

## What's next

Week 3 is data fetching and rendering strategies — SSG, ISR, SSR. I want to understand caching properly.
    `,
  },
  {
    slug: "week-3-data-fetching-and-rendering",
    title: "Week 3: Data Fetching & Rendering Strategies",
    date: "2026-02-24",
    week: 3,
    tags: ["data-fetching", "ssr", "ssg", "isr", "caching"],
    excerpt:
      "Deep dive into Next.js caching — four layers, SSG vs ISR vs SSR, and when to use each. The caching model is complex but it makes sense once it clicks.",
    content: `
## What I covered

This week broke my brain a little. Next.js has *four* caching layers and I had to draw diagrams to understand them.

**The four caches:**

1. **Request Memoization** — deduplicates identical \`fetch()\` calls in one render pass
2. **Data Cache** — persists fetch results across requests (like a CDN for data)
3. **Full Route Cache** — cached HTML/RSC payload for static routes
4. **Router Cache** — client-side prefetch cache for instant navigation

**Choosing a rendering strategy:**

\`\`\`
Is content the same for everyone?
├── Yes → changes infrequently? → SSG
│       → changes every N seconds? → ISR
└── No  → user-specific? → SSR
\`\`\`

**ISR stale-while-revalidate:**

When a cached page expires, the *next* request gets the stale page immediately while background regeneration runs. The request after that gets fresh data. Nobody waits.

\`\`\`tsx
export const revalidate = 60; // revalidate route every 60s

// Or per-fetch:
fetch(url, { next: { revalidate: 60 } });
\`\`\`

## What surprised me

You can tag fetches and invalidate them on demand via a webhook:

\`\`\`tsx
fetch(url, { next: { tags: ['posts'] } });

// Later, from a CMS webhook:
revalidateTag('posts');
\`\`\`

This is genuinely useful for headless CMS setups.

## What's next

Week 4: Server Actions. I've been putting off learning them properly.
    `,
  },
  {
    slug: "week-4-server-actions-and-forms",
    title: "Week 4: Server Actions & Forms",
    date: "2026-03-03",
    week: 4,
    tags: ["server-actions", "forms", "zod", "mutations"],
    excerpt:
      "Server Actions replace the need for API routes for mutations. Combined with Zod validation and useActionState, forms feel completely different now.",
    content: `
## What I covered

Server Actions are the piece of Next.js I was most sceptical about. They looked like magic. Now they make sense.

**The key insight:**

Server Actions are just POST endpoints that Next.js auto-generates. When you mark a function with \`'use server'\`, Next.js:
1. Removes it from the client bundle
2. Creates a POST endpoint for it
3. Wires the \`<form action={fn}>\` to call that endpoint

No manual API route. No \`fetch()\`. No \`useEffect\`.

**Zod + useActionState pattern:**

\`\`\`tsx
// action.ts
'use server';
export async function createPost(prevState, formData) {
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  await db.post.create({ data: result.data });
  revalidatePath('/posts');
  redirect('/posts');
}

// Form.tsx
'use client';
const [state, action, isPending] = useActionState(createPost, null);
\`\`\`

**Security rules I'm following:**
1. Always authenticate before mutation
2. Always check the user owns the resource
3. Always validate with Zod — never trust FormData

## What surprised me

\`useFormStatus\` in child components. A \`<SubmitButton />\` component automatically knows the form is pending without prop drilling. It reads from a React context set by the form.

## What's next

Week 5: Authentication with Auth.js. I want proper login with GitHub OAuth.
    `,
  },
  {
    slug: "week-5-authentication",
    title: "Week 5: Authentication with Auth.js",
    date: "2026-03-10",
    week: 5,
    tags: ["auth", "nextauth", "sessions", "rbac"],
    excerpt:
      "Setting up Auth.js with GitHub OAuth and credentials. Protecting routes with middleware, extending the session type, and implementing role-based access.",
    content: `
## What I covered

Authentication week. I set up Auth.js (NextAuth v5) with two providers: GitHub OAuth and email/password credentials.

**The setup:**

\`\`\`ts
// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GitHub, Credentials({ authorize })],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: ({ token, user }) => { /* attach role */ },
    session: ({ session, token }) => { /* expose to client */ },
  },
});
\`\`\`

**JWT vs database sessions:**

JWT is stateless — no DB read on every request. Fast, but can't be revoked without a blacklist. Database sessions are revokable but need a DB lookup per request. I went with JWT for this project.

**Middleware protection:**

\`\`\`ts
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  if (req.nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});
\`\`\`

**RBAC pattern:**

Extended the session type to include \`role\`, then created a \`requireAuth(minRole)\` helper that redirects based on role hierarchy.

## What clicked

The separation of concerns: middleware handles blanket route protection (redirect all unauth users away from /dashboard/*), page components handle fine-grained authorization (check resource ownership).

## What's next

Week 6: Performance and SEO. Metadata API, image optimization, Core Web Vitals.
    `,
  },
  {
    slug: "week-6-performance-and-seo",
    title: "Week 6: Performance Optimization & SEO",
    date: "2026-03-17",
    week: 6,
    tags: ["performance", "seo", "core-web-vitals", "metadata"],
    excerpt:
      "Metadata API for dynamic OG tags, image optimization with next/image, font optimization, Core Web Vitals, and bundle analysis.",
    content: `
## What I covered

Performance and SEO week. A lot of this is configuration, but the mental models matter.

**Metadata API:**

\`\`\`tsx
// Static
export const metadata: Metadata = {
  title: { template: '%s | My App', default: 'My App' },
  metadataBase: new URL('https://myapp.com'),
};

// Dynamic (per page, fetches its own data)
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    openGraph: { images: [post.coverImage] },
  };
}
\`\`\`

**Core Web Vitals targets:**

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

**Key wins:**

- \`next/image\` with \`priority\` on the LCP image (avoids lazy loading the above-the-fold image)
- \`next/font\` to eliminate external font requests (no FOUT, no CLS)
- \`sizes\` prop on images (tells browser which source to download per viewport)
- Dynamic imports for below-the-fold heavy components

**Bundle analysis:**

Ran \`ANALYZE=true npm run build\`. Found I was importing all of lodash. Switched to native \`Object.groupBy()\`.

## Automating robots.ts and sitemap.ts

These files are just TypeScript that returns the right shape — Next.js handles the rest. Clean.

## What's next

Week 7: Architecture and a production project. Bringing everything together.
    `,
  },
];

export function getAllPosts(): Post[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}
