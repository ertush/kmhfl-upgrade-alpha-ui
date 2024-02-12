import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import MainLayout from '../components/MainLayout'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { getUserDetails } from "../controllers/auth/public_auth";
import { checkToken } from '../controllers/auth/public_auth';
import LogoutIcon from '@mui/icons-material/Logout';
import { DelayedLoginButton } from '../components/HeaderLayout'
import { Menu } from "@headlessui/react";
import { Login } from '@mui/icons-material'
import { NorthEast } from '@mui/icons-material'


function Home(props) {


  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [_, setUser] = useState(null);
  const [isClient, setIsClient] = useState(null);

  const mohRef = useRef(null)

  let API_URL = process.env.NEXT_PUBLIC_API_URL;

  // if(is_user_logged_in) router.push('/dashboard')

  useEffect(() => {


    let mtd = true;
    if (mtd) {
      let is_user_logged_in =
        (typeof window !== "undefined" &&
          window.document.cookie.indexOf("access_token=") > -1) ||
        false;
      let session_token = null;
      if (is_user_logged_in) {
        session_token = JSON.parse(
          window.document.cookie.split("access_token=")[1].split(";")[0]
        );
      }

      if (
        is_user_logged_in &&
        typeof window !== "undefined" &&
        session_token !== null
      ) {


        getUserDetails(session_token.token, `${API_URL}/rest-auth/user/`).then(
          (usr) => {

            if (usr.error || usr.detail) {
              setIsLoggedIn(false);
              setUser(null);
            } else {
              usr.id == 6 ? setIsLoggedIn(false) : setIsLoggedIn(true);
              setUser(usr);

            }
          }
        );
      } else {
        console.log("no session. Refreshing...");
        // router.push('/auth/login')
      }
    }

    setIsClient(true)

    return () => {
      mtd = false;
    };
  }, []);




  useEffect(() => {
    let mtd = true


    if (mtd) {
      isLoggedIn ? router.push('/dashboard') : router.push('/')
    }

    return () => {
      mtd = false
    }
  }, [isLoggedIn])


  function animateValue(event, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      event.target.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }






  if (isClient) {

    return (
      <>
        <Head>
          <title>KMHFR - Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="w-full h-screen overflow-y-scroll flex flex-col">
          {/* Logo And Title */}
          <div className='w-full fixed z-10 max-h-min bg-gray-100 flex'>
            {/* Heading */}
            <div className="max-h-min w-[60%] container flex   mx-auto ">
              {/* Heading */}
              <div className='w-full flex justify-between py-4 max-h-min '>
                <div className='flex gap-6 items-center'>
                  {/* Logo */}
                  <a
                    href="/"
                    className="leading-none tracking-tight flex justify-center items-center text-black font-bold relative"
                  >

                    <Image src="/moh_court_of_arms.png" alt="logo" height="56" width="85" />

                  </a>

                  {/* Title */}

                  <h2 style={{ color: '3#1651b6' }} className=' leading-4 font-semibold text-xl uppercase'>Kenya Master Health Facility Registry</h2>
                </div>

                {/* Login Button */}
                <div className='text-lg group hover:bg-blue-800 hover:text-gray-100 max-h-min px-3 flex gap-x-2 items-center text-blue-800 capitalize font-semibold'>
                  <Login className='w-6 h-6 text-blue-800 group-hover:text-gray-100' />
                  <Link href="/auth/login">
                    log in
                  </Link>
                </div>

                {/* {isLoggedIn ? (
            <div className="flex flex-wrap items-center gap-3 md:gap-5 px-2 md:flex-grow justify-end">
              <Menu as="div" className="relative p-2" >
                <Menu.Button
                  as="div"
                  className="flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="leading-none p-0 inline sm:hidden">
                    <UserCircleIcon className="h-6 w-6" />
                  </span>
                  <span className="leading-none p-0 hidden sm:inline">
                    {user.full_name || "My account"}
                  </span>
                  <span className="leading-none p-0">
                    <ChevronDownIcon className="h-4 w-5" />
                  </span>
                </Menu.Button>
                <Menu.Items
                  as="ul"
                  style={{backgroundColor:"#eff6ff", color: "black", outline:'none'}}
                  className="list-none shadow-md flex flex-col items-center justify-start gap-2 p-3 absolute mt-3 bg-black right-0 text-white w-40 "
                >

                  <Menu.Item as="li" className="flex items-center w-full ">
                    {({ active }) => (
                      <button
                        className={`w-full hover:text-blue-600 font-medium cursor-pointer flex items-center ${active && "text-blue-400"
                          }`}
                      onClick={() => router.push('/account')}
                      >
                      
                      <AccountCircleOutlinedIcon fontSize="small"/> &nbsp; Profile
                      
                      </button>
                    )}
                  </Menu.Item>
                
                  <Menu.Item
                    as="li"

                    className="flex items-center w-full gap-1 mt-2 border-t border-gray-300 py-2"
                  >
                    {({ active }) => (
                      <a
                        data-testid="logout"
                        className={`w-full hover:text-blue-600 font-medium ${active && "text-blue-400"
                          }`}
                        href="/logout"
                      >
                      <LogoutIcon /> &nbsp; Log out
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
                    ) : (
                      <DelayedLoginButton />
                    )} */}

              </div>




            </div>

          </div>
          {/* Menu Heading */}
          <div style={{ backgroundColor: '#1651b6' }} className='w-full top-[88px] fixed z-10 max-h-min flex'>
            {/* Menu Heading */}
            <nav style={{ width: "60%" }} className="max-h-min container flex  mx-auto ">
              <ul className='list-none w-full flex items-center py-4 justify-between '>
                <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                  <Link href='/public/facilities'>Facilities</Link>
                </li>
                <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                  <Link href='/public/cu'>Community Units</Link>
                </li>
                <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                  <Link href='/public/faq'>FAQs</Link>
                </li>
                <li className='text-base font-semibold capitalize text-gray-100 hover:border-b-2 hover:border-gray-100'>
                  <Link href='/public/contacts'>Contacts</Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Hero Section */}
          <div className='h-[100vh] w-full mb-24'>
            <div className='w-full  relative' style={{
              height: '85vh',
              backgroundImage: "url('/assets/css/images/moh_lab.jpg')",
              backgroundBlendMode: "darken",
              backgroundSize: "cover",

            }}>
              <div className='w-full h-full bg-gray-900 opacity-60 absolute inset-0'></div>
              <div className='absolute left-[20%] w-[70%] top-[30%] h-auto flex-col items-start'>
                <h1 className="text-6xl text-wrap text-gray-100 font-extrabold">Discover <span className='text-blue-500'>Health Facilities</span> and <span className='text-blue-500'>Community Health Units</span> Near You</h1>
                <h4 className='text-lg mt-4 text-gray-100 capitalize'>the Official registry of health facilities and Community units in kenya</h4>
              </div>


              <div className='w-[60%] left-[20%] bottom-[26%] absolute h-auto bg-gray-200 bg-opacity-40 p-5 flex place-content-center'>
                <form className='w-full bg-gray-100 flex'>
                  <input placeholder="Search for a facility" className=' w-full border-none h-12 p-3 outline-none placeholder-gray-500' />
                  <button type="submit" className='py-2 px-3 bg-blue-600 text-gray-100 font-semibold '>search</button>
                </form>
              </div>


              <div className="absolute -bottom-[9%] left-[20%] w-[60%] h-auto grid grid-cols-4 place-content-center gap-6">
                <div style={{ backgroundColor: '#1651b6' }} className='h-36 w-full  rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                  <h2 className="text-lg font-semibold text-gray-100">Ministy of Health</h2>
                  <h1 ref={mohRef} id="moh_owner_counter" onMouseOver={e => animateValue(e, 0, 34, 1000)} className="text-5xl font-bold text-gray-100">34</h1>
                </div>

                <div style={{ backgroundColor: '#1651b6' }} className='h-36 w-full  rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                  <h2 className="text-lg font-semibold text-gray-100">Private</h2>
                  <h1 id="private_owner_counter" onMouseOver={e => animateValue(e, 0, 30, 1000)} className="text-5xl font-bold text-gray-100">30</h1>
                </div>

                <div style={{ backgroundColor: '#1651b6' }} className='h-36 w-full  rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                  <h2 className="text-lg font-semibold text-gray-100">Faith Based</h2>
                  <h1 id="faith_based_owner_counter" onMouseOver={e => animateValue(e, 0, 64, 1000)} className="text-5xl font-bold text-gray-100">64</h1>
                </div>

                <div style={{ backgroundColor: '#1651b6' }} className='h-36 w-full rounded py-4 shadow-md flex flex-col justify-start items-center gap-5'>
                  <h2 className="text-lg font-semibold text-gray-100">Non Govermental</h2>
                  <h1 id="non_gov_owner_counter" onMouseOver={e => animateValue(e, 0, 14, 1000)} className="text-5xl font-bold text-gray-100">14</h1>
                </div>

              </div>



              {/* <div class="w-full h-full bg-blue-500 absolute top-[400px] z-10"></div>*/}

              {/* <Image quality={80} class="overflow-hidden absolute inset-0" src="/assets/css/images/moh_lab.jpg" style={{objectFit: "cover"}} width={1900} height={700} alt="Hero Image" />                  */}
            </div>
          </div>


          <div className='w-[60%] mx-auto flex mt-8'>
            <h1 className='text-blue-600 opacity-80 font-semibold text-4xl'>About</h1>
          </div>

          {/* Body */}
          <div className='h-[1200px] items-start w-[60%] mx-auto flex mt-12  gap-8'>

            <Image src="/assets/css/images/distribution_map.png" objectFit="contain" width="1200" height="1200" />

            <div className="flex flex-col justify-start mt-8 h-full gap-y-24">
              <p className="text-base text-justify relative">
                <h1 className="text-8xl absolute text-blue-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">1</h1>
                Users can view administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
              </p>

              <p className="text-base text-justify relative">
                <h1 className="text-8xl absolute text-blue-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">2</h1>
                KMHFR provides a list of all health facilities which comes with an advanced search where you can refine your search.
              </p>

              <p className="text-base text-justify relative">
                <h1 className="text-8xl absolute text-blue-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">3</h1>
                The system provides a list of all community health units along side an advance search where you can refine your search by using administrative units.
              </p>

              <p className="text-base text-justify relative">
                <h1 className="text-8xl absolute text-blue-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">4</h1>
                KMHFR provides a RESTful API for developers to use. The documentation is available at <br /> <a className="text-blue-700 group-hover:underline group-hover:text-gray-50 focus:underline active:underline" href="https://mfl-api-docs.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://mfl-api-docs.readthedocs.io/en/latest</a>
              </p>

              <p className="text-base text-justify relative">
                <h1 className="text-8xl absolute text-blue-600 font-extrabold opacity-30 -top-[40px] -left-[10px]">5</h1>
                To learn all about KMHFR, its implementation and how to use it here (<a className="text-blue-700 group-hover:underline group-hover:text-white focus:underline active:underline" target="_blank" rel="noopener noreferrer" href="https://elearning.health.go.ke">https://elearning.health.go.ke</a>). Enrol and start learning.
              </p>
            </div>




          </div>

          <div className='w-[60%] mx-auto flex mt-8'>
            <h1 className='text-blue-600 opacity-80 font-semibold text-4xl'>Partners</h1>
          </div>

          <div className="w-[60%] mx-auto mt-12 h-auto mb-8 flex items-center flex-wrap gap-5 justify-center">


            <Link href="https://healthit.uonbi.ac.ke">
              <Image className="cursor-pointer" src="/healthit.png" alt="HealthIT" objectFit='contain' width="290" height="100" />
            </Link>


            <Link href="https://www.usaid.gov/kenya">
              <Image
                src="data:image/png;base64,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"
                alt="USAID"
                className="cursor-pointer"
                objectFit='contain'
                width="290" height="120" />
            </Link>

            <Link href="https://health.go.ke">
              <Image className="cursor-pointer" src="/moh-logo.png" alt="Ministry Of Health" objectFit='contain' width="290" height="100" />
            </Link>




          </div>




          {/* Footer */}

          <div className="w-full flex flex-col mt-12 h-auto">
            <div className="w-full max-h-min py-5  bg-gray-500">
              <div className="flex flex-col gap-4 items-between">
                <div className="w-[60%] mx-auto flex justify-between">
                  <div className="flex flex-col text-gray-200 gap-2">
                    <h2 className='text-blue-50 font-semibold mb-2 '>Contacts</h2>
                    <Link href="tel:+254 20 2717077" className="t">+254-20-2717077</Link>
                    <Link href="mailto:kmhfl@health.go.ke" className="text-gray-200">kmhfl@health.go.ke</Link>
                    <Link href="https://servicedesk.health.go.ke/portal" className="text-gray-200"> servicedesk.health.go.ke/portal</Link>

                  </div>

                  <div className="flex flex-col  gap-2">
                    <h2 className='text-blue-50 font-semibold mb-2'>Partners</h2>
                    <p className="text-gray-200">HealthIT</p>
                    <p className="text-gray-200">USAID</p>
                    <p className="text-gray-200">Ministry of Health</p>
                  </div>

                  <div className="flex flex-col text-gray-200 gap-2">
                    <h2 className='text-blue-50 font-semibold mb-2'>Quick Links</h2>
                    <div className='flex items-center gap-2'>
                    <Link href="https://healthit.uonbi.ac.ke" className="text-gray-200 hover:underline">HealthIT</Link>
                    <NorthEast className="text-gray-200 w-2 aspect-square"/>
                    </div>

                    <div className='flex items-center gap-2'>
                    <Link href="https://usaid.gov/kenya" className="text-gray-200 hover:underline">USAID</Link>
                    <NorthEast className="text-gray-200 w-2 aspect-square"/>
                    
                    </div>

                    <div className='flex items-center gap-2'>
                    <Link href="https://health.go.ke" className="text-gray-200 hover:underline">Ministry of Health</Link>
                    <NorthEast className="text-gray-200 w-2 aspect-square"/>
                    
                    </div>
                  </div>
                </div>

                <div className="flex w-[60%] mx-auto justify-between gap-5 items-center">
                  <Link href="https://healthit.uonbi.ac.ke">
                    <Image className="cursor-pointer" src="/healthit.png" alt="HealthIT" objectFit='contain' width="290" height="100" />
                  </Link>


                  <Link href="https://www.usaid.gov/kenya">
                    <Image
                      src="data:image/png;base64,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"
                      alt="USAID"
                      className="cursor-pointer"
                      objectFit='contain'
                      width="290" height="120" />
                  </Link>

                  <Link href="https://health.go.ke">
                    <Image className="cursor-pointer" src="/moh-logo.png" alt="Ministry Of Health" objectFit='contain' width="290" height="100" />
                  </Link>
                </div>
              </div>

            </div>

            <div className="w-full max-h-min py-5  bg-gray-700">
              <div className='w-[60%] mx-auto max-h-min flex justify-between items-center py-4'>
                <p className='text-gray-400'>&copy; Copyright {new Date().getFullYear()}. All Rights Reserved. Republic of Kenya, Ministry of Health</p>
                <p className='text-gray-400'>Version 3.0.1</p>
              </div>
            </div>
          </div>

          {/* <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                  <div className="w-full grid grid-cols-2 gap-6 px-3 md:px-4 p-4 my-4 max-w-screen-lg mx-auto">
                      <div className="col-span-2 p-2 md:p-4 flex flex-col gap-4 items-center justify-center">
                          <h3 className="text-5xl font-medium text-black">Welcome to KMHFR</h3>
                          <p className="font-normal text-lg text-gray-900 text-left">
                              Kenya Master Health Facility List (KMHFR) is an application with all health facilities and community units in Kenya. Each health facility and community unit is identified with unique code and their details describing the geographical location, administrative location, ownership, type and the services offered.
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <Link href="/facilities">
                              <span className="tex3t-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">Facilities</span>
                          </Link>
                          <p className="text-base">
                              This provides a list of all health facilities and there is a provided advanced search where you can refine your search.
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <Link href="/community-units">
                              <span className="tex3t-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">Community Units</span>
                          </Link>
                          <p className="text-base">
                              This provides a list of all community health units and the system provided advance search where you can refine your search by using administrative units.
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <Link href="/gis">
                              <span className="tex3t-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">GIS Explorer</span>
                          </Link>
                          <p className="text-base">
                              This visualizes administrative units (counties, constituencies, wards) and their facilities and Community Health Units. Users can also rate Facilities and Community Health Units.
                          </p>
                      </div>
                      
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <a href="https://mfl3-api-docs.readthedocs.io/en/latest/" className="text-left w-full cursor-pointer  group:hover:text-white font-semibold text-xl">KMHFR API</a>
                          <p className="text-base">
                              This provides a RESTful API for developers to use. The documentation is available at <br /> <a className="text-blue-700 group-hover:underline group-hover:text-gray-50 focus:underline active:underline" href="https://mfl-api-docs.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">https://mfl-api-docs.readthedocs.io/en/latest</a>
                          </p>
                      </div>
                      <div className="col-span-2 md:col-span-1 hover:border bg-gray-50 shadow-sm ease-in-out delay-150 hover:border-blue-600 group hover:bg-blue-600 hover:text-gray-50 focus:bg-gray-50 active:bg-gray-50 p-4 flex flex-col items-center justify-start">
                          <a className="font-s3emibold text-left text-xl w-full cursor-pointer group-hover:text-white focus:text-black active:text-black" href="https://elearning.health.go.ke" target="_blank" rel="noopener noreferrer">MoH Virtual Academy</a>
                          <p className="text-base">
                              You can learn all about KMHFR, its implementation and how to use it here (<a className="text-blue-700 group-hover:underline group-hover:text-white focus:underline active:underline" target="_blank" rel="noopener noreferrer" href="https://elearning.health.go.ke">https://elearning.health.go.ke</a>). Enrol and start learning.
                          </p>
                      </div>
                  </div>
              </MainLayout> */}


        </div>
      </>
    )
  }
  else {
    return null
  }
}



export async function getServerSideProps(ctx) {

  // return {loggedIn: false, token: null}
  return checkToken(ctx.req, ctx.res, { username: process.env.NEXT_PUBLIC_CLIENT_USERNAME, password: process.env.NEXT_PUBLIC_CLIENT_PASSWORD })
    .then((t) => {
      console.log(t)
      if (t.error) {
        throw new Error('Error checking token');
      } else {
        let token = t.token;
        return { props: { loggedIn: false, token: token } }
        // return fetchData(token).then((t) => t);
      }
    })
    .catch((err) => {
      console.log('Error checking token: ', err);
      if (typeof window !== 'undefined' && window) {
        if (ctx?.asPath) {
          window.location.href = ctx?.asPath;
        } else {
          window.location.href = '/';
        }
      }
      setTimeout(() => {
        return {
          error: true,
          err: err,
          data: [],
          query: {},
          path: ctx.asPath || '/',
          current_url: '',
        };
      }, 1000);
    });

}

export default Home