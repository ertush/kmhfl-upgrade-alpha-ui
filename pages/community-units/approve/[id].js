import React, { useState, useEffect, /*useContext*/ } from 'react';
import Head from 'next/head';
import MainLayout from '../../../components/MainLayout';
import { checkToken } from '../../../controllers/auth/auth';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { CheckCircleIcon, ChevronRightIcon, InformationCircleIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/solid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/router'
import CommunityUnitSideMenu from '../../../components/CommunityUnitSideMenu';
import Spinner from '../../../components/Spinner'
import { useAlert } from 'react-alert';
import Alert from '@mui/material/Alert'
import {z} from 'zod'
import withAuth from '../../../components/ProtectedRoute';
import {v4 as uuid} from 'uuid'
import Link from 'next/link';


function ApproveCommunityUnit(props) {

  const router = useRouter();
  let cu = props.data;

  const alert = useAlert()

  const [isCHULDetails, setIsCHULDetails] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [formError, setFormError] = useState(null)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false)


  const columns = [
    { label: 'Field', minWidth: 100, id: uuid()},
    { label: 'Old Value', minWidth: 100, id: uuid() },
    { label: 'New Value', minWidth: 100, id: uuid()}
  ];

  const CHULDetails = [
    { value: `${cu.facility_subcounty}`, label: 'Sub County ', id: uuid()},
    { value: `${cu.facility_constituency}`, label: 'Constituency', id: uuid()  },
    { value: `${cu.facility_ward}`, label: 'Ward', id: uuid()  },
    { value: `${cu.households_monitored}`, label: 'Households Monitored', id: uuid()  },
  ];

  const CHU_MainDetails = [
    { value: `${cu.status_name}`, label: 'Functional Status', id: uuid()},
    { value: `${cu.code}`, label: 'CHU Code', id: uuid()},
    { value: `${cu.number_of_chvs}`, label: 'Number of CHVs', id: uuid() },
    { value: `${cu.facility_name}`, label: 'Linked Facility', id: uuid() },
    { value: `${cu.facility_county}`, label: 'County', id: uuid() },
  ]



 function approveCHU (e, token) {

    e.preventDefault();
    

    if (e.target.name == 'btn_approve_chu') setIsSubmittingApproval(true);
    if (e.target.name == 'btn_reject_chu') setIsSubmittingRejection(true);
    


    const rejection_approval_reason = document.getElementsByName('rejection_approval_reason')[0].value

  
    let payload = {}

    if (e.target.name == 'btn_approve_chu') {

      payload = {
        approval_comment: rejection_approval_reason,
        is_rejected: false,
        is_approved: true
      }
    } else if (e.target.name == 'btn_reject_chu') {
      
      payload = {
        rejection_reason: rejection_approval_reason,
        is_rejected: true,
        is_approved: false
      }
    }

  
    let url = `${process.env.NEXT_PUBLIC_API_URL}/chul/units/${cu?.id}/` // `/api/common/submit_form_data/?path=approve_chul&id=${id}`
    

    

      fetch(url, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`
  
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(resp => resp)
        .then(async(res) => {
  
          if(res.ok) {
            alert.success(`${payload.is_rejected ? 'Rejected' : 'Approved'} CHU successfully`)
            router.push({
              pathname: '/community-units',
              query: {}
            })
          } else {
            alert.error(`Unable to approve CHU`)
             
             const detail = await res.json()

             const error = Object.entries(detail)?.map(([k, v]) => ([k, v]))?.join(":")

             if(error) throw new Error(error.replace(',', ':'))
  
            //  const error = Array.isArray(Object.values(detail)) && Object.values(detail).length == 1 ? detail[Object.keys(detail)[0]][0] : ''
  
          }
         
  
        })
        .catch(e => {
          setFormError(e.message)
          console.error(e.message)
        })
        .finally(() => {

          if (e.target.name == 'btn_approve_chu') setIsSubmittingApproval(false);
          if (e.target.name == 'btn_reject_chu') setIsSubmittingRejection(false);
        })
   
}

// approveCHUUpdates(e,  true, props?.token)}

async function approveCHUUpdates (e, token) {
  e.preventDefault();

  // console.log({status})

  console.log(formError)


  let payload = ''
  if (e.target.name == 'btn_approve_chu_updates') {
    setIsSubmittingApproval(true)
    payload = { is_approved: true }
  } else if(e.target.name == 'btn_reject_chu_updates') {
    setIsSubmittingRejection(true)
    payload = { is_rejected: true }
  }

  let url = `${process.env.NEXT_PUBLIC_API_URL}/chul/updates/${cu?.latest_update}/` //`/api/common/submit_form_data/?path=approve_chul_updates&latest_updates=${id}`
  
  try {
    await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`

      },
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
      .then(resp => ({resp, data: resp.json()}))
      .then(async ({resp, data}) => {


        if(resp.ok) {

          alert.success(`${payload.is_rejected ? 'Rejected' : 'Approved'} CHU Updates successfully`)

          router.push({
            pathname: '/community-units',
            query: { has_edits: false, pending_approval: true }
          })
  
        } else {
          alert.error(`Unable to approve CHU Updates`)
             
             const detail = await data

             const error = Object.entries(detail)?.map(([k, v]) => ([k, v]))?.join(":")

             if(error) throw new Error(error.replace(',', ':'))

        }
        
      })
      .catch(e => {
        setFormError(e.message)
      })
  } catch (e) {

    console.error(e)
  } finally {
    if (e.target.name == 'btn_approve_chu_updates') setIsSubmittingApproval(false)
    else if(e.target.name == 'btn_reject_chu_updates') setIsSubmittingRejection(false)
    
  }

} 


  useEffect(() => {
  

    setIsClient(true)
  }, [])


  if (isClient) {

    return (
      <>
        <Head>
          <title>KMHFR | {cu?.name || cu?.official_name}</title>
          <link rel='icon' href='/favicon.ico' />
          {/* <link rel='stylesheet' href='/assets/css/leaflet.css' /> */}
        </Head>

        <MainLayout>
          <div className='w-full md:w-[85%] grid md:grid-cols-7 gap-4 p-2 my-6'>
            <div className='col-span-5 flex flex-col md:col-span-7 items-start justify-start gap-3'>

              {/* Breadcrumb */}
              <div className='flex flex-row gap-2 text-sm md:text-base'>
                <a className='text-gray-700' href='/'>
                  Home
                </a>
                {'/'}
                <a className='text-gray-700' href='/community-units'>
                  Community units
                </a>
                {'/'}
                <span className='text-gray-500'>
                  {cu.name} ( #
                  <i className='text-black'>{cu.code || 'NO_CODE'}</i> )
                </span>
              </div>

              {/* Header snippet */}
              <div
                className={`col-span-5 grid grid-cols-6 gap-5 md:gap-8 py-6 w-full border ${cu.active ? 'border-gray-600' : 'border-yellow-600'} bg-transparent drop-shadow text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 ${cu.active ? 'border-gray-600' : 'border-yellow-600'}`}
              >
                <div className='col-span-6 md:col-span-3'>
                  <Link href={`/community-units/${cu.id}`} className='text-4xl tracking-tight font-bold leading-tight'> {cu.name} </Link>
                  <div className='flex gap-2 items-center w-full justify-between'>
                    <span className={'font-bold text-2xl ' + (cu.code ? 'text-gray-900' : 'text-gray-400')}> #{cu.code || 'NO_CODE'} </span>
                    <p className='text-gray-600 leading-tight'>
                      {cu.keph_level_name && 'KEPH ' + cu.keph_level_name}
                    </p>
                  </div>
                </div>

                {/* Info snippet */}
                <div className='flex flex-wrap gap-3 items-center justify-end col-span-6 md:col-span-2'>
                  <div className='flex flex-wrap gap-3 w-full items-center justify-start md:justify-center'>
                    {cu?.is_approved && (
                      <span className={'p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1' + ' ' + (cu.is_approved ? 'bg-blue-200 text-gray-900' : 'bg-red-200 text-red-900')}>
                        {cu.is_approved ? <>  <CheckCircleIcon className='h-4 w-4' />CHU Approved</> : <><XCircleIcon className='h-4 w-4' />Not approved </>}
                      </span>
                    )}
                    {cu?.is_closed && (
                      <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <LockClosedIcon className='h-4 w-4' />
                        CHU Closed
                      </span>
                    )}
                    {cu?.deleted && (
                      <span className='bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <XCircleIcon className='h-4 w-4' />
                        CHU Deleted
                      </span>
                    )}
                    {cu?.active && (
                      <span className='bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <CheckCircleIcon className='h-4 w-4' />
                        CHU Active
                      </span>
                    )}
                    {cu?.has_fffedits && (
                      <span className='bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <InformationCircleIcon className='h-4 w-4' />
                        Has changes
                      </span>
                    )}
                    {cu?.is_rejected && (
                      <span className='bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1'>
                        <InformationCircleIcon className='h-4 w-4' />
                        CHU Rejected
                      </span>
                    )}
                  </div>
                </div>
                <div className='col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2'>
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


            <div className="col-span-5 md:col-span-6 flex flex-col gap-3 mt-8 mx-3">
              <h3 className="text-2xl tracking-tight font-semibold leading-5">
                Approve/Reject Community Unit
              </h3>

              {/* CHU details */}
              <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-4">
                {CHU_MainDetails.map(({label, value, id}) => {
              
                  return (

                  <div key={id} className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                      {label}
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                      {value || " - "}
                    </p>
                  </div>
                )})}

                {cu.date_established && (
                  <div className="grid grid-cols-3 w-full md:w-11/12 leading-none items-center">
                    <label className="col-span-1 text-gray-600">
                      Date established
                    </label>
                    <p className="col-span-2 text-black font-medium text-base">
                      {new Date(cu.date_established).toLocaleDateString(
                        "en-GB",
                        { year: "numeric", month: "long", day: "numeric" }
                      ) || " - "}
                    </p>
                  </div>
                )}
              </div>


              {/* CHU details hidden section */}
              <div className="flex w-full leading-none mt-4 items-center">
                <button className="flex bg-blue-700 font-semibold text-white flex-row justify-between text-left items-center p-3 h-auto -md" onClick={() => {
                  if (isCHULDetails) {
                    setIsCHULDetails(false)
                  } else {
                    setIsCHULDetails(true)
                  }
                }}>
                  View More Community Unit Details
                  {
                    isCHULDetails ? (
                      <ChevronRightIcon className="text-white h-7 w-7 font-bold" />
                    ) : (
                      <ChevronDownIcon className="text-white h-7 w-7 text-base font-bold" />
                    )
                  }
                </button>
              </div>

              {!isCHULDetails && (
                <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-6">
                  {CHULDetails.map(({label, value, id}) => {
                    
                    return (
                    <div key={id} className="grid grid-cols-3 w-full md:w-11/12  leading-none items-center">
                      <label className="col-span-1 text-gray-600">{label}</label>
                      <p className="col-span-2 text-black font-medium text-base">
                        {value || " - "}
                      </p>
                    </div>
                  )})}
                </div>
              )
              }


              {/* Pending updates approval */}
              {cu?.pending_updates && Object.keys(cu?.pending_updates).length > 0 && (
                <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-6">
                  {/* <pre>
                    {
                      JSON.stringify(cu.pending_updates, null, 2)
                    }
                  </pre> */}
                  <h3 className="text-gray-900 font-semibold leading-16 text-medium">
                    Pending Updates
                  </h3>

                  {formError && <Alert severity="error" sx={{ width: '100%', marginY: '15px' }}>{formError}</Alert>}

                  <form
                    className="space-y-3"
                    name="chu_approve_reject_updates"
                  >
                    <div className='col-span-4 w-full h-auto'>
                      {
                        Object.keys(cu.pending_updates).reverse().map((key) => {
                          const id = uuid()

                          if (key == 'basic' && JSON.stringify(cu.pending_updates?.basic) !== '{}') {
                            return (
                              <React.Fragment key={id}>


                                <h5 className='col-span-1 text-gray-900 pb-2 font-semibold leading-16 text-medium mt-5'>{'Basic :'}</h5>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                  <Table stickyHeader aria-label="sticky table" className='bg-transparent'>
                                    <TableHead >
                                      <TableRow >
                                        {columns.map((column) => {
                                          
                                          return (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, fontWeight: 600 }}
                                          >
                                            {column.label}
                                          </TableCell>
                                        )})}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody sx={{ paddingX: 4 }}>
                                      {/* basic name */}
                                      {cu.pending_updates?.basic.name !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Name'}</TableCell>
                                            <TableCell align="left">{cu.name}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.name}</TableCell>

                                          </TableRow>
                                        )}
                                      {/* basic status */}
                                      {cu.pending_updates?.basic.status !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Status'}</TableCell>
                                            <TableCell align="left">{cu.status_name}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.status.status_name}</TableCell>

                                          </TableRow>
                                        )
                                      }
                                      {/* facility name */}
                                      {cu.pending_updates?.basic.facility !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Facility'}</TableCell>
                                            <TableCell align="left">{cu.facility_name}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.facility.facility_name}</TableCell>

                                          </TableRow>
                                        )
                                      }
                                      {/* Households monitored */}
                                      {cu.pending_updates?.basic.households_monitored !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Households Monitored'}</TableCell>
                                            <TableCell align="left">{cu.households_monitored}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.households_monitored}</TableCell>

                                          </TableRow>
                                        )
                                      }
                                      {/* CHVs */}
                                      {cu.pending_updates?.basic.number_of_chvs !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Number of CHVs '}</TableCell>
                                            <TableCell align="left">{cu.number_of_chvs}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.number_of_chvs}</TableCell>

                                          </TableRow>
                                        )
                                      }
                                      {/* Location */}
                                      {cu.pending_updates?.basic.location !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Location'}</TableCell>
                                            <TableCell align="left">{cu.location}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.location}</TableCell>

                                          </TableRow>
                                        )
                                      }
                                      {/* Date established */}
                                      {cu.pending_updates?.basic.date_etablished !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Date Established'}</TableCell>
                                            <TableCell align="left">{cu.date_etablished}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.date_etablished}</TableCell>

                                          </TableRow>
                                        )
                                      }
                                      {/* date_operational */}
                                      {cu.pending_updates?.basic.date_operational !== undefined &&
                                        (

                                          <TableRow hover role="checkbox" tabIndex={-1}>

                                            <TableCell align="left">{'Date Operational'}</TableCell>
                                            <TableCell align="left">{cu.date_operational}</TableCell>
                                            <TableCell align="left">{cu.pending_updates.basic.date_operational}</TableCell>

                                          </TableRow>
                                        )
                                      }


                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </React.Fragment>
                            )
                          }
                          if (key == 'services') {

                            const services = cu.pending_updates['services'].map((item) => {
                              const id = uuid()
                              return <div className='col-span-4 w-full h-auto ml-7 mt-2' key={id} >
                                <div className='grid grid-cols-2 w-full'>
                                  <p className='col-span-2 text-gray-600 font-medium text-base'>{item.name}</p>
                                </div>
                              </div>
                            })
                            return <><h5 className='col-span-1 text-gray-900  font-semibold leading-16 text-medium mt-5'>{'Services :'}</h5><hr />{services}</>

                          }
                          if (key == 'workers') {
                            const workers = cu.pending_updates['workers'].map((item) => {
                              // const id = uuid()

                              return <div className='col-span-4 w-full h-auto ml-7 mt-2' key={item.id}>
                                <div className='grid grid-cols-2 w-full'>
                                  <p className='col-span-2 text-gray-600 font-medium text-base'>{item.first_name} {' '} {item.last_name} {'(In Charge)'}</p>
                                </div>
                              </div>
                            })
                            return <><h5 className='col-span-1 text-gray-900  font-semibold leading-16 text-medium mt-5'>{'Workers :'}</h5><hr />{workers}</>
                          }


                        })

                      }
                    </div>
                    {/* submit buttons */}
                    <div className="flex flex-row justify-start items-center space-x-3 p-3">
                      <button
                        type="submit"
                        disabled={(isSubmittingApproval || isSubmittingRejection)}
                        name="btn_approve_chu_updates"
                        className={"p-2 text-center font-semibold text-base text-white bg-blue-700"}
                        onClick={(e) => approveCHUUpdates(e, props?.token)}
                      >
                         {
                          isSubmittingApproval ?
                            <div className='flex items-center gap-2'>
                              <Spinner />
                              <span className='text-white'>Approving.. </span>
                            </div>
                            :
                            "Approve CHU Updates"

                        }
                        
                      </button>
                      <button
                        type="submit"
                        disabled={(isSubmittingRejection || isSubmittingApproval)}
                        name="btn_reject_chu_updates"
                        className={"p-2 text-center font-semibold text-base text-white bg-black"}
                        onClick={(e) => approveCHUUpdates(e, props?.token)}
                      >
                        {
                          isSubmittingRejection ?
                            <div className='flex items-center gap-2'>
                              <Spinner />
                              <span className='text-white'>Rejecting.. </span>
                            </div>
                            :
                            "Reject CHU Updates"

                        }
                        
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CHU Rejection Commment */}
              {cu?.pending_updates && Object.keys(cu?.pending_updates).length == 0 && (

                <div className="bg-gray-50  shadow-lg border border-gray-300/70 w-full p-3  flex flex-col gap-3 mt-6">
                  <h3 className="text-gray-900 font-semibold leading-16 text-medium">Approval comment: </h3>
                  {/* {cu.is_approved} */}
                  {formError !== null && <Alert severity="error" sx={{ width: '100%', marginY: '15px' }}>{formError}</Alert>}
                  <form
                    className="space-y-3"
                    name="chu_approve_reject_form"
                    // onSubmit={(e) => approveCHU(e, props?.token)}
                  >
                    <label htmlFor="comment-text-area"></label>
                    <textarea
                      cols="100%"
                      rows="auto"
                      name="rejection_approval_reason"
                      className="flex bg-transparent w-full col-span-2 rounded border border-gray-400 md text-gray-600 font-normal text-medium p-2"
                      placeholder="Enter a comment"
                      // onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>

                    {/* <div className="flex flex-row"> */}
                    <div className="flex flex-row justify-start gap-3 items-center ">
                    
                      <button
                        type="submit"
                        disabled={isSubmittingApproval}
                        name="btn_approve_chu"
                        className={"p-2 text-center  font-semibold text-base text-white bg-blue-700"}
                        onClick={(e) => approveCHU(e, props?.token)}
                      >
                        {
                          isSubmittingApproval ?
                            <div className='flex items-center gap-2'>
                              <Spinner />
                              <span className='text-white'>Approving.. </span>
                            </div>
                            :
                             "Approve Community Health Unit" // cu.is_approved ? "" :
                        }

                      </button>
                      <button
                        type="submit"
                        name="btn_reject_chu"
                        disabled={isSubmittingRejection}
                        className={cu.is_rejected ? '' : "p-2 text-center font-semibold text-base text-white bg-red-500"}
                        onClick={(e) => approveCHU(e, props?.token)}
                      >
                        {
                          isSubmittingRejection ?
                            <div className='flex items-center gap-2'>
                              <Spinner />
                              <span className='text-white'>Rejecting.. </span>
                            </div>
                            :
                             "Reject Community Health Unit" // cu.is_rejected ? "" :
                        }

                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
            
          </div>
        </MainLayout >
      </>
    );
  }
  else {
    return null;
  }
};


