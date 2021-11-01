import '../styles/globals.css'
import Link from 'next/link'
import Navigation from '../components/Navigation'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
