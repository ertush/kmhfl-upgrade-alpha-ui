import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChevronDownIcon
} from "@heroicons/react/solid";
import { UserCircleIcon } from "@heroicons/react/outline";
import React, { useState, useEffect, useContext } from "react";
import { Menu } from "@headlessui/react";
import { getUserDetails } from "../controllers/auth/auth";
import LoadingAnimation from "./LoadingAnimation";
import { PermissionContext } from "../providers/permissions";
import {
  hasPermission
} from "../utils/checkPermissions"
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { UserContext } from "../providers/user";
import Image from 'next/image';
import Head from 'next/head'
import { Login, Logout } from '@mui/icons-material'
import Select from 'react-select'



export const DelayedLoginButton = () => {


  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
   
    let mtd = true;
    setTimeout(() => {
      if (mtd === true) {
        setDelayed(true);
      }
    }, 1000);
    return () => {
      mtd = false;
    };
  }, []);

  if (delayed) {
    return (
     <div className='text-lg group hover:bg-blue-800 hover:text-gray-100 max-h-min px-3 flex gap-x-2 items-center text-blue-800 capitalize font-semibold'>
      <Login className='w-6 h-6 text-blue-800 group-hover:text-gray-100' />
      <Link href="/auth/login">
        log in
      </Link>
    </div>

    );
  } else {
    return (
      <div className="p-3 w-16">
        {" "}
        <LoadingAnimation size={6} />{" "}
      </div>
    );
  }
};

