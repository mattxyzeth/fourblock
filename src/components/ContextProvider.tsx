import { FC, useCallback, useEffect, useState } from 'react'

import Context from '../context'
import { resolver } from '../utils/async'

import { CheckInType, StatsType, ContextType } from '../types'

export interface ClientProviderProps {
  client: any,
}

const ContextProvider: FC<ClientProviderProps> = async ({ children, client }) => {
  const [stats, setStats] = useState<StatsType>({ totalCount: client.totalCount })
  const [checkIns, setCheckIns] = useState<[CheckInType?]>([])

  const addCheckIn = useCallback((checkIn: CheckInType) => {
    setCheckIns([...checkIns, checkIn])
  }, [checkIns])

  const updateStats = useCallback((newStats: Partial<StatsType>) => {
    setStats({ ...stats, ...newStats })
  }, [stats])

  const getInitialStats = useCallback(async () => {
    const [error, totalCount] = await resolver<number>(client.getTotalCount())

    if (error) {
      console.error(error)
    } else {
      updateStats({ totalCount })
    }
  }, [])

  useEffect(() => {
    getInitialStats()
  }, [])

  const ctx: ContextType = {
    client,
    stats,
    updateStats,
    checkIns,
    addCheckIn
  }

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

export default ContextProvider
