import { useContext, useCallback } from 'react'

import Context from '../context.js'
import { ContextType, CheckInControl } from '../types'

export default (): CheckInControl => {
  const ctx = useContext<ContextType>(Context)

  return {
    locStatus: ctx.locStatus,
    setLocStatus: ctx.setLocStatus,
    currentLoc: ctx.currentLoc,
    setCurrentLoc: ctx.setCurrentLoc,
    checkIns: ctx.checkIns,
    getMemberCheckIns: ctx.getMemberCheckIns,
    addCheckIn: ctx.addCheckIn
  }
}
