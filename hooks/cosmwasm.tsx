import { useState } from 'react'
import { connectKeplr } from 'services/keplr'
import { SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { SecretNetworkClient } from "secretjs"

export interface ISigningCosmWasmClientContext {
  walletAddress: string
  client: SecretNetworkClient | null
  signingClient: SigningCosmWasmClient | null
  loading: boolean
  error: any
  connectWallet: any
  disconnect: Function
}

const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [client, setClient] = useState<SecretNetworkClient | null>(null)
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
      const offlineSigner = await (window as any).getOfflineSignerOnlyAmino(
        PUBLIC_CHAIN_ID
      )
      // get user address
      const [{ address }] = await offlineSigner.getAccounts()
      setWalletAddress(address)

      // make client
      // setClient(
      //   await SecretNetworkClient.create({
      //     rpcUrl: PUBLIC_RPC_ENDPOINT,
      //     wallet: offlineSigner,
      //     walletAddress: address,
      //     chainId: PUBLIC_CHAIN_ID,
      //     encryptionUtils: (window as any).getEnigmaUtils(PUBLIC_CHAIN_ID)
      //   })
      //   // await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      // )

      setClient( 
        await SecretNetworkClient.create({
          grpcWebUrl: "https://grpc-web.azure-api.net",
          wallet: offlineSigner,
          walletAddress: address,
          chainId: PUBLIC_CHAIN_ID,
          // encryptionUtils: (window as any).getEnigmaUtils(PUBLIC_CHAIN_ID)
        })
      )

      
      
      // make client
      // setSigningClient(
      //   await SigningCosmWasmClient.connectWithSigner(
      //     PUBLIC_RPC_ENDPOINT,
      //     offlineSigner
      //   )
      // )

      setLoading(false)
    } catch (error:any) {
      setError(error)
    }
  }

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect()
    }
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
