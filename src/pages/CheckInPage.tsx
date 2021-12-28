import { FC, useEffect, useCallback, useState, PointerEvent } from 'react'
import styled from 'styled-components'
import Avatar from "boring-avatars"
import { TransactionResponse } from '@ethersproject/abstract-provider'

import { resolver } from '../utils/async'
import useClient from '../hooks/use-client'
import useStats from '../hooks/use-stats'
import useCheckIns from '../hooks/use-checkins'
import Map from '../components/Map'
import Stats from '../components/Stats'
import Button from '../components/Button'

import { LocationType, LOC_SUCCESS, LOC_FAILED, LOC_LOADING } from '../types'

const PageContainer = styled.div`
  align-items: stretch;
  display: flex;
  flex: 0 1 100%;
  flex-direction: row;
  width: 100%;

  @media (max-width: 515px) {
    flex-direction: column-reverse;
  }
`

const SideBar = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 240px;
  flex-direction: column;
  margin: 36px 0;
  padding: 12px;

  @media (max-width: 515px) {
    flex: 0 0 auto;
    margin: 0 0 24px;
  }
`

const UIContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  @media (max-width: 515px) {
    flex-direction: row;
  }
`

const AccountContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  margin-bottom: 18px;

  @media (max-width: 515px) {
    flex: 0 1 20%;
    margin-right: 12px;
    margin-bottom: 0;
  }
`

const AvatarContainer = styled.div`
  flex: 0 1 auto;
`

const Account = styled.h3`
  background-color: #585bff;
  border-radius: 32px;
  color: white;
  flex: 0 1 auto;
  font-size: 0.9em;
  margin: 9px 0 0;
  padding: 6px;

  @media (max-width: 515px) {
    margin: 3px 0 0;
    font-size: 0.6em;
  }
`

const Logo = styled.h2`
  color: #585bff;
  font-size: 2em;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 6px;
  text-align: center;

  @media (max-width: 515px) {
    font-size: 1em;
    position: fixed;
    right: 12px;
    top: 12px;
    z-index: 100000;
    transform: translate3d(0px, 0px, 0px);
  }
`

const CheckInBtn = styled(Button)`
  width: 90%;

  @media (max-width: 515px) {
    flex: 0 1 80%;
    width: auto;
  }
`

const LocError = styled.p`
  color: red;
  margin: 0;
  text-align: center;
`

function truncateAccount(account: string): string {
  return account.substring(0, 5) + '...' + account.substring(account.length - 5)
}

const CheckInPage = () => {
  const client = useClient()
  const {
    setLocStatus,
    currentLoc,
    setCurrentLoc,
    addCheckIn,
    getMemberCheckIns
  } = useCheckIns()
  const { getInitialStats, updateStats } = useStats()
  const [error, setError] = useState<string | null>(null)
  const [locError, setLocError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<boolean>(false)
  const [avatarSize, setAvatarSize] = useState<number>(120)

  const checkIn = useCallback(async (event: PointerEvent<HTMLButtonElement>) => {
    if (currentLoc) {
      const [error, txn] = await resolver<TransactionResponse>(client.checkIn(currentLoc))

      if (error || txn === undefined) {
        console.error(error || "txn undefined")
        setError((error && error.message) || "Something went wrong")
      } else {
        setConfirming(true)
        await txn.wait()
        setConfirming(false)

        const [error, totalCount] = await resolver<number>(client.getTotalCount())

        if (error || totalCount === undefined) {
          console.error(error || "Could not fetch totalCount")
        } else {
          updateStats({ totalCount })
        }
      }
    } else {
      setError('Please allow your browser to capture your current location')
    }
  }, [currentLoc])

  const resizeAvatar = useCallback(() => {
    if (window.innerWidth < 516) {
      setAvatarSize(39)
    } else {
      setAvatarSize(120)
    }
  }, [avatarSize])

  const handleGeoLoc = useCallback((pos: GeolocationPosition) => {
    const coords: LocationType = [pos.coords.latitude, pos.coords.longitude]
    console.log(coords)
    setLocStatus(LOC_SUCCESS)
    setCurrentLoc(coords)
  }, [])

  const handleLocError = useCallback((err: GeolocationPositionError) => {
    // TODO: could use the code property to trigger different error UI
    setLocStatus(LOC_FAILED)
    setError(err.message)
  }, [])

  const geoInit = useCallback(() => {
    if (navigator.geolocation) {
      setLocStatus(LOC_LOADING)
      navigator.geolocation.getCurrentPosition(handleGeoLoc, handleLocError)
    } else {
      setLocError('Location data is not supported.')
    }
  }, [])

  useEffect(() => {
    geoInit()
    getInitialStats()
    getMemberCheckIns()
    resizeAvatar()
    window.addEventListener('resize', resizeAvatar)
    return () => {
      window.removeEventListener('resize', resizeAvatar)
    }
  }, [])

  return (
    <PageContainer>
      <SideBar>
        <Logo>💠 FourBlock</Logo>
        <Stats />
        <UIContainer>
          <AccountContainer>
            <AvatarContainer>
              <Avatar
                size={avatarSize}
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#fd58ff", "#C271B4", "#585bff"]}
              />
            </AvatarContainer>
            <Account>{truncateAccount(client.account || '')}</Account>
          </AccountContainer>
          {locError
            ? <LocError>{locError}</LocError>
            : (
              <CheckInBtn disabled={confirming} onClick={checkIn}>
                {confirming ? "Confirming..." : "Check In"}
              </CheckInBtn>
            )
          }
        </UIContainer>
      </SideBar>
      <Map />
    </PageContainer>
  )
}

export default CheckInPage
