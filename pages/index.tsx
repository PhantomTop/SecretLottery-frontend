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
import Emoji from 'components/Emoji'
import { MsgSend } from 'secretjs'

const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'uscrt'
const PUBLIC_TOKEN_SALE_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT || ''
const PUBLIC_CODEHASH = process.env.NEXT_PUBLIC_CODEHASH || ''
const PUBLIC_CW20_CONTRACT = process.env.NEXT_PUBLIC_CW20_CONTRACT || ''

const Home: NextPage = () => {
  const { walletAddress, signingClient, client, connectWallet } = useSigningClient()
  const [balance, setBalance] = useState('')
  const [cw20Balance, setCw20Balance] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '' })
  const [purchaseAmount, setPurchaseAmount] = useState<any>('')
  const [numToken, setNumToken] = useState(0)
  const [price, setPrice] = useState(0)
  const [showNumToken, setShowNumToken] = useState(false)
  const alert = useAlert()

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

    client.query.compute.queryContract({
      address: PUBLIC_TOKEN_SALE_CONTRACT, 
      // codeHash: PUBLIC_CODEHASH,
      query: {total_state: {}},
    }).then((response) => {
      console.log(response)
      
    }).catch((error) => {
      alert.error(`Error! ${error.message}`)
      console.log('Error signingClient.queryContractSmart() get_info: ', error)
    })

    // // Gets cw20 balance
    // signingClient.queryContractSmart(PUBLIC_CW20_CONTRACT, {
    //   balance: { address: walletAddress },
    // }).then((response) => {
    //   setCw20Balance(response.balance)
    // }).catch((error) => {
    //   alert.error(`Error! ${error.message}`)
    //   console.log('Error signingClient.queryContractSmart() balance: ', error)
    // })
  }, [signingClient, client, walletAddress, loadedAt, alert])

  // useEffect(() => {
  //   if (!signingClient) return

  //   // Gets token information
  //   signingClient.queryContractSmart(PUBLIC_CW20_CONTRACT, {
  //     token_info: {},
  //   }).then((response) => {
  //     setTokenInfo(response)
  //   }).catch((error) => {
  //     alert.error(`Error! ${error.message}`)
  //     console.log('Error signingClient.queryContractSmart() token_info: ', error)
  //   })
  // }, [signingClient, alert])

  /**
   * Calculates and sets the number of tokens given the purchase amount divided by the price
   */
  //  useEffect(() => {
  //   if (!signingClient) return

  //   signingClient.queryContractSmart(PUBLIC_TOKEN_SALE_CONTRACT, {
  //     get_info: {},
  //   }).then((response) => {
  //     const price  = convertMicroDenomToDenom(response.price.amount)
  //     console.log("price : " + price) // i.e. 1 POOD token = 1000 uJUNO (micro)
  //     setPrice(price)
  //     setNumToken(purchaseAmount/price)
  //   }).catch((error) => {
  //     alert.error(`Error! ${error.message}`)
  //     console.log('Error signingClient.queryContractSmart() get_info: ', error)
  //   })

  //   setShowNumToken(!!purchaseAmount)
  // }, [purchaseAmount, signingClient, alert])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    setPurchaseAmount(value)
  }

  // const handlePurchase = (event: MouseEvent<HTMLElement>) => {
  //   if (!signingClient || walletAddress.length === 0) return
  //   if (!purchaseAmount) {
  //     alert.error('Please enter the amount you would like to purchase')
  //     return
  //   }
  //   if (purchaseAmount > walletAmount) {
  //     alert.error(`You do not have enough tokens to make this purchase, maximum you can spend is ${walletAmount}`)
  //     return
  //   }

  //   event.preventDefault()
  //   setLoading(true)
  //   const defaultFee = {
  //     amount: [],
  //     gas: "400000",
  //   };


  //   signingClient?.execute(
  //     walletAddress, // sender address
  //     PUBLIC_TOKEN_SALE_CONTRACT, // token sale contract
  //     { "buy": {
  //       "denom": "ujunox",
  //       "price": "100"
  //     } }, // msg
  //     defaultFee,
  //     undefined,
  //     [coin(parseInt(convertDenomToMicroDenom(purchaseAmount), 10), 'ujunox')]
  //   ).then((response) => {
  //     setPurchaseAmount('')
  //     setLoadedAt(new Date())
  //     setLoading(false)
  //     alert.success('Successfully purchased!')
  //   }).catch((error) => {
  //     setLoading(false)
  //     alert.error(`Error! ${error.message}`)
  //     console.log('Error signingClient?.execute(): ', error)
  //   })
  // }

  const handlePurchase = (event: MouseEvent<HTMLElement>) => {
    if (!signingClient || !client || walletAddress.length === 0) return
    // if (!purchaseAmount) {
    //   alert.error('Please enter the amount you would like to purchase')
    //   return
    // }
    // if (purchaseAmount > walletAmount) {
    //   alert.error(`You do not have enough tokens to make this purchase, maximum you can spend is ${walletAmount}`)
    //   return
    // }

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


    client.tx.compute.executeContract({
      sender: walletAddress,
      contract: PUBLIC_TOKEN_SALE_CONTRACT, 
      codeHash: PUBLIC_CODEHASH,
      msg: {
        new_round: {}
      },
      //sentFunds: [coin(parseInt(convertDenomToMicroDenom(purchaseAmount), 10), "uscrt")]
      sentFunds: []
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

    
    // client?.execute(
    //   walletAddress, // sender address
    //   PUBLIC_TOKEN_SALE_CONTRACT, // token sale contract
    //   { "buy": {
    //     "denom": "ujunox",
    //     "price": "100"
    //   } }, // msg
    //   defaultFee,
    //   undefined,
    //   [coin(parseInt(convertDenomToMicroDenom(purchaseAmount), 10), 'ujunox')]
    // ).then((response) => {
    //   setPurchaseAmount('')
    //   setLoadedAt(new Date())
    //   setLoading(false)
    //   alert.success('Successfully purchased!')
    // }).catch((error) => {
    //   setLoading(false)
    //   alert.error(`Error! ${error.message}`)
    //   console.log('Error signingClient?.execute(): ', error)
    // })
  }
  return (
    <WalletLoader loading={loading}>
      {balance && (
        <p className="text-primary">
          <span>{`Your wallet has ${balance} `}</span>
          <Emoji label="dog2" symbol="🐕" />
        </p>
      )}

      {cw20Balance && (
        <p className="mt-2 text-primary">
          <span>{`and ${cw20Balance} ${tokenInfo.symbol} `}</span>
          <Emoji label="poodle" symbol="🐩" />
        </p>
      )}

      <h1 className="mt-10 text-5xl font-bold">
        Buy
      </h1>
      <h1 className="mt-4 mb-10 text-5xl font-bold">
        <Emoji label="dog" symbol="🐶" />
        <span>{` ${tokenInfo.name} `}</span>
        <Emoji label="dog" symbol="🐶" />
      </h1>

      <div className="form-control">
        <div className="relative">
          <input
            type="number"
            id="purchase-amount"
            placeholder="Amount"
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
            purchase
          </button>
        </div>
      </div>

      {showNumToken && (
        <div className="mt-8">
          You are getting
          <h1 className="text-3xl mt-3 text-primary">
            <span>{`${numToken} ${tokenInfo.symbol} `}</span>
            <Emoji label="poodle" symbol="🐩" />
          </h1>
        </div>
      )}
    </WalletLoader>
  )
}

export default Home
