import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import leaflet, { Map, Marker } from 'leaflet'

import StatusIndicator from './StatusIndicator'
import useCheckIns from '../hooks/use-checkins'

import { LOC_SUCCESS } from '../types'

import 'leaflet/dist/leaflet.css'

const MapContainer = styled.div`
  position: relative;
  flex: 0 1 100%;
`

const LeafletView = styled.div`
  height: 100%;
  width: 100%;
`

const token = 'mapBoxToken'

const CurrentIcon = leaflet.divIcon({
  className: 'marker',
  iconSize: [33, 33],
  html: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 297 392" style="fill: #585bff; filter: drop-shadow(3px 0 2px #a1a1a1)" xml:space="preserve">
  <g fill="none" fill-rule="evenodd" stroke-width="12" stroke="#585bff" stroke-opacity="1">
    <circle cx="150" cy="297" r="99">
      <animate attributeName="r" begin="0s" dur="3s" values="0;99" keyTimes="0;1" keySplines="0.1,0.2,0.3,1" calcMode="spline" repeatCount="indefinite"></animate>
      <animate attributeName="stroke-opacity" begin="0s" dur="3s" values="0;1;1;0" repeatCount="indefinite"></animate>
    </circle>
    <circle cx="150" cy="297" r="66">
      <animate attributeName="r" begin="-1s" dur="3s" values="0;66" keyTimes="0;1" keySplines="0.1,0.2,0.3,1" calcMode="spline" repeatCount="indefinite"></animate>
      <animate attributeName="stroke-opacity" begin="-1s" dur="3s" values="0;.3;.3;0" repeatCount="indefinite"></animate>
    </circle>
  </g><path d="M148.5,0C87.43,0,37.747,49.703,37.747,110.797c0,91.026,99.729,179.905,103.976,183.645
	c1.936,1.705,4.356,2.559,6.777,2.559c2.421,0,4.841-0.853,6.778-2.559c4.245-3.739,103.975-92.618,103.975-183.645
	C259.253,49.703,209.57,0,148.5,0z M148.5,79.693c16.964,0,30.765,13.953,30.765,31.104c0,17.151-13.801,31.104-30.765,31.104
	c-16.964,0-30.765-13.953-30.765-31.104C117.735,93.646,131.536,79.693,148.5,79.693z"></path>
  </svg>`
})

const CheckInIcon = leaflet.divIcon({
  className: 'marker',
  iconSize: [33, 33],
  html: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 -15 297 395" style="fill: transparent;stroke: #585bff;stroke-width: 9%;filter: drop-shadow(3px 0 2px #a1a1a1);" xml:space="preserve">
  <path d="M148.5,0C87.43,0,37.747,49.703,37.747,110.797c0,91.026,99.729,179.905,103.976,183.645
	c1.936,1.705,4.356,2.559,6.777,2.559c2.421,0,4.841-0.853,6.778-2.559c4.245-3.739,103.975-92.618,103.975-183.645
	C259.253,49.703,209.57,0,148.5,0z M148.5,79.693c16.964,0,30.765,13.953,30.765,31.104c0,17.151-13.801,31.104-30.765,31.104
	c-16.964,0-30.765-13.953-30.765-31.104C117.735,93.646,131.536,79.693,148.5,79.693z"></path>
  </svg>`
})

const MapView = () => {
  const divRef = useRef<HTMLDivElement>(null!)
  const [map, setMap] = useState<Map | null>(null)
  const [curMarker, setCurMarker] = useState<Marker | null>(null)
  const { checkIns, currentLoc, locStatus } = useCheckIns()

  useEffect(() => {
    const map = leaflet.map(divRef.current)

    leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: token
    }).addTo(map);

    setMap(map)
  }, [])

  useEffect(() => {
    if (currentLoc && map) {
      map.setView(leaflet.latLng(currentLoc), 33)
      const marker = leaflet.marker(currentLoc, { icon: CurrentIcon })
      marker.addTo(map)
      setCurMarker(marker)
    }
  }, [map, currentLoc])

  useEffect(() => {
    if (map && checkIns.length > 0) {
      checkIns.forEach(checkIn => {
        const marker = leaflet.marker(checkIn.coords, { icon: CheckInIcon })
        marker.addTo(map)
      })
    }
  }, [map, checkIns])

  return (
    <MapContainer>
      {locStatus !== LOC_SUCCESS && <StatusIndicator />}
      <LeafletView ref={divRef} />
    </MapContainer>
  )
}

export default MapView
