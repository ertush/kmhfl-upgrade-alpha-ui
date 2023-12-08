import React, { useContext, useEffect, useState } from 'react'
import { MapContainer, Marker, GeoJSON,  } from 'react-leaflet'
import Alert from '@mui/material/Alert';
import { useMap } from 'react-leaflet/hooks'
import { TabContext } from '../components/Forms/EditForm'



// function MapEventListener({coordinates}) {

//     const map = useMapEvent('mouseover', () => {
//     //   map.flyTo(coordinates, map.getZoom())

//     map.invalidateSize(false);

//       console.log('Loaded Map...')
//     })

//     return null
// }

function MapListener ({tabOpen}) {
    const map = useMap()

    useEffect(() => {
        if(tabOpen !== null) map.invalidateSize(false)
    }, [tabOpen])

    return null

}


const WardGISMap = ({ markerCoordinates, geoJSON, center, ward }) => {



    const [isOutOfBound, setIsOutOfBound] = useState(false)

    const tabOpen = useContext(TabContext)

    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3
    }
 

    // useEffect(() => {
    //     const lngs = []
    //     const lats = []

    //     const bounds = geoJSON.properties.bound.coordinates

    //     if (geoJSON) {

        
    //         for (let i = 0; i < bounds.length; i++){
    //             lngs.push(bounds[i][0])
    //             lats.push(bounds[i][1])
    //         }

    //         if(
    //             !(lngs.every(bound => markerCoordinates[1] < bound) &&
    //             lats.every(bound => markerCoordinates[0] < bound)) 
    //         ) {

    //             // Not Out of Bound
    //             setIsOutOfBound(false)

    //             console.log("[>>>>>] NoT of Bound")
    //         }
    //         else {
    //                //Out of Bound
    //             setIsOutOfBound(true)
    //             console.log("[>>>>>] Out of Bound")
    //         }
            
            
    //     }

    // }, [markerCoordinates, geoJSON])

 


    return (

        <>

            {/* Map title */}
            <h3 className='mb-1 px-2 text-blue-900 font-normal float-left text-lg bg-gray-300 w-full  capitalize'>{String(ward).toLowerCase()}{" ward"}</h3>
            {isOutOfBound && <Alert severity="error" sx={{ width: '100%' }}>The coordinates are outside the ward boundary</Alert>}
    
            {/* Ward Map */}
            {/* Center   */}
            {
                geoJSON && markerCoordinates && 
            <MapContainer className='w-full' center={center ?? [-0.818389, 37.477222]} zoom={11.899} maxZoom={18.7} scrollWheelZoom={false} touchZoom={false} style={{ height: '400px', position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>

                <GeoJSON data={geoJSON} stylez={geoJsonStyles} />

                <Marker position={markerCoordinates}></Marker>

                <MapListener tabOpen={tabOpen} />

            </MapContainer>
           } 
        </>



    )
}

export default WardGISMap