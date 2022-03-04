import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'

const Faq: NextPage = () => {

  return (
    <WalletLoader loading={false}>

      <h1 className="mt-2 text-5xl font-bold">
        Raffle FAQ
      </h1>

      <div className="mt-8 col">
        <span className="ml-1 md:ml-2 link link-hover font-semibold text-ml md:text-2ml align-top">
          Secret Raffle is a low cost of entry game of chance.
          Each week on Sunday 1600 UTC a new drawing period begins.
          During the follow 7 days players have an opportunity to buy tickets.
          After connecting your Keplr wallet you will see the interface for ticket purchases.
        </span>
        <div className="list-panel">
          <ol className="item-list ml-6">
            <li>
              Each ticket costs 1 $SCRT</li>
            <li>
              You can buy anywhere from 1 - 99 tickets
            </li>
            <li>
              Tickets do no have to one purchased all at once. Players can return to buy more throughout the week
            </li>
            <li>
              Ticket numbers are assigned in serial order
            </li>
            <li>
              The total prize at any given time will be displayed and updated as it grows
            </li>
            <li>
              There will be a minor house fee deducted from the prize for maintenance and development of the dApp
            </li>
            <li>
              You will also be able to see all the ticket numbers you have purchased
            </li>
            <li>
              At the time of the drawing one ticket number is selected at random
            </li>
            <li>
              The winner will be announced and automatically be sent the prize to their wallets
            </li>
            <li>
              More questions/comments?
            </li>

          </ol>
        </div>
        <div className="mt-5 text-3xl">
          <a href="http://discord.gg/SCP22MUG5f" className="mb-2 mr-4">
            <i className='fab fa-discord fa-2xl'></i>
          </a>
          <a href="http://t.me/secretraffle" className="mb-2 ml-4">
            <i className='fab fa-telegram fa-2xl'></i>
          </a>
        </div>
      </div>

    </WalletLoader>
  )
}

export default Faq
