import 'regenerator-runtime'

import ReactDOM from 'react-dom'

import ClientProvider from './components/ClientProvider'
import App from './App'

import { abi } from './abi/FourBlock.json'

const contractAddress = 'replaceContractAddress'

const AppWithProviders = () => {
  return (
    <ClientProvider abi={abi} contractAddress={contractAddress}>
      <App />
    </ClientProvider>
  )
}

ReactDOM.render(<AppWithProviders />, document.querySelector('#app'))
