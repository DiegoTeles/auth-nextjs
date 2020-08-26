import Head from 'next/head';
import authAPI from '../../api/auth';

export default function Login() {
  async function loginNow(e) {
    authAPI.login({
      user: e.target.value.user,
      password: e.target.value.password,
    }).then(
      window.location.assign('/dashboard')
    )
  }
  return (
    <div >
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <form onSubmit={loginNow}>
          <input type="text" name="user">Usuário</input>
          <input type="password" name="password">Senha</input>
          <button type="submit">Login</button>
        </form>

      </main>

    </div>
  )
}
