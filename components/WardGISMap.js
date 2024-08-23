import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, Marker, GeoJSON,  } from 'react-leaflet'
import Alert from '@mui/material/Alert';
import { useMap } from 'react-leaflet/hooks'
import { TabContext } from '../components/Forms/EditForm'
import MarkerIcon from './MarkerIcon';



function MapListener ({tabOpen}) {
    const map = useMap()

    useEffect(() => {
        
        if(tabOpen !== null) map.invalidateSize(false)

    }, [tabOpen])

    return null

}


const WardGISMap = ({ markerCoordinates, geoJSON, center, ward, zoom }) => {


    const isValidGeoCoordinates = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/.test(markerCoordinates.join(','))

    const [isOutOfBound, setIsOutOfBound] = useState(false)

    const tabOpen = useContext(TabContext)

    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3,
        zIndex: '0px'
    }
 

    useEffect(() => {

        // console.log({geoJSON, center, ward, from})

        const lngs = []
        const lats = []

        const bounds = geoJSON?.properties?.bound?.coordinates[0];


        if (geoJSON) {

        
            for (let i = 0; i < bounds.length; i++){
                lngs.push(bounds[i][0])
                lats.push(bounds[i][1])
            }

            if(
                !(lngs.every(bound => markerCoordinates[1] < bound) &&
                lats.every(bound => markerCoordinates[0] < bound)) 
            ) {

                // Not Out of Bound
                setIsOutOfBound(false)
                // console.log("[>>>>>] NoT out of Bound")
            }
            else {
                   //Out of Bound
                setIsOutOfBound(true)
                // console.log("[>>>>>] Out of Bound")
            }
            
            
        }

    }, [markerCoordinates])



    return (

        <>
            {/* Map title */}

            <h3 className='mb-1 px-2 text-gray-900 font-normal float-left text-lg bg-gray-300 w-full  capitalize'>{String(ward).toLowerCase()}{" ward"}</h3>
            {isValidGeoCoordinates && isOutOfBound && <Alert severity="error" sx={{ width: '100%' }}>The coordinates are outside the ward boundary</Alert>}
    
            {/* Ward Map */}
            {
                 markerCoordinates && center  ?
                <MapContainer 
                    className='w-full z-0' 
                    center={center ?? [-0.818389, 37.477222]} 
                    zoom={zoom ?? (zoom * 2) ?? 9.899} 
                    maxZoom={12.70} 
                    scrollWheelZoom={false} 
                    touchZoom={false} 
                    style={{ height: '400px', position: 'relative', backgroundColor: '#e7eae8', padding: '15px', zIndex: '0px', 'overflow': 'hidden'}}>

                        {
                            geoJSON && 
                            <GeoJSON data={geoJSON} stylez={geoJsonStyles} />
                        }

                        {
                            isValidGeoCoordinates && markerCoordinates &&
                            <Marker icon={MarkerIcon} position={markerCoordinates}></Marker>
                        }   

                <MapListener tabOpen={tabOpen} />

                </MapContainer>
                :
                <Alert severity='info' className='capitalize text-lg ' style={{width: '100%'}}> Please enter  Latitude and Longitude to see {ward?.toLowerCase()} map ...</Alert>
           } 
        </>



    )
}

export default WardGISMap