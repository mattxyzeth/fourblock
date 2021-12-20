import { FC, useCallback, useEffect, useState } from 'react'

import Context from '../context'
import { resolver } from '../utils/async'

import { StatsType, ContextType } from '../types'

export interface ClientProviderProps {
  client: any,
}

const ClientProvider: FC<ClientProviderProps> = ({ children, client }) => {
  const [stats, setStats] = useState<StatsType>({ totalCount: client.totalCount })

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
    updateStats
  }

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

export default ClientProvider
