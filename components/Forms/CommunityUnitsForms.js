
import MainLayout from '../MainLayout';
import CommunityUnitSideMenu from '../CommunityUnitSideMenu';
import { Select as CustomSelect } from './formComponents/Select';

import Link from 'next/link';
import * as Tabs from "@radix-ui/react-tabs";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
  TrashIcon
} from "@heroicons/react/solid";
import { useContext, useState } from 'react';
import { ChuOptionsContext } from '../../pages/community-units/edit/[id]';
import Select from 'react-select'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useAlert } from 'react-alert'
import Alert from '@mui/material/Alert';
import Spinner from '../../components/Spinner'
import EditListItem from '../../components/Forms/formComponents/EditListItem'
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';


function EditCommunityUnitsBasicDeatilsForm(props) {

  const options = useContext(ChuOptionsContext)
  const [touchedFields, setTouchedFields] = useState(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [validationError, setValidationError] = useState({ date_established: null, date_operational: null })

  const derivedContacts = props?.contacts?.map(obj => ({ ...obj, uid: uuid() }))
  const [contacts, setContacts] = useState(derivedContacts ?? [{ contact: '', contact_type_name: '', uid: uuid() }]);
  const [contactTypeLabel, setContactTypeLabel] = useState(null)
  const router = useRouter()


  const alert = useAlert()

  function handleFieldChange(event, uid) {

    if (!typeof event == 'object') event.preventDefault()

    setTouchedFields(prev => {
      prev.add(event?.target?.name ?? 'facility')
      return prev
    })


    if(event.currentTarget.name === `contact_type_${uid}`) {
      setContactTypeLabel(options?.contactTypes.find(({value}) => value === event.currentTarget.value)?.label)
    }
  }

  function handleDateChange(event) {

    event.preventDefault()

    handleFieldChange(event, null)

    if (event.target.name == "date_established") {
      setValidationError(prev => ({ ...prev, date_established: null }))
    } else {
      setValidationError(prev => ({ ...prev, date_operational: null }))
    }

    const today = new Date()

    const setDate = event.target.valueAsDate

    if (setDate > today) {
      if (event.target.name == "date_established") {
        setValidationError(prev => ({ ...prev, date_established: 'Date Established cannot be in the future' }))
      } else {
        setValidationError(prev => ({ ...prev, date_operational: 'Date Operational cannot be in the future' }))
      }

      event.target.value = ''

    }


    const dateEstablished = event.target.value !== '' && event.target.name.includes('date_established') ? event.target.valueAsDate : document.querySelector('input[name="date_established"]').valueAsDate

    const dateOperational = event.target.value !== '' && event.target.name.includes('date_operational') ? event.target.valueAsDate : document.querySelector('input[name="date_operational"]').valueAsDate


    if (dateEstablished && dateOperational) {
      if (dateEstablished > dateOperational) {
        if (event.target.name == "date_operational") {
          setValidationError({ date_operational: 'Date Established Cannot be recent than date operational ' })
          event.target.value = ''

        }
      }


    }
  }

  function handleFormSubmit(event) {

    event.preventDefault()

    setSubmitting(true)


    const payload = {}
    const formData = new FormData(event.target)
    const formDataObject = Object.fromEntries(formData)


    if (Array(touchedFields.values()).length >= 1) {
      for (let field of [...touchedFields.values()]) {
        if (props[field] !== formDataObject[field]) {

          if (/chcs_.+/.test(field) || /chas_.+/.test(field) || /chps_.+/.test(field)) {
            payload[field] = formDataObject[field]
          }
          else {
            if (field == 'facility') {
              payload['basic'] = { [field]: formDataObject[field] }

            } else {

              if (/^contact_*/.test(field)) {

                const chuContacts = [];
                const contactEntries = Object.entries(formDataObject).filter(arr => ((/^contact_.*/.test(arr[0])) || (/^contact_type_.*/.test(arr[0]))));


                const contact_temp = []

                let i = 0
                let temp = {}
                for (let [k, v] of contactEntries) {
                  if (/^contact_.*/.test(k)) temp[k.split('_').length <= 2 ? 'contact' : 'contact_type'] = v
                  contact_temp.push(temp)
                  temp = {};
                  i++;
                }

                for (let i = 0; i < contact_temp.length; i++) {
                  chuContacts.push(
                    {
                      ...contact_temp[i],
                      ...contact_temp[i + 1]
                    }
                  )
                  i += 1
                }

                payload['contacts'] = chuContacts

              } else {
                payload[field] = formDataObject[field]
              }


            }

          }
        }
      }
    }


    try {

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.id}/`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${props?.token}`
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })

        .then(async resp => {
          if (resp.ok) {

            setSubmitting(false)

            alert.success(`${props?.name} Basic Details Updated successfully`, {
              containerStyle: {
                backgroundColor: "green",
                color: "#fff"
              }
            })

            router.push(`/community-units/${props?.id}`)

          } else {
            const detail = await resp.json()

            const error = Array.isArray(Object.values(detail)) && Object.values(detail).length == 1 ? detail[Object.keys(detail)[0]][0] : ''

            setSubmitting(false)

            setFormError(error)

            alert.error('Unable to save Community Units Basic details')
          }
        })
    }

    catch (e) {
      setSubmitting(true)
      console.error('Error Occured: ' + e.message)
    }
    finally {
      setSubmitting(false)

    }



  }

  function handleAddContact(event) {
    event.preventDefault()

    setContacts(prev => {
      return [...prev, { contact: '', contact_type_name: '', uid: uuid() }]
    })
  }

  return (
    <form
      className="flex m-1 p-3 bg-gray-50 flex-col w-full items-start justify-start gap-3"
      onSubmit={handleFormSubmit}
    >



      {formError && <Alert severity="error" sx={{ width: '100%', marginY: '15px' }}>{formError}</Alert>}

      {/* CHU Name */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <label
          htmlFor="name"
          className="text-gray-600 capitalize text-sm"
        >
          Community Health Unit Official Name
          <span className="text-medium leading-12 font-semibold">
            *
          </span>
        </label>

        <input
          type="text"
          name="name"
          onChange={(e) => handleFieldChange(e, null)}
          id="name"
          defaultValue={props?.name}
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
        />
      </div>

      {/* CHU Linked Facility */}

      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">

        <label
          htmlFor="facility"
          className="text-gray-600 capitalize text-sm"
        >
          Community Health Unit Linked Facility{" "}
          <span className="text-medium leading-12 font-semibold">
            {" "}
            *
          </span>
        </label>
        <Select

          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'transparent',
              outLine: 'none',
              border: 'none',
              outLine: 'none',
              textColor: 'transparent',
              padding: 0,
              height: '4px'
            }),
          }}

          options={options?.facilities}
          defaultValue={options?.facilities?.find(({ value }) => value == props?.facility)}
          placeholder="Select Link facility ..."
          name="facility"
          id="facility"
          onChange={(e) => handleFieldChange(e, null)}
          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-400 rounded outline-none'


        />
      </div>

      {/* CHU Operational Status */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <label
          htmlFor="status"
          className="text-gray-600 capitalize text-sm"
        >
          Operation Status
          <span className="text-medium leading-12 font-semibold">
            {" "}
            *
          </span>
        </label>
        <CustomSelect
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'transparent',
              outLine: 'none',
              border: 'none',
              outLine: 'none',
              textColor: 'transparent',
              padding: 0,
              height: '4px'
            }),
          }}
          options={options?.statuses}
          defaultValue={props?.status}
          name="status"
          onChange={(e) => handleFieldChange(e, null)}
          id="status"
          className='flex-none w-full  flex-grow  placeholder-gray-500 border border-gray-400 rounded outline-none'

        />
      </div>

      {/* CHU Dates - Established and Operational */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <div className="grid grid-cols-2 place-content-start gap-3 w-full">
          {/* Date Established  */}
          <div className="col-start-1 col-span-1">
            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
              <label
                htmlFor="date_established"
                className="text-gray-600 capitalize text-sm"
              >
                Date Established
                <span className="text-medium leading-12 font-semibold">
                  {" "}
                  *
                </span>
              </label>
              <input
                type="date"
                name="date_established"
                onChange={handleDateChange}
                id="date_established"
                defaultValue={props?.date_established}
                placeholder={'mm/dd/yyyy'}
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              />
              <p className='text-red-500 text-sm'>{validationError.date_established ?? ''}</p>

            </div>
          </div>

          {/* Date Operational  */}
          <div className="col-span-1">
            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
              <label
                htmlFor="date_operational"
                className="text-gray-600 capitalize text-sm"
              >
                Date Operational
                <span className="text-medium leading-12 font-semibold">
                  {" "}
                  *
                </span>
              </label>
              <input
                type="date"
                name="date_operational"
                onChange={handleDateChange}
                id="date_operational"

                defaultValue={props?.date_operational}

                placeholder={'mm/dd/yyyy'}
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              />

              <p className='text-red-500 text-sm'>{validationError.date_operational ?? ''}</p>


            </div>
          </div>
        </div>
      </div>

      {/* CHU Number of Monitored Households */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <label
          htmlFor="households_monitored"
          className="text-gray-600 capitalize text-sm"
        >
          Number of monitored households
          <span className="text-medium leading-12 font-semibold">
            {" "}
            *
          </span>
        </label>
        <input
          type="number"
          name="households_monitored"
          onChange={(e) => handleFieldChange(e, null)}
          id="households_monitored"

          defaultValue={props?.households_monitored}

          min={0}
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
        />
      </div>

      {/* CHU Number of CHVs */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <label
          htmlFor="number_of_chvs"
          className="text-gray-600 capitalize text-sm"
        >
          Number of CHVs
          <span className="text-medium leading-12 font-semibold">
            {" "}
            *
          </span>
        </label>
        <input
          type="number"
          name="number_of_chvs"
          onChange={(e) => handleFieldChange(e, null)}
          id="number_of_chvs"
          defaultValue={props?.number_of_chvs}

          min={0}
          className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
        />
      </div>

      {/* CHU, Linked Facility Location */}
      <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
        <div className="flex flex-col md:grid md:grid-cols-4 place-content-start gap-3 w-full">
          {/* County  */}
          <div className="col-start-1 col-span-1">
            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
              <label
                htmlFor="facility_county"
                className="text-gray-600 capitalize text-sm"
              >
                County
                <span className="text-medium leading-12 font-semibold">
                  {" "}
                  *
                </span>
              </label>
              <input
                readOnly

                defaultValue={props?.facility_county}

                type="text"
                name="facility_county"
                onChange={(e) => handleFieldChange(e, null)}
                id="facility_county"
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Sub-county */}
          <div className="col-start-2 col-span-1">
            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
              <label
                htmlFor="facility_subcounty"
                className="text-gray-600 capitalize text-sm"
              >
                Sub-county
                <span className="text-medium leading-12 font-semibold">
                  {" "}
                  *
                </span>
              </label>
              <input
                readOnly
                defaultValue={props?.facility_subcounty}

                type="text"
                name="facility_subcounty"
                onChange={(e) => handleFieldChange(e, null)}
                id="facility_subcounty"
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Constituency */}
          <div className="col-start-3 col-span-1">
            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
              <label
                htmlFor="facility_constituency"
                className="text-gray-600 capitalize text-sm"
              >
                Constituency
                <span className="text-medium leading-12 font-semibold">
                  {" "}
                  *
                </span>
              </label>
              <input
                readOnly
                defaultValue={props?.facility_constituency}
                type="text"
                name="facility_constituency"
                onChange={(e) => handleFieldChange(e, null)}
                id="facility_constituency"
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Ward */}
          <div className="col-start-4 col-span-1">
            <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
              <label
                htmlFor="facility_ward"
                className="text-gray-600 capitalize text-sm"
              >
                Ward
                <span className="text-medium leading-12 font-semibold">
                  {" "}
                  *
                </span>
              </label>
              <input
                readOnly
                defaultValue={props?.facility_ward}
                type="text"
                name="facility_ward"
                onChange={(e) => handleFieldChange(e, null)}
                id="facility_ward"
                className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
              />
            </div>
          </div>
        </div>

        {/* Area of Coverage */}
        <div className="w-full flex flex-col items-start justify-start gap-1 mb-3">
          <label
            htmlFor="location"
            className="text-gray-600 capitalize text-sm"
          >
            Area of coverage
          </label>
          <input
            // required
            type="number"
            name="location"
            onChange={(e) => handleFieldChange(e, null)}
            id="location"
            placeholder="Description of the area of coverage"
            defaultValue={props?.location}
            min={0}
            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
          />
        </div>

        {/* Community Health Unit Workforce */}
        <div className='grid grid-cols-3 grid-rows-5 gap-3 mb-3 w-full'>
          <h4 className='col-span-3 self-end row-start-1 text-lg uppercase  border-b border-gray-600 w-full font-semibold text-gray-900'>
            Community Health Unit Workforce
          </h4>
          <label className='col-start-2 row-start-2 text-gray-600 self-end'>Number Present</label>
          <label className='col-start-3 row-start-2 text-gray-600 self-end'>Number Trained</label>

          {/* <div className='row-span-3'> */}
          <label className='col-start-1 row-start-3 self-end'>Community Health Promoters (CHPs)*</label>
          <label className='col-start-1 row-start-4 self-end'>Community Health Assistants (CHAs)*</label>
          <label className='col-start-1 row-start-5 self-end'>Community Health Commitee Members (CHC)*</label>

          {/* </div> */}

          <input
            defaultValue={props?.chps_present}
            type='number'
            name='chps_present'
            onChange={(e) => handleFieldChange(e, null)}
            className='col-start-2 flex-none w-full bg-transparent  rounded p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
          />

          <input
            defaultValue={props?.chps_trained}
            type='number'
            name='chps_trained'
            onChange={(e) => handleFieldChange(e, null)}
            className='rounded col-start-3 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
          />

          <input
            defaultValue={props?.chas_present}
            type='number'
            name='chas_present'
            onChange={(e) => handleFieldChange(e, null)}
            className='rounded col-start-2 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
          />

          <input
            defaultValue={props?.chas_trained}
            type='number'
            name='chas_trained'
            onChange={(e) => handleFieldChange(e, null)}
            className='rounded col-start-3 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
          />

          <input
            defaultValue={props?.chcs_present}
            type='number'
            name='chcs_present'
            onChange={(e) => handleFieldChange(e, null)}
            className='rounded col-start-2 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
          />

          <input
            defaultValue={props?.chcs_trained}
            type='number'
            name='chcs_trained'
            onChange={(e) => handleFieldChange(e, null)}
            className='rounded col-start-3 flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
          />



        </div>

        <div className=" w-full flex flex-col items-start justify-start bg-transparent h-auto">
          <h4 className="text-lg uppercase  border-b border-gray-600 w-full my-4 font-semibold text-gray-900">
            Community Health Unit Contacts
          </h4>


          {contacts?.map(({ contact, contact_type_name, uid }) => {

           
            return (
              <div
                className="w-full flex flex-row items-center  gap-1 gap-x-3 mb-3"
                key={uid}
              >

                <div
                  className="w-full flex flex-col items-left   gap-1 gap-x-3 mb-3"
                >
                  <label
                    htmlFor={`contact_type_${uid}`}
                    className="text-gray-600 capitalize text-sm"
                  >
                    Contact Type
                    <span className="text-medium leading-12 font-semibold">
                      {" "}
                      *
                    </span>
                  </label>

                  <CustomSelect
                    required
                    name={`contact_type_${uid}`}
                    onChange={(e) => handleFieldChange(e, uid)}
                    id={`contact_type_${uid}`}
                    options={options?.contactTypes}
                    defaultValue={options?.contactTypes?.find(({ label }) => label == contact_type_name)?.value}
                    placeholder="Select Contact.."
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />

                </div>
                <div
                  className="w-full flex flex-col items-left  justify-  gap-1 gap-x-3 mb-3"

                >
                  <label
                    htmlFor={`contact_${uid}`}
                    className="text-gray-600 capitalize text-sm"
                  >
                    Contact Details
                    <span className="text-medium leading-12 font-semibold">
                      {" "}
                      *
                    </span>
                  </label>
                  <div className='flex gap-2 w-full'>
                   
                    
                      <input
                        required
                        type="text"
                        name={`contact_${uid}`}
                        onChange={(e) => handleFieldChange(e, null)}
                        id={`contact_${uid}`}
                        defaultValue={contact}
                        placeholder='Enter Contact'
                        pattern={
                          (() => {
                            const label = options?.contactTypes?.find(({ label }) => label == contact_type_name)?.label
                            // console.log({label})
                            switch(label ?? contactTypeLabel) {
                              case "EMAIL":
                                return "[a-z0-9]+[.]*[\\-]*[a-z0-9]+@[a-z0-9]+[\\-]*[.]*[a-z0-9]+[.][a-z]{2,}"
                              case "MOBILE":
                                return '[0-9]{10}'
                              default:
                                return null

                            }
                          })()
                        }
                        className="flex-none w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                      />

                    

                    <button
                      id={`delete-btn-${uid}`}
                      onClick={ev => {

                        ev.preventDefault();

                        setContacts(prev => {
                          delete prev[uid]
                          return prev.filter(({ uid: id }) => id !== uid)
                        })

                      }}
                    >
                      <XCircleIcon className='w-7 h-7 text-red-400' />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky top-0 right-10 w-full flex justify-end">
          <button
            className="bg-gray-500 rounded p-2 text-white flex text-md font-semibold mt-3"
            onClick={handleAddContact}
          >
            {`Add Contact`}
          </button>
        </div>

        {/* Cancel and Save Changes */}
        <div className="flex justify-end items-center w-full mt-3">


          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-end space-x-2 bg-gray-500 rounded  p-1 px-2"
          >
            <span className="text-medium font-semibold text-white">
              {
                submitting ?
                  <Spinner />
                  :
                  'Save and Finish'

              }
            </span>
            {
              submitting &&
              <span className='text-white'>Saving.. </span>
            }

          </button>

        </div>



      </div>
    </form>

  )
}

function EditCommunityUnitsCHEWSForm(props) {


  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formError, setFormError] = useState(null)

  const derivedHealthWorkers = props?.health_unit_workers?.map((obj) => ({...obj, uid: uuid()}))

  const [healthUnitWorkers, setHealthUnitWorkers] = useState(derivedHealthWorkers)
  const alert = useAlert()


  function handleFormSubmit(event) {

    event.preventDefault()

    setSubmitting(true)


    const formData = new FormData(event.target)
    const formDataObject = Object.fromEntries(formData)

    const payload = Object.keys(formDataObject)?.filter(k => /first_name_.*/.test(k)).map(() => ({}))

    const formDataEntries = Object.entries(formDataObject)

    formDataEntries.forEach((entry) => {
      if (/^first_name_.*/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['first_name'] = entry[1];
      if (/^last_name_.*/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['last_name'] = entry[1];
      if (/^mobile_no_.*/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['mobile_no'] = entry[1];
      if (/^email_.*/.test(entry[0])) payload[parseInt(entry[0].split('_').at(-1))]['email'] = entry[1];


    })


    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.id}/`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${props?.token}`
        },
        method: 'PATCH',
        body: JSON.stringify({ health_unit_workers: payload })
      })

        .then(async resp => {
          if (resp.status == 200) {

            setSubmitting(false)

            alert.success(`${props?.name} Community Health Workers Updated successfully`, {
              containerStyle: {
                backgroundColor: "green",
                color: "#fff"
              }
            })

          } else {
            // const detail = await resp.json()
            setSubmitting(false)
            // setFormError(Array.isArray(Object.values(detail)) && Object.values(detail).length == 1 && typeof Object.values(detail)[0] == 'string' && detail[0][0])
            alert.error('Unable to update Community Units health workers')
          }
        })
    }

    catch (e) {
      setSubmitting(false)
      alert.error('Error Occured: ' + e.message)
    }
  }



  function handleDelete(event, index, id) {
    event.preventDefault();

    setDeleting(true)


    const firstName = healthUnitWorkers.find(({uid}) => uid === id)?.first_name
    const lastName = healthUnitWorkers.find(({uid}) => uid === id)?.last_name
    
    if(id && firstName !== "" && lastName !== ""){

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/workers/${id}/`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${props?.token}`
      },
      method: 'DELETE',
    })

      .then(resp => {
        if (resp.status == 204) {

        setDeleting(false)
        setHealthUnitWorkers(prev => {
      
          delete prev[index]
          return prev.filter(({uid}) => uid !== index)
        })
          

          alert.success(`${props?.health_unit_workers[index]?.name} has been deleted successfully`)
        } else {
          resp.json().then(({ detail }) => {
            alert.error('Unable to delete health worker', { timeout: 10000 })
            setDeleting(false)
            setFormError(detail)

          })
          // console.log({error})

        }
      })
      .catch(e => {
        setDeleting(false)
        console.error(e.message)
      })
    } else {
      setHealthUnitWorkers(prev => {
      
        delete prev[index]
        return prev.filter(({uid}) => uid !== index)
      })
    }


  }


  function handleAddCHEW(e) {
    e.preventDefault()
    setHealthUnitWorkers(prev => [...prev, { first_name: "", last_name: "", is_incharge: "", uid: uuid() }])
  }

  return (
    <form
      name="chews_form"
      className="flex flex-col p-3 h-full bg-gray-50 w-full items-start justify-start gap-1"
      onSubmit={handleFormSubmit}
    >
      {formError && <Alert severity='error' className={'w-full'}>Error when deleting: {formError}</Alert>}

      <div className='w-full flex flex-col items-between justify-start gap-1 my-2'>

        <div className="flex items-start justify-between">

          <div className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-x-5 flex-1 mb-2'>

            <label
              htmlFor='last_name'
              className='block text-sm font-medium text-gray-700'>
              First Name
            </label>

            <label
              htmlFor='last_name'
              className='block text-sm font-medium text-gray-700'>
              Second Name
            </label>

            <label
              htmlFor='mobile_no'
              className='block text-sm font-medium text-gray-700'>
              Mobile Phone Number*
            </label>

            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'>
              Email
            </label>

            <label
              htmlFor='last_name'
              className='block text-sm font-medium text-gray-700'>
              Delete
            </label>




          </div>

          <div className='flex flex-row justify-between gap-2'>

            <button className=' w-auto  bg-blue-600 p-2  rounded text-white flex text-md font-semibold '
              onClick={handleAddCHEW}
            >
              {`Add +`}

            </button>
          </div>


        </div>

        {Array.isArray(healthUnitWorkers) && healthUnitWorkers.length > 0 ? (
          healthUnitWorkers?.map(({ first_name, last_name, mobile_no, email, uid }, index) => {
            return (
              <div key={uid} className="flex items-start justify-between">

                <div className='w-full grid md:grid-cols-5 mx-auto place-content-start gap-x-4'>
                  {/* First Name */}

                  <input
                    required
                    type="text"
                    id={`first_name_${uid}_${index}`}
                    name={`first_name_${uid}_${index}`}
                    defaultValue={first_name}
                    placeholder='First Name'
                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />

                  {/* Second Name */}
                  <input
                    required
                    type="text"
                    id={`last_name_${uid}_${index}`}
                    name={`last_name_${uid}_${index}`}
                    placeholder='Second Name'
                    defaultValue={last_name}

                    className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-400 rounded focus:shadow-none focus:bg-white focus:border-black outline-none"
                  />

                  {/* Phone Number */}
                  <input
                    required
                    type='tel'
                    pattern={'[0-9]{10}'}
                    placeholder={'07XXXXXXXX'}
                    name={`mobile_no_${uid}_${index}`}
                    defaultValue={mobile_no}

                    className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                  />

                  {/* Email */}

                  <input
                    required
                    type='email'
                    name={`email_${uid}_${index}`}
                    defaultValue={email}
                    placeholder="user@email-domain"
                    pattern="[a-z0-9]+[.]*[\-]*[a-z0-9]+@[a-z0-9]+[\-]*[.]*[a-z0-9]+[.][a-z]{2,}"
                    className='flex-none  md:max-w-min w-auto bg-transparent  p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                  />

                  {/* Delete Button */}

                  {/* Delete CHEW */}
                  <div className='flex'>
                    <div className='flex items-center'>
                      {/* insert red button for deleting */}
                      <button
                        name='delete'
                        type='button'
                        className='bg-transparent group hover:bg-red-500 text-red-700 font-semibold hover:text-white p-3 hover:border-transparent '
                        onClick={(e) => handleDelete(e, index, uid)}
                        data-id={props?.health_unit_workers[index]?.id}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500 group-hover:text-white" />
                      </button>
                    </div>
                  </div>


                </div>

                <div className='flex flex-row justify-between gap-x-2'>

                  <span disabled={true} className=' w-auto bg-transparent p-1 text-white flex text-md font-semibold '
                  >
                    {`Add +`}

                  </span>
                </div>

              </div>

            )
          })
        ) : (
          <>
            <li className="w-full rounded  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
              <p>No Community health unit workforce found </p>
            </li>
          </>
        )}


      </div>

      {/* Save Changes */}
      <div className="flex justify-end items-center w-full">

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-end space-x-2 bg-gray-500 rounded  p-1 px-2"
        >
          <span className="text-medium font-semibold text-white">
            {
              submitting ?
                <Spinner />
                :
                'Save and Finish'
            }
          </span>
          {
            submitting &&
            <span className='text-white'>Saving </span>


          }

        </button>
      </div>
    </form>

  )

}


