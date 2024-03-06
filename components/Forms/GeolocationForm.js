import { useContext, useEffect, useState, memo, Suspense } from 'react';
// import { FacilityIdContext, FormContext } from './Form';
import { Alert } from '@mui/lab';
import dynamic from 'next/dynamic';
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon
} from '@heroicons/react/solid';
import { FormOptionsContext } from '../../pages/facilities/add';
// import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import { useAlert } from 'react-alert';
// import { FacilityIdContext, FacilityWardDataContext } from './Form';
import Spinner from '../Spinner'
// import { handleGeolocationUpdates } from '../../controllers/facility/facilityHandlers';
import { useRouter } from 'next/router';
import { UpdateFormIdContext } from './Form';


const WardMap = dynamic(
  () => import('../../components/WardGISMap'), // replace '@components/map' with your component's location
  {
    loading: () => <div className="text-gray-800 text-lg bg-white py-2 px-5 shadow w-auto mx-2 my-3">Loading&hellip;</div>,
    ssr: false // This line is important. It's what prevents server-side render
  }
)
// import { handleGeolocationSubmit, handleGeolocationUpdates } from '../../controllers/facility/facilityHandlers';


const Map = memo(WardMap)
// const _ = require('underscore');



export function GeolocationForm({ editMode }) {

  const _options = useContext(FormOptionsContext);
  const setFormId = useContext(UpdateFormIdContext);

  // const [wardData, setWardData] = useContext(FacilityWardDataContext)

  const [options, setOptions] = useState(_options)
  // const [wardData, setWardData] = useState({})
  const [facilityId, setFacilityId] = useState('')
  const [geoJSON, setGeoJSON] = useState(_options?.geolocation?.geoJSON)

  // console.log({geoJSON})

  const [wardName, setWardName] = useState(_options?.data?.ward_name)
  const [geoCenter, setGeoCenter] = useState(_options?.geolocation?.centerCoordinates)
  const [submitting, setSubmitting] = useState(false)
  const [basicDetailsURL, setBasicDetailsURL] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [wardData, setWardData] = useState({})
  const [formError, setFormError] = useState(null)
  const [from, setFrom] = useState('')

  const router = useRouter()

  const alert = useAlert();

  // Event handlers

  function handleGeolocationPrevious(e) {
    e.preventDefault()

    // const url = new URL(basicDetailsURL)

    // url.searchParams.set('formId', '0')

    // url.searchParams.set('from', 'previous')

    // router.push(url)

    router.push({
      pathname: '/facilities/add',
      query: {
          formId: 0
      }
    })
    .then((navigated) => {
      if(navigated) setFormId(0)
    })


  }


  // handleGeolocationDataUpdate
  function handleGeolocationUpdates(e) {

    e.preventDefault()

    const formData = new FormData(e.target)

    const data = Object.fromEntries(formData)

    setSubmitting(true) 

    const payload = {
      coordinates: {
        coordinates: [Number(data?.longitude), Number(data?.latitude)],
        type: 'point'
      },
      latitude: Number(data?.latitude),
      longitude: Number(data?.longitude),
      facility: options?.data?.id
    }
  
      if (payload) {

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/facility_coordinates${options?.data?.lat_long ? '/' + options?.data?.coordinates + '/' : '/'}`, {
          headers: {
            'Authorization': 'Bearer ' + options?.token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8'
          },
          method: options?.data?.lat_long && options?.data?.coordinates ? 'PATCH' : 'POST',
          body: JSON.stringify(payload)
        })
          .then(resp => {
            if (resp.status == 200 || resp.status == 201) {
              alert.success('Geolocation Detatils saved Successfully', {timeout: 10000})
              setSubmitting(false)
                         
              router.push({
                pathname: '/facilities/facility_changes/[facility_id]/',
                query: { 
                  facility_id: options?.data?.id
                }
              })

            } else {
              alert.error('Unable to save Geolocation Details Successfully', {timeout: 10000})
              setSubmitting(false)
              resp.json()
              .then(resp => {
                const formResponse = []
                setFormError(() => {
                  if(typeof resp == 'object') {
                    const respEntry = Object.entries(resp)

                    for (let [_, v] of respEntry) {
                      formResponse.push(v)
                    }

                    return `Error: ${formResponse.join(" ")}`
                  }
                })
              })
            }

          })
          .catch(e => {
            setSubmitting(false)
            setFormError(`Error: ${e.message}`)
            console.error(e.message)
          })
      
      }


 


  }


  function handleGeolocationFormCreate(e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = Object.fromEntries(formData)

    setSubmitting(true)


    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${options?.token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status == 204 || res.status == 200) {
          alert.success('Facility Geolocation Details have been saved successfully')

          setSubmitting(false)

          // Navigation & Persisitng Data

          const params = [];

          for (let [k, v] of formData) params.push(`${k}=${v}`)

          if (wardData) params.push(`wardData=${Buffer.from(JSON.stringify(wardData)).toString('base64')}`)

          const base64EncParams = Buffer.from(params.join('&')).toString('base64')

          router.push({
            pathname: `${window.location.origin}/facilities/add`,
            query: { 
              formData: base64EncParams,
              formId: 2,
              facilityId: facilityId,
              from: 'submission'

            }
          })
          .then((navigated) => {
            if(navigated) setFormId(2)
          })

          // const url = new URL(`${window.location.origin}/facilities/add?formData=${base64EncParams}`)

          // url.searchParams.set('formId', '2')

          // url.searchParams.set('facilityId', facilityId)

          // window.location.href = url

        } else {
          setSubmitting(false)
          alert.error('Unable to save to Geolocation details')

          res.json()
          .then(resp => {
            const formResponse = []
            setFormError(() => {
              if(typeof resp == 'object') {
                const respEntry = Object.entries(resp)

                for (let [_, v] of respEntry) {
                  formResponse.push(v)
                }

                return `Error: ${formResponse.join(" ")}`
              }
            })
          })
        }
      })
      .catch(e => {
        setSubmitting(false)

        setFormError(`Error: ${e.message}`)
        console.error(e.message)
      })

  }


  function handleInput(e) {
    e.preventDefault()
    // const coordinates = []

    if (e.target.name == 'latitude') {

      setLatitude(e.target.value)

    } else if (e.target.name == 'longitude') {

      setLongitude(e.target.value)
    }

    // console.log(options)
  }


  useEffect(() => {

    setLatitude(Array.isArray(options?.data?.lat_long) ? options?.data?.lat_long[0] : '' ?? geoCenter[0])
    setLongitude(Array.isArray(options?.data?.lat_long) ? options?.data?.lat_long[1] : '' ?? geoCenter[1])
    
    // console.log(JSON.stringify({wardData}))

    if (window && !editMode) {

      const current_url = new URL(window.location.href)

      setFrom(current_url.searchParams.get('from'))

      setFacilityId(current_url.searchParams.get('facilityId'))

      if (current_url.searchParams.get('from') == 'previous') setBasicDetailsURL(current_url)

      if (current_url.searchParams.get('from') == 'submission') {

        const strFormData = Buffer.from(current_url.searchParams?.get('formData') ?? 'J3t9Jw==', 'base64').toString() ?? "{}"
        const params = new URL(`${window.location.origin}/facilities/add?${strFormData}`).searchParams


        // const paramEntries = params.entries()
        const base64WardData = params.get('wardData')
        const wardDataStr = Buffer.from(base64WardData, 'base64').toString()
        const _wardData = JSON.parse(wardDataStr)
        const formData = Object.fromEntries(params.entries())

        // const formData = Object.fromEntries(paramEntries)

        setWardData(_wardData)

        setGeoJSON(_wardData?.geoJSON)
        setGeoCenter(_wardData?.centerCoordinates)
        setWardName(_wardData?.geoJSON?.properties?.name)


        const newOptions = {}

        Object.assign(newOptions, options)

        console.log(new Date(formData.collection_date))

        newOptions['data'] = { lat_long: [formData.latitude, formData.longitude], collection_date: formData.collection_date }

        for (let [k, v] of Object.entries(newOptions?.data)) {
          newOptions.data[k] = v

        }

        setOptions(newOptions)
      }
    }

  }, [])


  // console.log({options})

  return (

    <form
      name='geolocation_form'
      className='flex flex-col w-full mt-4 items-start bg-gray-50 p-3 justify-start gap-3'
      onSubmit={!editMode ? handleGeolocationFormCreate : handleGeolocationUpdates}
    >

      {
        formError && <Alert severity='error' className='w-full border-2 border-red-500 rounded-none'>{formError}</Alert> 
      }

      {/* Collection Date */}
      <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
        <label
          htmlFor='collection_date'
          className='text-gray-600 capitalize text-sm'>
          Collection date:
          <span className='text-medium leading-12 font-semibold'>
            {' '}
            *
          </span>
        </label>
        <input
          required
          type='date'
          name='collection_date'
          onChange={handleInput}
          defaultValue={options?.collection_date?.split('T')[0] ?? ''}
          className='flex-none w-full  p-2 flex-grow border placeholder-gray-500 bg-transparent border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
        />


      </div>

      {/* Lon/Lat */}
      <div className='grid grid-cols-2 gap-4 place-content-start w-full'>
        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-1'>
          <label
            htmlFor='longitude'
            className='text-gray-600 capitalize text-sm'>
            Longitude
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='decimal'
            name='longitude'
            step={0.000001}
            defaultValue={(options?.data?.lat_long && options?.data?.lat_long?.length == 2 && options?.data?.lat_long[1]) ?? ''}
            onChange={handleInput}
            placeholder='Enter longitude'
            className='flex-none w-full  p-2 flex-grow border bg-transparent placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />


        </div>

        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3 col-start-2'>
          <label
            htmlFor='latitude'
            className='text-gray-600 capitalize text-sm'>
            Latitude
            <span className='text-medium leading-12 font-semibold'>
              {' '}
              *
            </span>
          </label>
          <input
            required
            type='decimal'
            name='latitude'
            step={0.000001}
            onChange={handleInput}
            placeholder='Enter latitude'
            defaultValue={(options?.data?.lat_long && options?.data?.lat_long?.length == 2 && options?.data?.lat_long[0]) ?? ''}
            className='flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:border-black outline-none'
          />

        </div>

      </div>

      {/* Ward Geo Map */}
      <div className='w-full h-auto'>

        <div className='w-full bg-gray-200   flex flex-col items-start justify-center text-left relative'>


          <Suspense fallback={<Alert severity='info' className='w-full p-1'>Loading ...</Alert>}>


            {
              (editMode) || (!editMode && geoJSON && geoCenter && wardName) ?

                <Map markerCoordinates={[latitude, longitude]} geoJSON={geoJSON} from={from} ward={wardName} center={geoCenter} />
                :
                <Alert severity='warning' className='w-full p-1 border-2 border-yellow-500 rounded-none'>Geolocation Data is Missing For this facility</Alert>
            }
          </Suspense>
        </div>
      </div>

      {/* Finish | Cancel & Geolocation */}
      {
        editMode ?

          <div className='flex justify-end items-center w-full'>
            <button
              type='submit'
              disabled={submitting}
              className={`flex items-center ${submitting ? 'justify-center' : 'justify-start'} space-x-2 bg-blue-700  p-1 px-2`}>
              <span className='text-medium font-semibold text-white'>
                {
                  submitting ?
                    <span className='flex items-center gap-2'>
                      <span className='text-white'>Saving </span>
                      <Spinner />
                    </span>
                    :
                    'Save & Finish'

                }
              </span>
              {/* <ChevronDoubleRightIcon className='w-4 h-4 text-white' /> */}
            </button>
          </div>

          :

          <div className='flex justify-between items-center w-full'>
            <button onClick={handleGeolocationPrevious} className='flex items-center justify-start space-x-2 p-1 border border-gray-900  px-2'>
              <ChevronDoubleLeftIcon className='w-4 h-4 text-gray-900' />
              <span className='text-medium font-semibold text-gray-900 '>
                Basic Details
              </span>
            </button>
            <button
              type='submit'
              disabled={submitting}
              className='flex items-center justify-start gap-2 text-white bg-blue-700  p-1 px-2'>
              <span className='text-medium font-semibold text-white'>
                {
                  submitting ?
                    <Spinner />
                    :
                    'Facility Contacts'

                }
              </span>
              {
                submitting ?
                  <span className='text-white'>Saving </span>
                  :
                  <ChevronDoubleRightIcon className='w-4 h-4 text-white' />

              }
            </button>
          </div>
      }



    </form>

  )

}