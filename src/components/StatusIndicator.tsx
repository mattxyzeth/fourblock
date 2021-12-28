import styled from 'styled-components'

import useCheckIns from '../hooks/use-checkins'

import { LOC_LOADING, LOC_FAILED } from '../types'

const Wrapper = styled.div`
  top: 50vh;
  left: 50%;
  height: 58px;
  width: 58px;
  position: absolute;
  transform: translate3d(-50%, -50%, 0px);
  z-index: 1000;
`

const Spinner = () => {
  const { locStatus } = useCheckIns()

  return (
    <Wrapper>
      {locStatus === LOC_LOADING &&
        <svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(2 1)">
              <circle cx="42.601" cy="11.462" r="5" fillOpacity="1" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="1;0;0;0;0;0;0;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="49.063" cy="27.063" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;1;0;0;0;0;0;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="42.601" cy="42.663" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;0;1;0;0;0;0;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="27" cy="49.125" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;0;0;1;0;0;0;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="11.399" cy="42.663" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;0;0;0;1;0;0;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="4.938" cy="27.063" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;0;0;0;0;1;0;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="11.399" cy="11.462" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;0;0;0;0;0;1;0" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
              <circle cx="27" cy="5" r="5" fillOpacity="0" fill="#585bff">
                <animate attributeName="fill-opacity"
                     begin="0s" dur="1.3s"
                     values="0;0;0;0;0;0;0;1" calcMode="linear"
                     repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        </svg>
      }
      {locStatus === LOC_FAILED && "🚫"}
    </Wrapper>
  )
}

export default Spinner