export default function HeaderLayout({
  searchTerm,
}) {

  const userPermissions = useContext(PermissionContext)
  const userCtx = useContext(UserContext)


  const router = useRouter();
  const activeClasses =
    "text-black hover:text-gray-700 focus:text-gray-700 active:text-gray-700 font-medium border-b-4  border-blue-600";
  const inactiveClasses =
    "text-gray-700 hover:text-black focus:text-black active:text-black";
  const currentPath = router.asPath.split("?", 1)[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOption, setSearchOption]=useState('');
  const [user, setUser] = useState(null);
  const [touchSearch, setTouchSearch] = useState(false)

  
  const groupID = userCtx?.groups[0]?.id

  let API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (
    typeof window !== "undefined" &&
    window.location.hostname === "127.0.0.1"
  ) {
    API_URL = "http://localhost:8000/api";
  }

  //check if a session cookie is set
  let path = router.asPath;
  if (path.includes("facilities") || path.includes("facility")) {
    path = "/facilities";
  } else if (path.includes("community")) {
    path = "/community-units";
  } else {
    path = "/facilities";
  }

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
              usr.id == 6 ?  setIsLoggedIn(false) :setIsLoggedIn(true); setUser(usr);
              
              
            }
          }
        );
      } else {
        console.log("no session. Refreshing...");
        // router.push('/auth/login')
      }
    }

    return () => {
      mtd = false;
    };
  }, []);


  return (

    <header className='w-full max-h-min flex'>
        <Head>
          {/*   <title>KMHFR - Home</title> */}
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="w-full overflow-y-scroll flex flex-col">
          {/* Logo And Title */}
          <div className='w-full fixed z-30 max-h-min bg-gray-100 flex'>
            {/* Heading */}
            <div className="max-h-min w-[90%] container flex mx-auto ">
              {/* Heading */}
              <div className='w-full flex justify-between py-4 max-h-min '>
                <div className='flex gap-6 items-center'>
                  {/* Logo */}
                  <Link
                    href="/"
                    className="leading-none tracking-tight flex justify-center items-center text-black font-bold relative"
                  >

                    <Image src="/moh_court_of_arms.png" alt="logo" height="56" width="85" />

                  </Link>

                  {/* Title */}

                  <h2 /*style={{ color: '#1651b6' }}*/ className=' leading-4 font-semibold text-2xl uppercase'>Kenya Master Health Facility Registry</h2>
                </div>

                   {/* Login / Logout button */}
       {isLoggedIn ? (
        <div className="flex z-20 flex-wrap items-center gap-3 md:gap-5 px-2 md:flex-grow justify-end">
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
              className="list-none  outline-none text-black bg-gray-100 shadow-md flex flex-col items-center justify-start gap-2 p-3 absolute mt-3 bg-black right-0 text-white w-40 "
            >

              <Menu.Item as="li" className="flex items-center w-full gap-1">
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
              {/* <Menu.Item as="li" className="flex items-center w-full gap-1">
                {({ active }) => (
                  <a
                    className={`w-full hover:text-blue-400 font-medium flex items-center ${active && "text-blue-400"
                      }`}
                    href="https://KMHFR.health.go.ke/"
                    target="_blank"
                  >
                    KMHFR live <ExternalLinkIcon className="h-4 w-4 ml-2" />
                  </a>
                )}
              </Menu.Item> */}
              <Menu.Item
                as="li"
                className={"flex items-center w-full gap-1 mt-2 border-t border-gray-300 py-2"}
              >
                {({ active }) => (
                  <button
                    onClick={() => router.push('/logout')}
                    data-testid="logout"
                    className={`w-full cursor-pointer flex hover:text-blue-600 font-medium ${active && "text-blue-400"
                      }`}
                    
                  >

                    <Logout className="w-6 aspect-ratio" />  &nbsp; Log out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      ) : (
        <DelayedLoginButton />

      )}
                

      </div>




            </div>

          </div>

          {/* Menu Heading */}
          <div style={{ backgroundColor: '#1651b6' }} className='w-full top-[88px] fixed z-10  max-h-min flex'>
            {/* Menu Heading */}
            <nav className="max-h-min w-[90%] container flex justify-between items-center mx-auto ">
              <ul className='list-none w-8/12 flex items-center justify-between '>
                
                <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/dashboard" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                  <Link href='/dashboard'>Dashboard</Link>
                </li>

                <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/facilities" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                  <Link href='/facilities'>Facilities</Link>
                </li>

                <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/community-units" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                  <Link href='/community-units'>Community Units</Link>
                </li>
                {
                  (groupID == 7 ||
                   groupID == 2 ||
                   groupID == 3 ) &&
                  <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/user" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                    <Link href='/user'>Users</Link>
                  </li> 
                 }

                 {
                  hasPermission(/^common.add_county$/, userPermissions) &&
                  hasPermission(/^common.delete_county$/, userPermissions) &&
                  <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/system_setup" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                     <Link href='/system_setup'>System Setup</Link>
                   </li> 
                 }
               
                <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/reports" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                  <Link href='/reports'>Reports</Link>
                </li>

                 {
                  hasPermission(/^admin_offices.view_adminoffice.*$/, userPermissions) && 
                  <li className={`text-lg h-[80px] flex items-center group-hover:border-b-2 group-hover:border-b-gray-50 duration-200 ease-out hover:bg-blue-500/85 px-4 font-semibold capitalize text-gray-100 ${currentPath == "/admin_offices" && 'border-b-2 border-b-gray-50 bg-blue-500/85' }`}>
                    <Link href='/admin_offices'>Admin Offices</Link>
                  </li>
                  }

              </ul>

               <form className='w-3/12 py-4 flex' onSubmit={
                    (e) => {
                      e.preventDefault();

                      setTouchSearch(false);

                      const formDataEntries = new FormData(e.target)
                      const formData = Object.fromEntries(formDataEntries)

                      if(searchOption == "Facilities"){
                        router.push({pathname: '/facilities', query:{
                          q: formData.search
                        }})
                      }
                      else
                      {
                         router.push({pathname:"/community-units", query:{
                            q: formData.search
                         }})
                      
                      }
                    }
                  }>

                  <input placeholder={`Search ... `} onChange={(e) => {e.target.value.length > 0 ? setTouchSearch(true): setTouchSearch(false)}} name="search" type="text" className=' w-full border-none h-12 p-3 outline-none placeholder-gray-500' />

                  <Select
                  readOnly 
                  styles={{
                    control: (_) => {
                      // console.log({baseStyles})
                      return {
                        // background: "inherit",
                        boxSizing: "border-box",
                        cursor: "default",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        label: "control",
                        
                        outline: "0 !important",
                        position: "relative",
                        transition: "all 100ms",                      
                        outLine: 'none',
                        borderTop: 'none',
                        borderBottom: 'none',
                        borderLeft: 'none',
                        margin: 0
                      }
                     
                
                    },
                  }}

                  options={
                    [
                      {
                        label:'Facilities',
                        value: 'facilities'
                      },
                      {
                        label:'Community Health Units',
                        value: 'chus'
                      },
                      
                    ]
                  }
                  defaultValue={{
                    label:'Facilities',
                    value: 'facilities'
                  }}
                  placeholder="Select Category"
                  name="facility_name"
                  onChange={(e) => setSearchOption(e.label)}
                  id="facility_name"
                  className={`flex-none ${touchSearch && 'hidden'} bg-white focus:ring-0 p-1 max-h-min focus:outline-none rounded-none  w-[200px] text-gray-600 placeholder-gray-500  flex-grow border-l border-gray-400 outline-none`}


                  />
                  <button type="submit" className='py-2 px-3 bg-blue-600 text-gray-100 font-semibold '>search</button>
                </form> 

            </nav>
          </div>
        </div>

    </header>    
  );
}