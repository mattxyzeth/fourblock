import { FC, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import useStats from '../hooks/use-stats'

export interface StatsProps {
  className?: string
}

const Stats: FC<StatsProps> = ({ className }) => {
  const { totalCount } = useStats()

  return (
    <p className={className}>
      {totalCount} check-in's and counting!
    </p>
  )
}

export default styled(Stats)`
  text-align: center;
  font-size: 0.8em;
  margin: 0 0 32px;

  @media (max-width: 515px) {
    margin: 0 0 12px;
  }
`
