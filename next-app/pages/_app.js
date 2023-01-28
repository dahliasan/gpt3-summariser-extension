import '../styles/globals.css'

import { Sora } from '@next/font/google'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

function MyApp({ Component, pageProps }) {
  return (
    <main className={sora.className}>
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp
