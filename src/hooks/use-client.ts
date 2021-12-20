import { useContext } from 'react'

import EthClient from '../EthClient'
import Context from '../context.js'
import { ContextType } from '../types'

export default (): EthClient => {
  const ctx = useContext<ContextType>(Context)
  return ctx.client
}
