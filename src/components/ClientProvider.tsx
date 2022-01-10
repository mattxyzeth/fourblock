import { FC, useCallback, useEffect, useState } from 'react'
import { ThirdwebProvider } from '@3rdweb/react'
import { ThirdwebWeb3Provider, useWeb3, ConnectorOptions } from "@3rdweb/hooks"
import { BigNumber, Contract, ContractInterface, Signer } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'

import Context from '../context'
import { resolver } from '../utils/async'

import {
  CheckInType,
  ContractCheckIn,
  StatsType,
  ContextType,
  LocationType,
  WalletType,
  LocStatus,
  LOC_LOADING,
  LOC_SUCCESS,
  LOC_FAILED
} from '../types'

export interface ClientProviderProps {
  contractAddress: string,
  abi: ContractInterface,
}

const ClientProvider: FC<ClientProviderProps> = ({
  abi,
  children,
  contractAddress,
}) => {
  const { address, balance, connectWallet, disconnectWallet, provider } = useWeb3()
  const [stats, setStats] = useState<StatsType>({ totalCount: 0 })
  const [checkIns, setCheckIns] = useState<CheckInType[]>([] as CheckInType[])
  const [currentLoc, setCurrentLoc] = useState<LocationType | null>(null)
  const [locStatus, setLocStatus] = useState<LocStatus>(LOC_LOADING)
  const [contract, setContract] = useState<Contract | null>(null)
  const [wallet, setWallet] = useState<WalletType | undefined>(undefined)
  const [signer, setSigner] = useState<Signer | null>(null)

  const checkIn = useCallback(async (loc: LocationType) => {
    if (address && contract) {
      const coords = loc.map(coord => String(coord))
      const [error, txn] = await resolver<TransactionResponse>(contract.checkIn(...coords))

      if (error || txn === undefined) {
        console.error(error || "TXN undefined")
      } else {
        await txn.wait()
      }
    }
  }, [address, contract])

  const updateStats = useCallback((newStats: Partial<StatsType>) => {
    setStats({ ...stats, ...newStats })
  }, [stats])

  const getInitialStats = useCallback(async () => {
    if (contract) {
      const [error, totalCount] = await resolver<BigNumber>(contract.getTotalCheckIns())

      if (error || !totalCount) {
        console.error(error || "Total count was undefined")
      } else {
        updateStats({ totalCount: totalCount.toNumber() })
      }
    } else {
      console.log('contract does not exist')
    }
  }, [contract])

  const getMemberCheckIns = useCallback(async () => {
    if (contract) {
      const [error, contractCheckIns] = await resolver<ContractCheckIn[]>(contract.getCheckIns())

      if (error || contractCheckIns === undefined) {
        console.error(error || "Check-in's were undefined")
      } else {
        const newCheckIns = contractCheckIns.map((ci: ContractCheckIn) => {
          const coords: LocationType = [
            parseFloat(ci.lat),
            parseFloat(ci.lon)
          ]

          return {
            coords,
            time: ci.timestamp.toNumber()
          }
        })

        if (newCheckIns.length > 0) {
          setCheckIns([ ...checkIns, ...newCheckIns ])
        }
      }
    } else {
      console.log('contract does not exist')
    }
  }, [checkIns, contract])

  const connect = useCallback((conType: keyof ConnectorOptions) => {
    if (!address) {
      connectWallet(conType)
    }
  }, [address])

  const disconnect = useCallback(() => {
    if (address) {
      disconnectWallet()
    }
  }, [address])

  const handleNewCheckIn = useCallback((
    addr: BigNumber,
    timestamp: BigNumber,
    lat: string,
    lon: string
  ) => {
    updateStats({ totalCount: stats.totalCount+1 })

    if (address && BigNumber.from(addr).eq(address)) {
      const coords: LocationType = [
        parseFloat(lat),
        parseFloat(lon)
      ]

      const checkIn: CheckInType = {
        coords,
        time: timestamp.toNumber()
      }

      setCheckIns([ ...checkIns, checkIn ])
    }
  }, [address, checkIns, stats])

  useEffect(() => {
    if (signer) {
      const contract = new Contract(contractAddress, abi, signer)
      contract.on('NewCheckIn', handleNewCheckIn)

      setContract(contract)
    }
  }, [contractAddress, abi, signer])

  useEffect(() => {
    if (address && balance && provider) {
      setWallet({ address, balance })
      setSigner(provider.getSigner())
    } else {
      setWallet(undefined)
      setSigner(null)
    }
  }, [address, balance, provider])

  const ctx: ContextType = {
    locStatus,
    setLocStatus,
    currentLoc,
    setCurrentLoc,
    checkIns,
    getMemberCheckIns,
    checkIn,
    stats,
    updateStats,
    getInitialStats,
    connect,
    disconnect,
    wallet
  }

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

const ThirdWebWrapper: FC<ClientProviderProps> = ({ abi, contractAddress, children }) => {
  const supportedChainIds = [1, 4]
  const connectors = {
    injected: {},
    walletconnect: {
      infuraId: 'replaceInfuraId',
      supportedChainIds
    }
  }

  return (
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <ClientProvider abi={abi} contractAddress={contractAddress}>
        {children}
      </ClientProvider>
    </ThirdwebWeb3Provider>
  )
}

export default ThirdWebWrapper