export async function getServerSideProps(ctx) {

  const zSchema = z.object({
    id: z.string('Should be a uuid string').optional(),
  })

  const queryId = zSchema.parse(ctx.query).id


  if (ctx.query.q) {
    const query = ctx.query.q;

    if (typeof window !== 'undefined' && query.length > 2) {
      window.location.href = `/community-units?q=${query}`;
    } else {
      if (ctx.res) {
        ctx.res.writeHead(301, {
          Location: '/community-units?q=' + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }

  const response = (() => checkToken(ctx.req, ctx.res)
    .then(async (t) => {
      if (t.error) {
        throw new Error('Error checking token');
      }
      else {
        // Fetching the required token
        let token = t.token;

        // Prefetch the facility data details
        let facility_url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/?fields=id,name,county,sub_county_name,constituency,ward_name&page=1&page_size=500`;

        const response = await fetch(facility_url, {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
          },
        })

        let facility_data = await response.json();
        if (facility_data.error) {
          throw new Error('Error fetching facility data');
          window.location.reload();
        }

        // Fetch the service options
        let service_url = `${process.env.NEXT_PUBLIC_API_URL}/chul/services/?page_size=100&ordering=name`;

        const service_response = await fetch(service_url,
          {
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
            },
          })

        let service_categories = await service_response.json();


        if (service_categories.error) {
          throw new Error('Error fetching the service categories');
        }

        // Fetching the details of the quieried chu
        let url = process.env.NEXT_PUBLIC_API_URL + '/chul/units/' + queryId + '/';

        return fetch(url, {
          headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
          },
        })
          .then((r) => r.json())
          .then((json) => {
            return {
              token: token,
              service_categories: service_categories,
              facility_data: facility_data,
              data: json,
            };
          })
          .catch((err) => {
            console.error('Error fetching facilities: ', err);
            return {
              error: true,
              err: err.message,
              data: [],
            };
          });
      }
    })
    .catch((err) => {
      // console.log('Error checking token: ', err);
      if (typeof window !== 'undefined' && window) {
        if (ctx?.asPath) {
          window.location.href = ctx?.asPath;
        }
        else {
          let token = t.token;
          let url = process.env.NEXT_PUBLIC_API_URL + '/chul/units/' + queryId + '/';
          return fetch(url, {
            headers: {
              Authorization: 'Bearer ' + token,
              Accept: 'application/json',
            },
          })
            .then((r) => r.json())
            .then((json) => {
              console.log(json);
              return {
                data: json,
                token,
              };
            })
            .catch((err) => {
              console.error('Error fetching facilities: ', err);
              return {
                error: true,
                err: err.message,
                data: [],
              };
            });
        }
      }
      console.log('My Error:' + err);

      return {
        error: true,
        err: err.message,
        data: [],
      };
    })
  )();

  return {
    props: response
  }

}

export default withAuth(ApproveCommunityUnit);
