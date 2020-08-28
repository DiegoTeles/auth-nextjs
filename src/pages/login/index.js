import Head from 'next/head';

export default function Login() {
  return (
    <div >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form>
          <input type="text" name="user" />
          <input type="password" name="password" />
          <button type="submit">Login</button>
        </form>

      </main>

    </div>
  )
}
