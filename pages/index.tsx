import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react'
import {
  convertMicroDenomToDenom,
  convertDenomToMicroDenom,
  convertFromMicroDenom
} from 'util/conversion'
import { coin } from '@cosmjs/launchpad'
import { useAlert } from 'react-alert'
import { MsgSend } from 'secretjs'
import moment from 'moment'

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'uscrt'
const PUBLIC_TOKEN_SALE_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT || ''
const PUBLIC_CODEHASH = process.env.NEXT_PUBLIC_CODEHASH || ''
const PUBLIC_CW20_CONTRACT = process.env.NEXT_PUBLIC_CW20_CONTRACT || ''
const PUBLIC_REFRESH_TIME = process.env.REVRESH_INTERVAL || 60

const Home: NextPage = () => {
  const { walletAddress, signingClient, client, connectWallet } = useSigningClient()
  const [balance, setBalance] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState<any>('')
  const [lotteryState, setLotteryState] = useState(null)
  const [ticketCount, setTicketCount] = useState(0)
  const [lastWinner, setLastWinner] = useState(0)
  const [myticketCount, setMyTicketCount] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(new Date())
  const [endTime, setEndTime] = useState<Date | null>(new Date())
  const [refreshTime, setRefreshTime] = useState(PUBLIC_REFRESH_TIME)
  const alert = useAlert()

  useEffect(() => {
    let interval: number | NodeJS.Timer = 0;
    if (refreshTime > 0) {
      interval = setInterval(() => {
        setRefreshTime(refreshTime => Number(refreshTime) - 1);
      }, 10000);
    } else {
      clearInterval(interval);
      setRefreshTime(PUBLIC_REFRESH_TIME);
    }

    return () => clearInterval(Number(interval));
  }, [refreshTime]);

  useEffect(() => {
    if (!signingClient || !client || walletAddress.length === 0) return

    // Gets native balance (i.e. Juno balance)
    signingClient.getBalance(walletAddress, PUBLIC_STAKING_DENOM).then((response: any) => {
      const { amount, denom }: { amount: number; denom: string } = response
      setBalance(`${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`)
      setWalletAmount(convertMicroDenomToDenom(amount))
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.getBalance(): ', error)
    })

    if (loading)
      return
    client.query.compute.queryContract({
      address: PUBLIC_TOKEN_SALE_CONTRACT,
      // codeHash: PUBLIC_CODEHASH,
      query: { total_state: {} },
    }).then((response) => {
      console.log(response)
      setLotteryState(response.Ok)
      setTicketCount(response.Ok.tickets.length * 0.8)
      setLastWinner(response.Ok.win_ticket)
      setStartTime(new Date(response.Ok.start_time * 1000))
      setEndTime(new Date((response.Ok.start_time + 604800) * 1000))


    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() get_info: ', error)
    })

    client.query.compute.queryContract({
      address: PUBLIC_TOKEN_SALE_CONTRACT,
      // codeHash: PUBLIC_CODEHASH,
      query: { tickets_of: { owner: walletAddress } },
    }).then((response) => {
      console.log(response)
      let res = response.Ok
      if (res) {
        const tickets = res.split(',')
        let handsome = ''
        let len = tickets.length
        let i = 0, flag = false
        while(i < len) {
          if (i < len - 1 && tickets[i] == tickets[i + 1] - 1 ) {
            if (flag) {
              i ++;
              continue;
            }

            handsome += tickets[i] + '-';
            flag = true;
            i ++;
            continue;
          }

          if (flag)
            flag = false;

          if (i == len - 1) {
            handsome += tickets[i];  
          } else {
            handsome += tickets[i] + ','
          }
          i ++;
        }
        setMyTicketCount(handsome)
      }
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() get_info: ', error)
    })

  }, [signingClient, client, walletAddress, loadedAt, alert, loading, refreshTime])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    setPurchaseAmount(value)
  }

  const handlePurchase = (event: MouseEvent<HTMLElement>) => {
    if (!signingClient || !client || walletAddress.length === 0) return

    event.preventDefault()
    setLoading(true)

    // const msg = new MsgSend({
    //   fromAddress: walletAddress,
    //   toAddress: bob,
    //   amount: [{ denom: "uscrt", amount: "1" }],
    // });

    // const tx = await secretjs.tx.broadcast([msg], {
    //   gasLimit: 20_000,
    //   gasPriceInFeeDenom: 0.25,
    //   feeDenom: "uscrt",
    // });


    // const sSCRT = "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek";
    // // Get codeHash using `secretcli q compute contract-hash secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek`
    // const sScrtCodeHash =
    //   "af74387e276be8874f07bec3a87023ee49b0e7ebe08178c49d0a49c3c98ed60e";

    // client.query.compute.queryContract({
    //   address: sSCRT,
    //   codeHash: sScrtCodeHash, // optional but way faster
    //   query: { token_info: {} },
    // }).then((response)=> {
    //   console.log(response)
    // }).catch((error)=> {
    //   console.log(error)
    // })
    console.log(purchaseAmount)

    client.tx.compute.executeContract({
      sender: walletAddress,
      contract: PUBLIC_TOKEN_SALE_CONTRACT,
      codeHash: PUBLIC_CODEHASH,
      msg: {
        "buy_ticket": { "ticket_amount": parseInt(purchaseAmount) }
      },
      sentFunds: [coin(parseInt(convertDenomToMicroDenom(purchaseAmount), 10), "uscrt")]
      // sentFunds: []
    },
      {
        gasLimit: 100_000
      }).then((response) => {
        setLoading(false)
        console.log(response)

      }).catch((error) => {
        setLoading(false)
        alert.error(`Error! ${error.message}`)
        console.log('Error signingClient.queryContractSmart() get_info: ', error)
      })
  }
  return (
    <WalletLoader loading={loading}>
      <div className="flex flex-col items-center justify-center">
        {balance && (
          <p className="text-primary main-content">
            <span>{`Your wallet has ${balance} `}</span>
          </p>
        )}

        {lotteryState && (
          <div className="main-content">
            <p className="mt-2 text-primary">
              {/* <span>{`sold ticket count : ${ticketCount}  `}</span> */}
              <span>{`Current Prize : ${ticketCount} SCRT `}</span>
            </p>
            <p className="mt-2 text-primary">
              <span>{`My tickets : ${myticketCount}  `}</span>
            </p>
            <p className="mt-2 text-primary">
              <span>{`Start Time : `}{moment(startTime).format('MM/DD/yyyy hh:mm:SS')}</span>
            </p>
            <p className="mt-2 text-primary">
              <span>{`End Time : `}{moment(endTime).format('MM/DD/yyyy hh:mm:SS')}</span>
            </p>
          </div>
        )}

        <div className="flex flex-row" style={{ alignItems: "baseline" }}>
          <h1 className="mt-10 text-5xl font-bold">
            Buy
          </h1>
          <h1 className="mt-10 font-bold" style={{fontSize: '30px'}}>
          &nbsp;&nbsp;(1 $SCRT Each)
          </h1>
        </div>

        <div className="form-control mt-10">
          <div className="relative">
            <input
              type="number"
              id="purchase-amount"
              placeholder="Number of tickets"
              step="0.1"
              className="w-full input input-lg input-primary input-bordered font-mono"
              onChange={handleChange}
              value={purchaseAmount}
              style={{ paddingRight: '10rem' }}
            />
            <button
              className="absolute top-0 right-0 rounded-l-none btn btn-lg btn-primary"
              onClick={handlePurchase}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </WalletLoader>
  )
}

export default Home
