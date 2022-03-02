import { useSigningClient } from 'contexts/cosmwasm'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from 'components/ThemeToggle'

function Nav() {
  const { walletAddress, connectWallet, disconnect } = useSigningClient()
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet()
    } else {
      disconnect()
    }
  }

  const PUBLIC_SITE_ICON_URL = process.env.NEXT_PUBLIC_SITE_ICON_URL || ''

  return (
    <div className="border-b w-screen px-2 md:px-16">
      <nav className="main-menu">
        <div className="col">
          <div className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <a className="ml-1 md:ml-2 link link-hover font-semibold text-xl md:text-2xl align-top">
                  {process.env.NEXT_PUBLIC_SITE_TITLE}
                </a>
              </Link>
            </div>
            <ThemeToggle />
            <div className="flex flex-grow lg:flex-grow-0 max-w-full">
              <button
                className="block btn btn-outline btn-primary w-full max-w-full truncate"
                onClick={handleConnect}
              >
                {walletAddress && walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4) || 'Connect Wallet'}
              </button>
            </div>
          </div>
          {walletAddress &&
            <div className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-starter items-center">
              <div className="flex items-center">
                <Link href="/faq">
                  <a className="ml-1 md:ml-2 link link-hover font-semibold text-ml md:text-2ml align-top">
                    Faq
                  </a>
                </Link>
                <span className="ml-1 md:ml-2">|</span>
                <Link href="/prewinner">
                  <a className="ml-1 md:ml-2 link link-hover font-semibold text-ml md:text-2ml align-top">
                    Previous Winners
                  </a>
                </Link>
                <span className="ml-1 md:ml-2">|</span>
              </div>
            </div>
          }
        </div>
      </nav>
    </div>
  )
}

export default Nav
