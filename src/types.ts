import EthClient from './EthClient'

export interface Window {
  ethereum: any;
}

export interface StatsType {
  totalCount: number
}

export interface StatsControl extends StatsType {
  updateStats: (stats: Partial<StatsType>) => any,
  getInitialStats: () => void
}

export interface CheckInType {
  lat: number,
  lon: number,
  time: number
}

export interface ContextType {
  client: EthClient,
  stats: StatsType,
  checkIns: CheckInType[],
  updateStats: (stats: Partial<StatsType>) => any,
  getInitialStats: () => void,
  addCheckIn: (stats: CheckInType) => any,
}
