import { LatLngExpression } from "leaflet";
import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { useQuery } from 'react-query'
import type { Map } from '~~/types/maps'
import './App.css';

function App() {
  const { isLoading, error, data } = useQuery<Map[], Error>('repoData', () =>
    fetch('http://localhost:3001/maps', {
      // mode: 'no-cors',
      method: 'GET',
      // referrerPolicy: 'origin-when-cross-origin',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res =>
      res.json()
    ).then(res => res.maps)
  )
  const limeOptions = { color: 'lime' };

  if (isLoading) return (<>Loading...</>)

  if (error) return (<>An error has occurred: {error.message}</>)

  const polylines: LatLngExpression[] | LatLngExpression[][] = data && data?.length > 0 ? data.map(da => ([da.lat, da.long])) : []
  return (
    <MapContainer center={polylines[0]} zoom={12} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {polylines.map((polyline, i) => <Marker position={polyline} key={i} />)}
      <Polyline pathOptions={limeOptions} positions={polylines} />
    </MapContainer>
  );
}

export default App;