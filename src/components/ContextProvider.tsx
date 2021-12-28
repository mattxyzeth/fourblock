import { FC, useCallback, useEffect, useState } from 'react'

import Context from '../context'
import { resolver } from '../utils/async'

import {
  CheckInType,
  StatsType,
  ContextType,
  LocationType,
  LocStatus,
  LOC_LOADING,
  LOC_SUCCESS,
  LOC_FAILED
} from '../types'

export interface ContextProviderProps {
  client: any,
}

const ContextProvider: FC<ContextProviderProps> = ({ children, client }) => {
  const [stats, setStats] = useState<StatsType>({ totalCount: client.totalCount })
  const [checkIns, setCheckIns] = useState<CheckInType[]>([] as CheckInType[])
  const [currentLoc, setCurrentLoc] = useState<LocationType | null>(null)
  const [locStatus, setLocStatus] = useState<LocStatus>(LOC_LOADING)

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

  const ctx: ContextType = {
    client,
    locStatus,
    setLocStatus,
    currentLoc,
    setCurrentLoc,
    checkIns,
    addCheckIn,
    stats,
    updateStats,
    getInitialStats,
  }

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

export default ContextProvider
