import type { NextPage } from 'next'
import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'
import WalletLoader from 'components/WalletLoader'
import { useAlert } from 'react-alert'

const PUBLIC_TOKEN_SALE_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT || ''
const PUBLIC_CODEHASH = process.env.NEXT_PUBLIC_CODEHASH || ''

const Faq: NextPage = () => {
  const { walletAddress, signingClient, client, connectWallet } = useSigningClient()
  const [lastWinner, setLastWinner] = useState(0)
  const [loading, setLoading] = useState(false)
  const alert = useAlert()
  const [lotteryState, setLotteryState] = useState(null)

  useEffect(() => {
    if (!signingClient || !client || walletAddress.length === 0) return

    if (loading)
      return
    client.query.compute.queryContract({
      address: PUBLIC_TOKEN_SALE_CONTRACT,
      // codeHash: PUBLIC_CODEHASH,
      query: { total_state: {} },
    }).then((response) => {
      console.log(response)
      setLotteryState(response.Ok)
      setLastWinner(response.Ok.win_ticket)
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() get_info: ', error)
    })
  }, [signingClient, client, walletAddress, alert, loading])

  return (
    <WalletLoader loading={loading}>
      <h1 className="text-5xl font-bold">
        Previous Winner
      </h1>

      {lotteryState && (
        <div>
          <p className="mt-10 text-primary">
            <span>{`Winner of last round : ${lastWinner}  `}</span>
          </p>
        </div>
      )}
    </WalletLoader>
  )
}

export default Faq
