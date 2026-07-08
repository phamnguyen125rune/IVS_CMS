// PLACEHOLDER — Application home page
//
// TODO: Redirect to locale-appropriate default page once auth is wired up.
//   Logged in  → /{locale}/users  (admin dashboard)
//   Logged out → /{locale}/login
//
// COMMENT_OUT: Auth redirect logic below — kept for reference, not active yet
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
//
// const cookieStore = await cookies();
// const token = cookieStore.get('session_token')?.value;
// redirect(token ? `/${locale}/users` : `/${locale}/login`);

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Demo: CSR vs SSR — Next.js ↔ Java Spring Boot</h1>
      <ul>
        <a className='text-blue-500'>
          <Link href="/example/csr">CSR — browser calls Java directly</Link>
        </a>
        <br />
        <a className='text-blue-500'>
          <Link href="/example/ssr">SSR — Next.js server calls Java, renders HTML</Link>
        </a>
      </ul>
    </div>
  );
}
