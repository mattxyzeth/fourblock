import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import LandingPage from './pages/LandingPage'
import CheckInPage from './pages/CheckInPage'
import Footer from './components/Footer'
import Button from './components/Button'

import useClient from './hooks/use-client'
import { resolver } from './utils/async'

import './styles/base.scss'


const Alert = styled.h2`
  background-color: pink;
  border: 1px solid red;
  border-radius: 9px;
  color: red;
  flex: 0 1 auto;
  font-size: 0.9em;
  letter-spacing: 1.2px;
  margin: 12px;
  padding: 12px;
  text-align: center;
`

const App = () => {
  const client = useClient()
  const [hasAccount, setHasAccount] = useState<boolean>(Boolean(client.account))
  const [accountError, setAccountError] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)

  const walletConnect = useCallback(async () => {
    const [error] = await resolver(client.walletConnect())

    if (error) {
      console.error(error.message)
      setAccountError("There was an issue connecting your wallet.")
    } else {
      setHasAccount(true)
    }
  }, [])

  const checkConnected = useCallback(async () => {
    if (!hasAccount) {
      const [error, connected] = await resolver<boolean>(client.checkConnected())

      if (error) {
        console.error(error)
        setWalletError(error.message)
      } else {
        setHasAccount(Boolean(connected))
      }
    }
  }, [hasAccount])

  useEffect(() => {
    checkConnected()
  }, [])

  return (
    <>
      {!hasAccount && <>
          <LandingPage />
          {walletError
            ? <>
              <Alert>{walletError}</Alert>
              <p>Please install MetaMask</p>
            </>
            : <Button onClick={walletConnect}>Connect Wallet</Button>
          }
        </>
      }
      {hasAccount && <CheckInPage />}
      <Footer />
    </>
  )
}

export default App
