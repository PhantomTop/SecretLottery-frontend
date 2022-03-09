import { ReactNode } from 'react'
import Head from 'next/head'
import Nav from './Nav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content">
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
        <meta name="description" content="Weekly Secret Network Raffle" />
        {/* <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22></text></svg>" /> */}
        <link rel="icon" href="favicon.ico" />
      </Head>

      <Nav />
      <main className="flex flex-col items-center justify-center w-full flex-1 p-2 md:px-20 text-center">
        {children}
      </main>
      <footer className="flex items-center justify-center w-full h-20 border-t">
        {/* Powered by{' '}
        <a
          className="pl-1 link link-primary link-hover"
          href="https://t.me/CryptooPegasus"
        >
          CryptooPegasus
        </a>
        &nbsp; */}
        <a href="https://discord.gg/SCP22MUG5f" className="mb-0 mr-4">
            <i className='fab fa-discord fa-3x'></i>
          </a>
          <a href="https://t.me/secretraffle" className="mb-0 ml-4">
            <i className='fab fa-telegram fa-3x'></i>
          </a>
      </footer>
    </div>
  )
}
