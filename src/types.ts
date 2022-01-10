import { BigNumber } from 'ethers'
import { ConnectorOptions } from "@3rdweb/hooks"

export const LOC_LOADING = 0
export const LOC_SUCCESS = 1
export const LOC_FAILED = 2

export type LocStatus =
  typeof LOC_LOADING |
  typeof LOC_SUCCESS |
  typeof LOC_FAILED

export interface Window {
  ethereum: any;
}

export interface StatsType {
  totalCount: number
}

export interface StatsControl {
  stats: StatsType,
  updateStats: (stats: Partial<StatsType>) => any,
  getInitialStats: () => void
}

export type LocationType = [number, number]

export interface CheckInType {
  coords: LocationType,
  time: number
}

export interface CheckInControl {
  locStatus: LocStatus,
  setLocStatus: (status: LocStatus) => void,
  currentLoc: LocationType | null,
  setCurrentLoc: (loc: LocationType) => void,
  checkIns: CheckInType[],
  getMemberCheckIns: () => Promise<void>,
  checkIn: (loc: LocationType) => void,
}

interface Balance {
  value?: BigNumber;
  formatted: string;
}

export interface WalletType {
  address: string,
  balance: Balance
}

export interface WalletControl {
  connect: (conType: keyof ConnectorOptions) => void,
  disconnect: () => void,
  wallet?: WalletType
}

export interface ContextType extends CheckInControl, StatsControl, WalletControl {}

export interface ContractCheckIn {
  lat: string,
  lon: string,
  timestamp: BigNumber
}
