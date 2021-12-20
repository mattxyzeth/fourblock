import EthClient from './EthClient'

export interface Window {
  ethereum: any;
}

export interface StatsType {
  totalCount: number
}

export interface StatsControl extends StatsType {
  updateStats: (stats: Partial<StatsType>) => any
}

export interface ContextType {
  client: EthClient,
  stats: StatsType,
  updateStats: (stats: Partial<StatsType>) => any
}
