import Head from "next/head";
import { checkToken } from "../../controllers/auth/auth";
import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../components/MainLayout";
import Link from 'next/link'
import { useRouter } from 'next/router';

import {
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/solid";


import dynamic from "next/dynamic";
// import router from "next/router";
import { UserContext } from "../../providers/user";
import FacilityDetailsTabs from "../../components/FacilityDetailsTabs";


import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {Formik, Form, Field} from 'formik'
import Typography from '@mui/material/Typography';
import FacilitySideMenu from "../../components/FacilitySideMenu";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

import { useAlert } from "react-alert";
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { ChevronRight } from "@mui/icons-material";



const Facility = (props) => {

  // const userPermissions = useContext(PermissionContext)
  // const userGroup = useContext(UserGroupContext)
  const userCtx = useContext(UserContext)


  const Map = dynamic(
    () => import("../../components/Map"), // replace '@components/map' with your component's location
    {
      loading: () => (
        <div className="text-gray-800 text-lg  bg-white py-2 px-5 shadow w-auto mx-2 my-3">
          Loading&hellip;
        </div>
      ),
      ssr: false, // This line is important. It's what prevents server-side render
    } 
  );


  const facility = props["0"]?.data;
  const wardName = props["0"]?.data?.ward_name;
  const center = props["1"]?.geoLocation?.center;
  const geoLocationData = props["1"]?.geoLocation;
  const qf = props["3"]?.qf ?? '';
  // const {facility_updated_json } = props["2"]?.updates;
  const filters = []


  const [user, setUser] = useState(userCtx);

  const [open, setOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCloseModal, setOpenCloseModal] = useState(true)
  const [isReasonRejected, setIsReasonRejected] = useState(false)
  const handleClose = () => setOpen(false);
  const handleCloseModal = () => {setOpenCloseModal(false); setIsClosingFacility(false)};


  const [khisSynched, setKhisSynched] = useState(false);
  const [facilityFeedBack, setFacilityFeedBack] = useState([])
  const [pathId, setPathId] = useState('') 
  const [allFctsSelected, setAllFctsSelected] = useState(false);
  const [title, setTitle] = useState('') 

  const [isViewChangeLog, setIsViewChangeLog] = useState(false)
  const [changeLogData, setChangeLogData] = useState(null)
  const [isClosingFacility, setIsClosingFacility] = useState(false)

  


  const _ = require('underscore')
  const alert = useAlert()
  const router = useRouter()

  const pathMenu = router.asPath.split('=')[1];

  const [isClient, setIsClient] = useState(false)
 
	useEffect(() => {
	  setIsClient(true)
    
    if (userCtx) setUser(userCtx); console.log({userCtx})
    return () => {
    };
  }, [isClosingFacility, isReasonRejected]);


    useEffect(() => {
      setUser(userCtx);
      if(user.id === 6){
        router.push('/auth/login')
      }
    }, [])
    if(isClient) {
      return (
        <>
          <Head>
            <title>KMHFR - {facility?.official_name ?? ""}</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="/assets/css/leaflet.css" />
          </Head>

          <MainLayout>

            <div className="w-full md:w-[85%] grid grid-cols-1 md:grid-cols-7 px-4 md:px-0 gap-3 my-4 place-content-center">
              {/* Closed Facility Modal */}

              {
                  facility?.closed && 
                  <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={open}
                      onClose={handleClose}
                      closeAfterTransition
                      slots={{backdrop:Backdrop}}
                    
                  >
                      <Fade in={open}>
                      <Box sx={
                          {
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: 400,
                              boxShadow: 24,
                              p: 4,
                          }
                      }
                      className="bg-gray-50 shadow-md"
                      >
                          <span className="flex gap-2">
                            <InformationCircleIcon className="w-7 h-7 text-red-500"/>
                            <Typography id="transition-modal-title" variant="h6" component="h2">      
                                Attention Facility is Closed     
                            </Typography>    
                          </span>
                            {
                              isReasonRejected && 
                              <span className="text-sm text-red-500">      
                                  Rejected because reason for reopening is not provided
                              </span>
                            }
                          
                          <div className="flex-col items-start">
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                              Please state the reason for reopening the facility
                            </Typography>
                            <Formik 
                            initialValues={
                              {
                                closing_reason: ''
                              }
                            }
                            onSubmit={async ({closing_reason}) => {
                        
                              if(closing_reason.length > 0){
                              try {
                                const resp = await fetch(`/api/common/submit_form_data?path=close_facility&id=${facility?.id}`, {
                                  headers: {
                                      'Accept': 'application/json, text/plain, */*',
                                      'Content-Type': 'application/json;charset=utf-8'
                      
                                  },
                                  method: 'POST',
                                  body: JSON.stringify({
                                    closed: false,
                                    closing_reason
                                  })
                              })

                            
                            

                              if(resp.ok){
                                  alert.success("Facility Reopened successfully")
                                  _.defer(() => {
                                    handleClose()

                                    router.push('/facilities')
                                  })
                              
                              }
        
                              }catch(e){
                                console.error(e.message)
                              }
                            }else{
                              setIsReasonRejected(true)
                            }
        
                            }} >

                              <Form className='my-3 flex-col gap-y-2'>
                                <Field
                                as='textarea'
                                cols={'30'}
                                rows={'6'}
                                name='closing_reason'
                                className='bg-transparent border border-gray-400 '
                                >
                                </Field>
                                <div className='flex justify-start gap-4 mt-4'>
                                    <button className="bg-gray-500 text-white font-semibold  p-2 text-center" type="submit">Reopen</button>
                                    <button className="bg-red-500 text-white font-semibold  p-2 text-center"  type="button" onClick={handleClose}>Cancel</button>
                                </div>
                              </Form>
                            </Formik>
                          </div>
                          
                      </Box>
                      </Fade>
                  </Modal>
              }

              {/* Modal for closing facility */}

              {
                isClosingFacility &&
                  <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={true}
                  onClose={handleCloseModal}
                  closeAfterTransition
                  slots={{backdrop:Backdrop}}
                
              >
                  <Fade in={true}>
                  <Box sx={
                      {
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 400,
                          borderLeft: 'solid 10px red',
                          boxShadow: 24,
                          p: 4,
                      }
                    }
                      className="bg-gray-50 shadow-md"

                  >
                      <span className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <InformationCircleIcon className="w-12 h-12 text-red-500 col-start-1"/>
                        <Typography id="transition-modal-title" variant="h6" component="h2" className="col-start-2 col-span-3">      
                          Are you sure you want to close <strong>{facility?.official_name}</strong>
                        </Typography>    
                      </span>
                      
                      <div className="flex-col items-start">
                      <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                          Please state the reason for closing this facility
                        </Typography>
                        <Formik 
                        initialValues={
                          {
                            closing_reason: ''
                          }
                        }
                        onSubmit={async ({closing_reason}) => {
                        
                          if(closing_reason.length > 0){
                          try {
                            const resp = await fetch(`/api/common/submit_form_data?path=close_facility&id=${facility?.id}`, {
                              headers: {
                                  'Accept': 'application/json, text/plain, */*',
                                  'Content-Type': 'application/json;charset=utf-8'
                  
                              },
                              method: 'POST',
                              body: JSON.stringify({
                                closed: true,
                                closing_reason
                              })
                          })
                        
                        
                            
                          if(resp.ok){
                              alert.success("Facility Closed successfully")
                              _.defer(() => {
                                handleCloseModal()

                                router.push('/facilities?qf=closed&closed=true')
                              })
                          
                          }

                          }catch(e){
                            console.error(e.message)
                          }
                        }

                        }} >

                          <Form className='my-3 flex-col gap-y-2'>
                            <Field
                            as='textarea'
                            cols={'30'}
                            rows={'6'}
                            name='closing_reason'
                            className='border-2 bg-transparent border-gray-400 '
                            >
                            </Field>

                            <div className="grid grid-rows-1 gap-2 mt-2">
                              <Typography>
                                Closing Date: {new Date().toLocaleDateString()} 
                              </Typography>

                            </div>

                            <div className='flex justify-start gap-4 mt-4'>
                                <button className="bg-red-500 text-white font-semibold  p-2 text-center" type="submit">Close Facility</button>
                                <button className="bg-indigo-500 text-white font-semibold  p-2 text-center" type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                          </Form>
                        </Formik>
                      </div>
                      
                      
                  </Box>
                  </Fade>
                 </Modal>
              }

              {/* Header */}
              <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start md:mb-6 gap-3">
                {/* Breadcramps */}
                <div className="flex flex-row gap-2 text-sm md:text-base md:my-3">
                  <Link className="text-gray-700" href="/">
                    Home
                  </Link>
                  {"/"}
                  <Link className="text-gray-700" href="/facilities">
                    Facilities
                  </Link>
                  {"/"}
                  <span className="text-gray-500">
                    {facility?.official_name ?? ""} ( #
                    <i className="text-black">{facility?.code || "NO_CODE"}</i> )
                  </span>
                </div>
                {/* Header Bunner  */}
                <div
                  className={
                    `col-span-5 grid grid-cols-6 gap-5 mt-4 md:mt-0 md:gap-8 py-6 w-full bg-transparent border ${facility?.is_approved ? "border-gray-600" : "border-gray-600"} drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 
                    ${facility?.is_approved ? "border-gray-600" : "border-gray-600"}
                  `}
                >
                  <div className="col-span-6 md:col-span-3">
                    <h1 className="text-4xl tracking-tight font-bold leading-tight">
                      {facility?.official_name}
                    </h1>
                    <div className="flex flex-col gap-1 w-full items-start justify-start">
                      <span
                        className={
                          "font-bold text-2xl " +
                          (facility?.code ? "text-gray-900" : "text-gray-400")
                        }
                      >
                        #{facility?.code || "NO_CODE"}
                      </span>

                      <span className="font-semibold text-gray-900 text-base">{facility?.keph_level_name}</span>
                      
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 items-start justify-end  md:col-span-2">
                    <div className="flex flex-wrap gap-3 w-full items-start justify-start md:justify-center">
                      {(facility?.operational || facility?.operation_status_name) && facility?.is_complete ? (
                        <span
                          className={
                            "leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-gray-900 flex gap-x-1 items-center cursor-default"
                          }
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Operational
                        </span>
                      ) : (
                        ""
                      )}
                      {facility?.is_approved ?  (
                        <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                          <CheckCircleIcon className="h-4 w-4" />
                          {facility?.approved_national_level ? 'Approved': 'pending approval'}
                        </span>
                      ) : (
                        <span className="bg-red-200 text-red-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                          <XCircleIcon className="h-4 w-4" />
                          pending validation
                        </span>
                      )}
                      {facility?.has_edits && (
                        <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                          <InformationCircleIcon className="h-4 w-4" />
                          Has changes
                        </span>
                      )}
                      {facility?.is_complete ? (
                        <span className="bg-blue-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                          <CheckCircleIcon className="h-4 w-4" />
                          Completed{" "}
                        </span>
                      ) : (

                        <span className="bg-yellow-200  flex flex-col justify-start h-auto text-yellow-900 p-2 leading-none text-sm  whitespace-nowrap cursor-default items-start gap-2 gap-x-1">
                            
                            <span class='flex gap-1'>
                              <CheckCircleIcon className="h-4 w-4" />
                              <h4>Incomplete Details</h4>
                            </span>

                          {
                            facility?.in_complete_details?.split(',')?.map(name => (
                              <span class='flex gap-1 capitalize'>
                              <ChevronRightIcon className="h-4 w-4" />
                              {name}
                            </span>
                              
                            ))
                          }
                            

                        </span>
                      )}
                      {facility?.closed && (
                        <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                          <LockClosedIcon className="h-4 w-4" />
                          Closed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
                </div>
              </div>

              {/* Facility Side Menu Filters */}
             <div className="hidden md:flex col-span-1">

							<FacilitySideMenu
								filters={filters}
								states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
								stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
						</div>

						<button className='md:hidden relative p-2 border border-gray-800 rounded w-full self-start my-4' onClick={() => setIsMenuOpen(!isMenuOpen)}>
							Facility Menu
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
								<FacilitySideMenu
									filters={filters}
									states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
									stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]} />
							}
				
        		</button>
              

              <div className={`col-span-1 ${isViewChangeLog ? 'md:col-span-3':'md:col-span-4'} md:w-full  flex flex-col md:gap-3 gap-5 `}>

                {/* Action Buttons e.g (Approve/Reject, Edit, Regulate, Upgrade, Close) */}

                {
              
                  !facility?.closed &&
                  <div className=" bg-gray-50 rounded w-full p-1 flex flex-col gap-3 shadow-md md:mt-0 mt-4">
                    <div className="flex  justify-start items-center flex-wrap gap-3 p-3">

                   
                      {/* Render button conditionally for both facility approval and validation*/}
                      {
                    
                          (
                          userCtx?.groups[0].id == 1 ||  // CHRIO
                          userCtx?.groups[0].id == 5 ||  // National
                          userCtx?.groups[0].id == 6 ||  // National
                          userCtx?.groups[0].id == 7     // SuperAdmin
                          ) &&
                          pathMenu?.includes('updated_pending_validation') &&

                        // Validate facility updates
                        <button
                          onClick={() => router.push(`/facilities/approve_reject/${facility?.id}`)}
                          className={
                            "p-2 text-center -md font-semibold text-base text-white bg-gray-600  rounded"
                              
                          }
                        >
                            Validate Facility Updates
                        </button>
                      } 

                      {
                          (
                            userCtx?.groups[0].id == 5 ||  // National
                            userCtx?.groups[0].id == 6 ||  // National
                            userCtx?.groups[0].id == 7     // SuperAdmin
                            ) &&
                            pathMenu?.includes('to_publish') &&

                        // Approve / Reject Facility Button
                        <button
                        onClick={() => router.push(`/facilities/approve_reject/${facility?.id}`)}
                        className={
                          "p-2 text-center -md font-semibold text-base text-white bg-gray-600  rounded"
                            
                        }
                      >
                        Approve/Reject Facility
                      </button>
                      }
                

                        {
                     
                        (
                        userCtx?.groups[0]?.id == 1 || // CHRIO
                        userCtx?.groups[0].id == 5 ||  // National
                        userCtx?.groups[0].id == 6 ||  // National
                        userCtx?.groups[0].id == 7 ) &&// SuperAdmin
                        pathMenu?.includes('new_pending_validation') &&
                         
                        //  Validate new facilities
                    
                      <button
                        onClick={() => router.push(`/facilities/approve_reject/${facility?.id}`)}
                        className={
                          "p-2 text-center -md font-semibold text-base text-white bg-gray-600  rounded"
                            
                        }
                      >
                        Validate/Reject Facility
        
                      </button>
                      } 
                     
                      {
                          (
                          userCtx?.groups[0]?.id == 2 || // SCHRIO
                          userCtx?.groups[0]?.id == 7    // SuperAdmin
                            ) &&
                          !pathMenu?.includes('rejected') &&

                          // Edit
                              <button
                              onClick={() => router.push(`edit/${facility?.id}`)}
                              className="p-2 text-center -md font-semibold text-base  text-white bg-gray-600  rounded"
                            >
                              Edit
                            </button>
                      }

                      {
                        
                        (userCtx?.groups[0]?.id == 7 ||  // SuperAdmin
                        userCtx?.groups[0]?.id == 3) && // Regulator
                        !pathMenu?.includes('rejected') &&

  
                      <button
                        onClick={() => router.push(`/facilities/regulate/${facility?.id}`)}
                        className="p-2 text-center -md font-semibold text-base  text-white bg-gray-600  rounded"
                      >
                        Regulate
                      </button>
                      }
                      {

                      (
                          userCtx?.groups[0]?.id == 2 || //CHRIO
                          userCtx?.groups[0]?.id == 7   // SuperAdmin
                        ) &&
                        !pathMenu?.includes('rejected') &&

                      <button
                        onClick={() => router.push(`/facilities/upgrade/${facility?.id}`)}
                        className="p-2 text-center -md font-semibold text-base  text-white bg-gray-600  rounded"
                      >
                        Upgrade/Downgrade
                      </button>
                      }
                      {
                        (!qf.includes('new_pending_validation') &&
                        userCtx?.groups[0]?.id == 1 || // CHRIO
                        userCtx?.groups[0]?.id == 2 || // SCHRIO
                        userCtx?.groups[0]?.id == 7    // SuperAdmin 
                        ) &&

                      <button
                        onClick={() => setIsClosingFacility(true)}
                        className="p-2 text-center -md font-semibold text-base  text-white bg-gray-600  rounded"
                      >
                        Close
                      </button>
                      }
                      {
                        console.log({props})
                      }
                      
                      <button
                        onClick={() => {
                                               
                            router.push(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_detail_report/${facility?.id}/?access_token=${props['3']?.token}`)
                        }}
                        className="p-2 text-center -md font-semibold text-base  text-white bg-gray-600  rounded"
                      >
                        Print
                      </button>

                    </div>
                  </div>
                }

                {/* Facility Details Tab Section */}
                  <FacilityDetailsTabs facility={facility}/>
              </div>

              {/* end facility approval */}
                  
              <aside className={`flex flex-col col-span-1 ${isViewChangeLog ? 'md:col-span-3': 'md:col-span-2'}  gap-4 rounded `}>
                {/* <h3 className="text-2xl tracking-tight font-semibold leading-5">
                  Map
                </h3> */}

                {facility?.lat_long && facility?.lat_long.length > 0 ? (
                  <div className="w-full bg-gray-200 shadow -lg flex flex-col items-center justify-center relative">
                    <Map
                      ward_name={wardName}
                      operational={
                        facility?.operational ?? facility?.operation_status_name ?? ""
                      }
                      code={facility?.code || "NO_CODE"}
                      lat={facility?.lat_long[0]}
                      center={center}
                      geoJSON={geoLocationData}
                      long={facility?.lat_long[1]}
                      name={facility?.official_name || facility?.name || ""}
                    />
                  </div>
                ) : (
                  <div className="w-full p-4 rounded bg-gray-50 shadow-md flex  flex-col items-center justify-center relative">
                    <div className="w-full  bg-yellow-100 flex flex-row gap-2  p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                      <p>No location data found for this facility?.</p>
                    </div>
                    
                   </div>
                )}
                <div className="flex flex-col items-start mt-2 justify-center gap-2">
                  {/* View/Hide Change Log Btn*/}
                  <button 
                  onClick={async () => {
                    setIsViewChangeLog(!isViewChangeLog);

                    if(!isViewChangeLog){
                      try{
                          const resp = await fetch(`/api/facility/get_facility/?path=change_log&id=${facility?.id}`)
                        
                          setChangeLogData((await resp.json()).revisions)
      
                      }
                      catch(e){
                        console.error(e.message)
                      }
                    }

                  }}
                  className="bg-gray-600 rounded w-auto p-2 text-white text-lg font-semibold flex items-center justify-between">
                  <span>{isViewChangeLog ? 'Hide Change Log' : 'View Change Log'}</span>
                  {
                    isViewChangeLog ?
                    <ChevronDownIcon className="w-6 h-6 text-base text-white"/>
                    :
                    <ChevronRightIcon className="w-6 h-6 text-base text-white"/>
                  }
                  </button>

                  {/* Change Log Table */}
                  {
                  isViewChangeLog &&
                  
                  <Table>
                  <TableBody className="w-full h-auto border border-gray-600">
                    <TableRow classes="border-b border-gray-400">
                      <TableCell className="font-semibold">Date</TableCell>
                      <TableCell className="font-semibold">User</TableCell>
                      <TableCell className="font-semibold">Updates</TableCell>
                    </TableRow>
                    
                  
                  
                    {
                      changeLogData &&
                      changeLogData.map(({updated_on, updated_by, updates}, i) => (
                        <TableRow className="border-b border-gray-600 " key={i}>
                          <TableCell>
                            {new Date(updated_on).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {updated_by}
                          </TableCell>
                          <TableCell>
                            {
                              updates && updates.length > 0 &&
                              updates.map(({old, new:_new, name}) => (
                                <span className="grid grid-cols-2 text-wrap">
                                  <span className="font-semibold text-base md:col-start-1">{name}{" :"}</span>
                                  <span className="text-red-400 md:col-start-2">{old}
                                  <span className="text-black">{" >> "}</span>
                                  <span className="text-gray-400">{_new}</span>
                                  </span>
                                  
                                </span>
                              ))
                            }
                          </TableCell>
                        </TableRow>
                      ))
                      
                    }
          
                  </TableBody>
                  </Table>
                
                  }   
                  
                </div>
              </aside>

            </div>


          </MainLayout>
        </>
      );
    }else{
      return null
    }
};

Facility.getInitialProps = async (ctx) => {
  const allOptions = [];

  if (ctx.query.q) {
    const query = ctx.query.q;
    if (typeof window !== "undefined" && query.length > 2) {
      window.location.href = `/facilities?q=${query}`;
    } else {
      if (ctx.res) {
        ctx.res.writeHead(301, {
          Location: "/facilities?q=" + query,
        });
        ctx.res.end();
        return {};
      }
    }
  }
  return checkToken(ctx.req, ctx.res)
    .then((t) => {
      if (t.error) {
        throw new Error("Error checking token");
      } else {
        let token = t.token;
        let _data;
        let url =
          process.env.NEXT_PUBLIC_API_URL +
          "/facilities/facilities/" +
          ctx.query.id +
          "/";
        return fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        })
          .then((r) => r.json())
          .then(async (json) => {
            allOptions.push({
              data: json,
            })
    

            // fetch ward boundaries
            if (json) {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/common/wards/${json.ward}/`,
                  {
                    headers: {
                      Authorization: "Bearer " + token,
                      Accept: "application/json",
                    },
                  }
                );

                _data = await response.json();

                const [lng, lat] =
                  _data?.ward_boundary.properties.center.coordinates;

                allOptions.push({
                  geoLocation: JSON.parse(JSON.stringify(_data?.ward_boundary)),
                  center: [lat, lng],
                });
              } catch (e) {
                console.error("Error in fetching ward boundaries", e.message);
              }
            }

            // fetch facility updates
            if(json){
              try{
                const facilityUpdateData = await (await fetch( `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${json.latest_update}/`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                    Accept: "application/json",
                  },
                }
              )).json()
                
                allOptions.push({
                  updates: facilityUpdateData,
                })
                                                         
              }
              catch(e){
                  console.error('Encountered error while fetching facility update data', e.message)
              }
            }

            allOptions.push({
              token
            });

            allOptions.push({
              qf: ctx.query.qf
            });

            return allOptions;
          })
          .catch((err) => {
            console.log("Error fetching facilities: ", err);
            return {
              error: true,
              err: err,
              data: [],
            };
          });
      }
    })
    .catch((err) => {
      console.log("Error checking token: ", err);
      if (typeof window !== "undefined" && window) {
        if (ctx?.asPath) {
          window.location.href = ctx?.asPath;
        } else {
          window.location.href = "/facilities";
        }
      }
      setTimeout(() => {
        return {
          error: true,
          err: err,
          data: [],
        };
      }, 1000);
    });
};

export default Facility;