function EditCommunityUnitsServicesForm(props) {

  const currentServices = props?.services?.map(({ name: label, service: value }) => ({ label, value })) ?? []

  const options = useContext(ChuOptionsContext)

  const [submitting, setSubmitting] = useState(false)


  const serviceOptions = ((_services) => {

    const _serviceOptions = []
    let _values = []
    let _subCtgs = []

    if (_services.length > 0) {
      _services.forEach(({ category_name: ctg }) => {
        let allOccurences = _services.filter(({ category_name }) => category_name === ctg)

        allOccurences.forEach(({ id, name }) => {
          _subCtgs.push(name)
          _values.push(id)
        })

        if (_serviceOptions.map(({ name }) => name).indexOf(ctg) === -1) {
          _serviceOptions.push({
            name: ctg,
            subCategories: _subCtgs,
            value: _values
          })
        }

        _values = []
        _subCtgs = []

      })
    }




    return _serviceOptions.map(({ name, subCategories, value }) => ({
      label: name,
      options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
    }))

  })(options?.services ?? [])


  function handleSubmit(payload, selectedItems, chulId) {
    // console.log({stateSetters, chulId})
    const _payload = selectedItems.map(({ value }) => ({ service: value }))

    _payload.forEach(obj => obj['health_unit'] = chulId)



    if (_payload & payload) {
      try {
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${props?.id}/`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${props?.token}`
          },
          method: 'POST',
          body: JSON.stringify({ services: _payload, ...payload })
        })

      }
      catch (e) {
        console.error(e.message)
      }
    }

  };


  function handleCHUServiceUpdate(payload, selectedServices, chulId) {

    const _payload = selectedServices.map(({ value }) => ({ service: value }))

    _payload.forEach(obj => obj['health_unit'] = chulId)



    try {
      return fetch(`${process.env.NEXT_PUBLIC_API_URL}/chul/units/${chulId}/`, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${props?.token}`
        },
        method: 'PATCH',
        body: JSON.stringify({ services: _payload, ...payload })
      })

    }
    catch (e) {
      console.error(e.message)
    }
  }




  return (
    <>
      <h4 className='text-lg uppercase pb-2 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900'>
        Services Offered
      </h4>



      <div
        name='chu_services_form'
        className='flex flex-col w-full items-start justify-start gap-3'
      >
        <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

          {/* Edit list Item Container */}
          <div className='flex items-center w-full h-auto min-h-[300px]'>


            <EditListItem
              itemData={{ currentServices, ...props }}
              categoryItems={serviceOptions[0]?.options} //serviceOptions
              itemId={props?.id} //chulId
              token={props?.token}
              handleItemsSubmit={handleSubmit} //handleCHUServiceSubmit
              handleItemsUpdate={handleCHUServiceUpdate} //handleServiceUpdates
              setSubmitting={setSubmitting}
              submitting={submitting}
              options={serviceOptions[0]?.options}
              itemName={'chul_services'}
              handleItemPrevious={() => null}
              setFormId={() => null}
              editMode
            />

          </div>
        </div>
      </div>
    </>
  );



}


export function CommunityUnitEditForm(props) {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <MainLayout>
      <div className="w-full md:w-[85%] px-4 grid grid-cols-1 md:grid-cols-7 place-content-center md:grid gap-4 md:p-2 my-6">
        <div className="md:col-span-7 flex flex-col items-start justify-start gap-3">

          {/* Breadcrumb */}
          <div className="flex flex-row gap-2 text-sm md:text-base">
            <Link className="text-gray-700" href="/">
              Home
            </Link>
            {"  >  "}
            <Link className="text-gray-700" href="/community-units">
              Community units
            </Link>
            {"  >  "}
            <span className="text-gray-500">
              {props?.props?.name} ( #
              <i className="text-black">{props?.props?.code || "NO_CODE"}</i> )
            </span>
          </div>

          {/* Header snippet */}
          <div
            className={
              `md:col-span-7 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full border ${props?.props?.active ? "border-gray-400 rounded" : "border-red-600"} bg-transparent drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
              ${props?.props?.active ? "border-gray-400 rounded" : "border-yellow-700"}
            `}
          >



            <div className="col-span-6 md:col-span-3">
              <Link href={`/community-units/${props?.props?.id}`} className="text-4xl tracking-tight font-bold leading-tight">
                {props?.props?.name}
              </Link>
              <div className="flex gap-2 items-center w-full justify-between">
                <span
                  className={
                    "font-bold text-2xl " +
                    (props?.props?.code ? "text-gray-900" : "text-gray-500")
                  }
                >
                  #{" "}{props?.props?.code ?? "NO_CODE"}
                </span>

              </div>
            </div>

            {/* Info snippet */}
            <div className="flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2">
              <div className="flex flex-wrap gap-3 w-full items-center justify-start md:justify-center">
                {props?.props?.is_approved ? (
                  <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    CHU Approved
                  </span>
                ) : (
                  <span className="bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <XCircleIcon className="h-4 w-4" />
                    Not approved
                  </span>
                )}
                {props?.props?.is_closed && (
                  <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <LockClosedIcon className="h-4 w-4" />
                    CHU Closed
                  </span>
                )}
                {props?.props?.deleted && (
                  <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <XCircleIcon className="h-4 w-4" />
                    CHU Deleted
                  </span>
                )}
                {props?.props?.active && (
                  <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    CHU Active
                  </span>
                )}
                {props?.props?.has_edits && (
                  <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                    <InformationCircleIcon className="h-4 w-4" />
                    Has changes
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2">
              {''}
            </div>
          </div>

        </div>

        {/* Community Unit Side Menu */}

        <div className="hidden md:col-span-1 md:flex md:mt-8">
          <CommunityUnitSideMenu
            qf={'all'}
            filters={[]}
            _pathId={''}

          />
        </div>

        <button className='md:hidden relative p-2 border border-gray-800 rounded w-full self-start my-4' onClick={() => setIsMenuOpen(!isMenuOpen)}>
          Community Health Unit Menu
          {
            !isMenuOpen &&
            <KeyboardArrowRight className='w-8 aspect-square text-gray-800' />
          }

          {
            isMenuOpen &&
            <KeyboardArrowDown className='w-8 aspect-square text-gray-800' />
          }

          {
            isMenuOpen &&
            <CommunityUnitSideMenu
              qf={'all'}
              filters={[]}
              _pathId={''}

            />
          }
        </button>





        {/* Form */}
        <div className="col-span-1 md:col-span-6 flex flex-col md:gap-3 mt-2 md:mt-8 bg-gray-50 rounded shadow-md pt-2">
          <Tabs.Root
            orientation="horizontal"
            className="w-full flex flex-col tab-root"
            defaultValue="basic_details"
          >
            {/* Tabs List */}
            <Tabs.List className="list-none w-full flex justify-between md:justify-start border-b border-gray-400  md:grid md:grid-cols-3  flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold">
              <Tabs.Tab
                value="basic_details"
                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
              >
                Basic Details
              </Tabs.Tab>
              <Tabs.Tab
                value="chews"
                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
              >
                CHAs
              </Tabs.Tab>
              <Tabs.Tab
                value="services"
                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
              >
                Services
              </Tabs.Tab>
            </Tabs.List>

            {/* Panel List */}

            {/* Basic Details Panel */}
            <Tabs.Panel
              value="basic_details"
              className="grow-1 p-3 mx-auto w-full tab-panel"
            >
              <EditCommunityUnitsBasicDeatilsForm {...props?.props} />
            </Tabs.Panel>

            {/* Chews Panel */}
            <Tabs.Panel value="chews" className="grow-1 p-3 mx-auto w-full tab-panel">
              <EditCommunityUnitsCHEWSForm {...props?.props} />
            </Tabs.Panel>

            {/* Services Panel */}
            <Tabs.Panel
              value="services"
              className="grow-1 p-3 mx-auto w-full tab-panel"
            >
              <EditCommunityUnitsServicesForm {...props?.props} />

            </Tabs.Panel>

          </Tabs.Root>
        </div>

      </div>
    </MainLayout>
  )

}