import type { NextPage } from 'next'
import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'
import WalletLoader from 'components/WalletLoader'
import { useAlert } from 'react-alert'
import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
  convertFromMicroDenom
} from 'util/conversion'

const PUBLIC_TOKEN_SALE_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT || ''
const PUBLIC_CODEHASH = process.env.NEXT_PUBLIC_CODEHASH || ''

const Faq: NextPage = () => {
  const { walletAddress, client, connectWallet } = useSigningClient()
  const [lastWinner, setLastWinner] = useState(0)
  const [lastWinnerAddress, setLastWinnerAddress] = useState('')
  const [lastWinnerAmount, setLastWinnerAmount] = useState(0)
  const [winState, setWinState] = useState(false)
  const [loading, setLoading] = useState(false)
  const alert = useAlert()
  const [lotteryState, setLotteryState] = useState(null)

  useEffect(() => {
    if (!client || walletAddress.length === 0) return

    if (loading)
      return
    client.query.compute.queryContract({
      address: PUBLIC_TOKEN_SALE_CONTRACT,
      codeHash: PUBLIC_CODEHASH,
      query: { "total_state": {} },
    }).then((response) => {
      console.log(response)
      setLotteryState(response.Ok)
      setLastWinner(response.Ok.win_ticket)
      setLastWinnerAmount(response.Ok.win_amount)
      setLastWinnerAddress(response.Ok.winner)
      setWinState(response.Ok.winner == walletAddress)
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() get_info: ', error)
    })
  }, [ client, walletAddress, alert, loading])

  return (
    <WalletLoader loading={loading}>
      <h1 className="text-5xl font-bold">
        Previous Winner
      </h1>

      {lotteryState && (
        <div className="main-content">
          <p className="mt-10 text-primary">
            <h2>{ winState ? `You Won!` : `You Lose!`}</h2>
          </p>
          <p className="mt-10 text-primary">
            <span>{`Winner of last round : ${lastWinnerAddress}  `}</span>
          </p>
          <p className="mt-10 text-primary">
            <span>{`Winner Ticket of last round : ${lastWinner+1}  `}</span>
          </p>
          <p className="mt-10 text-primary">
            <span>{`Winner amount : ${convertMicroDenomToDenom(lastWinnerAmount)} SCRT `}</span>
          </p>
        </div>
      )}
    </WalletLoader>
  )
}

export default Faq
