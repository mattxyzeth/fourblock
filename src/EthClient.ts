import { ethers, ContractInterface, Contract, Signer, BigNumber } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { TransactionResponse } from '@ethersproject/abstract-provider'

import { resolver } from './utils/async'
import { Window, LocationType } from './types'

declare let window: Window

interface Props {
  contractAddress: string,
  abi: ContractInterface,
}

class EthClient {
  public account: string | null;
  public hasWallet: boolean

  private provider: JsonRpcProvider | null
  private signer: Signer | null
  private contract: Contract | null
  private contractAddress: string
  private abi: ContractInterface

  constructor(props: Props) {
    this.account = null
    this.contractAddress = props.contractAddress
    this.abi = props.abi

    if (window.ethereum) {
      this.hasWallet = true
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.provider.getSigner()
      this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer)
    } else {
      this.hasWallet = false
      this.provider = null
      this.signer = null
      this.contract = null
    }
  }

  public async walletConnect(): Promise<void> {
    if (this.hasWallet) {
      const { ethereum } = window
      const [error, accounts] = await resolver<[string]>(ethereum.request({ method: 'eth_requestAccounts' }))

      if (error) {
        throw error
      }

      if (accounts !== undefined) {
        this.account = accounts[0]
      }
    }
  }

  public async checkConnected(): Promise<boolean> {
    if (!this.hasWallet) {
      throw new Error("No wallet detected")
    }

    const { ethereum } = window
    const [error, accounts] = await resolver<[any]>(ethereum.request({ method: 'eth_accounts' }))

    if (!error && accounts !== undefined && accounts.length > 0) {
      console.log('connected')
      this.account = accounts[0]
      return true
    } else if (error !== undefined) {
      console.error(error)
    }

    return false
  }

  public async checkIn(loc: LocationType): Promise<TransactionResponse> {
    if (!this.hasWallet || !this.contract) {
      throw new Error("Please connect your wallet")
    }

    const coords = loc.map(coord => String(coord))

    const [error, txn] = await resolver<TransactionResponse>(this.contract.checkIn(...coords))

    if (error || txn === undefined) {
      throw error || "Transaction not returned"
    }

    return txn
  }

  public async getTotalCount(): Promise<number> {
    if (!this.hasWallet || !this.contract) {
      throw new Error("Please connect your wallet")
    }

    console.log('fetching totalCount')

    const [error, count] = await resolver<BigNumber>(this.contract.getTotalCheckIns())

    if (error) {
      throw error
    } else if (count === undefined) {
      throw new Error("No response received.")
    }

    return count.toNumber()
  }
}

export default EthClient
