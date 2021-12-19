import styled from 'styled-components'

import { GradText } from '../styles/globals'

const Hero = styled.div`
  margin: 0 auto;
  padding-top: 120px;
  width: 600px;

  @media (max-width: 515px) {
    width: 100%;
  }
`

const Header = styled.h1`
  color: #585bff;
  font-size: 6em;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
  text-align: center;

  @media (max-width: 320) {
    font-size: 2em;
  }

  @media (max-width: 515px) {
    font-size: 3em;
  }
`

const Synops = styled.p`
  font-size: 2.4em;
  font-weight: 700;
  margin-top: 18px;
  padding: 12px;
  text-align: center;

  @media (max-width: 320) {
    font-size: 1.8em;
  }

  @media (max-width: 515px) {
    font-size: 2em;
  }
`

const LandingPage = () => {
  return (
    <Hero>
      <Header>
        💠 FourBlock
      </Header>
      <Synops>A decentralized Web3 location check-in app reminiscent of Foursquare.</Synops>
    </Hero>
  )
}

export default LandingPage
