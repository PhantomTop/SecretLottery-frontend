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
import moment from 'moment'

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
  const [histories, setHistories] = useState([{end_time:Number, ticket:Number, address:String, amount:Number}])

  useEffect(() => {
    if (!client || walletAddress.length === 0) return

    if (loading)
      return
    client.query.compute.queryContract({
      address: PUBLIC_TOKEN_SALE_CONTRACT,
      codeHash: PUBLIC_CODEHASH,
      query: { "histories": {} },
    }).then((response) => {
      console.log(response)
      
      let temp = response.Ok.histories
      // for (let i = 0; i < 100; i ++)
      //   temp.push(response.Ok.histories[0])
      setHistories(temp)
      setWinState(response.Ok.winner == walletAddress)
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() get_info: ', error)
    })
  }, [ client, walletAddress, alert, loading])

  return (
    <WalletLoader loading={loading} >
      <h1 className="text-5xl font-bold">
        Previous Winner
      </h1>
      <div style={{
        width: "1000px",
        height:"500px",
        overflowY:"auto"
      }}>
      {histories?.map((data)=> (
        
        <div className="main-content" key={Number(data.end_time)}>
          <p className="mt-10 text-primary">
            {/* <h2>{ data.address.toString() == walletAddress ? `You Won!` : `You Lose!`}</h2> */}
            <span>{moment(Number(data.end_time) * 1000).format('MM/DD/yyyy')}</span><br/>
            <span>{`Winning Ticket: #${Number(data.ticket) + 1}, ${data.address.toString()}  `}</span><br/>
            <span>{`Prize : ${convertMicroDenomToDenom(Number(data.amount))} SCRT `}</span>
          </p>
          
        </div>
      ))}
      </div>
    </WalletLoader>
  )
}

export default Faq
