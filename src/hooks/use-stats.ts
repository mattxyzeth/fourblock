import { useContext } from 'react'

import Context from '../context.js'
import { ContextType, StatsControl } from '../types'

export default (): StatsControl  => {
  const ctx = useContext<ContextType>(Context)

  return {
    ...ctx.stats,
    updateStats: ctx.updateStats,
    getInitialStats: ctx.getInitialStats
  }
}
