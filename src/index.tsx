import ReactDOM from 'react-dom'

import ContextProvider from './components/ContextProvider'
import App from './App'

import EthClient from './EthClient'

import { abi } from './abi/FourBlock.json'

const contractAddress = 'replaceContractAddress'

const AppWithProviders = () => {
  const client = new EthClient({
    contractAddress,
    abi
  })

  return (
    <ContextProvider client={client}>
      <App />
    </ContextProvider>
  )
}

ReactDOM.render(<AppWithProviders />, document.querySelector('#app'))
