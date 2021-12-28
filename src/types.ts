import EthClient from './EthClient'

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

export const LOC_LOADING = 0
export const LOC_SUCCESS = 1
export const LOC_FAILED = 2

export type LocStatus =
  typeof LOC_LOADING |
  typeof LOC_SUCCESS |
  typeof LOC_FAILED

export interface CheckInControl {
  locStatus: LocStatus,
  setLocStatus: (status: LocStatus) => void,
  currentLoc: LocationType | null,
  setCurrentLoc: (loc: LocationType) => void,
  checkIns: CheckInType[],
  getMemberCheckIns: () => Promise<void>,
  addCheckIn: (stats: CheckInType) => void,
}

export interface ContextType extends CheckInControl, StatsControl {
  client: EthClient,
}
