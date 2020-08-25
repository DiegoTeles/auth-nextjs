import Head from 'next/head'

export default function Home() {
  return (
    <div >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <h1 >
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p >
          Get started by editing{' '}
          <code >pages/index.js</code>
        </p>

      </main>

      <footer >
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </div>
  )
}
