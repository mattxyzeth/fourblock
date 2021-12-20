import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import leaflet from 'leaflet'

import 'leaflet/dist/leaflet.css'

const MapContainer = styled.div`
  flex: 0 1 80%;
`

const token = 'mapBoxToken'

const Map = () => {
  const divRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const map = leaflet.map(divRef.current).setView([51.505, -0.09], 13)

    leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: token
    }).addTo(map);
  }, [])

  return (
    <MapContainer ref={divRef} />
  )
}

export default Map
