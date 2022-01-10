import { useContext } from 'react'

import Context from '../context.js'
import { ContextType } from '../types'

export default (): ContextType => {
  return useContext<ContextType>(Context)
}
