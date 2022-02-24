import { useState } from 'react'
import { connectKeplr } from 'services/keplr'
import { SigningCosmWasmClient, CosmWasmClient } from 'secretjs'
// import { SecretNetworkClient } from "secretjs"

export interface ISigningCosmWasmClientContext {
  walletAddress: string
  client: CosmWasmClient | null
  signingClient: SigningCosmWasmClient | null
  loading: boolean
  error: any
  connectWallet: any
  disconnect: Function
}

const PUBLIC_REST_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_REST_ENDPOINT || ''
const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [client, setClient] = useState<CosmWasmClient | null>(null)
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const connectWallet = async () => {
    setLoading(true)

    try {
      await connectKeplr()

      // enable website to access kepler
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

      // get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSigner(
        PUBLIC_CHAIN_ID
      )
      
      const enigmaUtils = (window as any).getEnigmaUtils(PUBLIC_CHAIN_ID)

      // get user address
      const [{ address }] = await offlineSigner.getAccounts()
      setWalletAddress(address)
      console.log(address)
      // make client
      setClient(
        new CosmWasmClient(PUBLIC_REST_ENDPOINT)
        // await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      )

      
      // make client
      setSigningClient(
        new SigningCosmWasmClient(
          PUBLIC_REST_ENDPOINT,
          address,
          offlineSigner,
          enigmaUtils,
          {
            // 300k - Max gas units we're willing to use for init
            init: {
              amount: [{ amount: "300000", denom: "uscrt" }],
              gas: "300000",
            },
            // 300k - Max gas units we're willing to use for exec
            exec: {
              amount: [{ amount: "300000", denom: "uscrt" }],
              gas: "300000",
            },
          }
        )
      )

      setLoading(false)
    } catch (error:any) {
      setError(error)
    }
  }

  const disconnect = () => {
    // if (signingClient) {
    //   signingClient.disconnect()
    // }
    setWalletAddress('')
    setSigningClient(null)
    setLoading(false)
  }

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
    client
  }
}
