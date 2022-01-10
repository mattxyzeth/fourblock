import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import LandingPage from './pages/LandingPage'
import CheckInPage from './pages/CheckInPage'
import Footer from './components/Footer'
import Button from './components/Button'

import useClient from './hooks/use-client'
import { resolver } from './utils/async'

import { Window } from './types'

import './styles/base.scss'

const win: Window = window

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
  const { connect, wallet } = useClient()
  const [injected, setInjected] = useState<boolean>(false)

  useEffect(() => {
    console.log(win.ethereum)
    if (win.ethereum) {
      setInjected(true)
    } else {
      setInjected(false)
    }
  }, [])

  return (
    <>
      {!wallet && <>
          <LandingPage />
          {injected && <Button onClick={() => connect('injected')}>Connect MetaMask</Button>}
          <Button onClick={() => connect('walletconnect')}>Connect WalletConnect</Button>
        </>
      }
      {wallet && <CheckInPage />}
      <Footer />
    </>
  )
}

export default App
