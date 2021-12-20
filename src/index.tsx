import ReactDOM from 'react-dom'

import ClientProvider from './components/ClientProvider'
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
    <ClientProvider client={client}>
      <App />
    </ClientProvider>
  )
}

ReactDOM.render(<AppWithProviders />, document.querySelector('#app'))
