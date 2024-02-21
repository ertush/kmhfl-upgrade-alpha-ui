import Head from "next/head";
import { checkToken } from "../../../controllers/auth/public_auth";
import React, { useState, useEffect, useContext } from "react";
import MainLayout from "../../../components/MainLayout";
import Link from 'next/link'
import { useRouter } from 'next/router';
import {CheckCircleIcon,LockClosedIcon} from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import { UserContext } from "../../../providers/user";
import FacilityDetailsTabsPulic from "../../../components/FacilityDetailsTabsPublic";
import { useAlert } from "react-alert";


const FacilityDetails = (props) => {

  const userCtx = useContext(UserContext)


  const Map = dynamic(
    () => import("../../../components/Map"), // replace '@components/map' with your component's location
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
  const wardName = props["0"]?.data.ward_name;
  const center = props["1"]?.geoLocation.center;

  const [isViewChangeLog, setIsViewChangeLog] = useState(false)

  const router = useRouter()

  const handlePrint = (accessToken, id) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_detail_report/${id}/?format=pdf&access_token=${accessToken}`;
    router.push(url);
  };
  
  return (
    <>
      <Head>
        <title>KMHFR - {facility?.official_name ?? ""}</title>
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      
      <MainLayout>
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-3 my-4 place-content-center">
          {/* Header */}
          <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start gap-3">
            {/* Breadcramps */}
            <div className="flex flex-row gap-2 text-sm md:text-base md:my-3">
              <Link className="text-blue-700" href="/public/facilities">
                Home
              </Link>
              {"/"}
              <Link className="text-blue-700" href="/public/facilities">
                Facilities
              </Link>
              {"/"}
              <span className="text-gray-500">
                {facility?.official_name ?? ""} ( #
                <i className="text-black">{facility?.code || "NO_CODE"}</i> )
              </span>
              {/* <div className="flex flex-row gap-2 items-center ml-auto">
                <button
                 onClick={()=>handlePrint(props['4'].token, facility.id)}
                  className="p-2 text-center -md font-semibold text-base  text-white bg-indigo-500 justify-end mr-2"
                >
                 Print
                </button>
                </div> */}
            </div>
            {/* Header Bunner  */}
            <div
              className={
                "col-span-5 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-gray-50 drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " +
                (facility?.is_approved ? "border-blue-600" : "border-red-600")
              }  
            >
              <div className="col-span-6">
                <h1 className="text-4xl tracking-tight font-bold leading-tight">
                  {facility?.official_name}
                </h1>
                <div className=" flex flex-col gap-2 place-content-start">
                  <span
                    className={
                      "font-bold text-2xl " +
                      (facility?.code ? "text-blue-900" : "text-gray-400")
                    }
                  >
                    #{facility?.code || "NO_CODE"}
                  </span>
                  <p className="text-gray-600 leading-tight">
                    {facility?.keph_level_name &&
                      "KEPH " + facility?.keph_level_name}
                  </p>
                </div>
                <p className="tracking-tight font-bold leading-tight">
                {/* Type : {facility?.facility_type_name ?? ""} */}
                </p>
              </div>

              <div className="flex flex-col gap-2 place-content-start">
                <div className="flex">
                  {facility?.operational || facility?.operation_status_name ? (
                    <span
                      className={
                        "leading-none whitespace-nowrap text-sm  py-1 px-2 bg-blue-200 text-blue-900 flex gap-x-1 items-center cursor-default"
                      }
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Operational
                    </span>
                  ) : (
                    ""
                  )}
                  {facility?.closed && (
                    <span className="bg-gray-200 text-gray-900 p-1 leading-none text-sm  whitespace-nowrap cursor-default flex items-center gap-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      Closed
                    </span>
                  )}
                </div>
                <p>
                  <b>Regulatory Body:</b> {facility.regulatory_body_name || ""}
                </p>
              </div>
              <div className="col-span-6 md:col-span-1 flex flex-col items-center justify-center p-2"></div>
            </div>
          </div>      

          <div className={`col-span-1 md:col-span-4 bg-gray-50 shadow-md md:w-full flex flex-col gap-3 mt-4`}>
            {/* Facility Details Tab Section */}
              <FacilityDetailsTabsPulic facility={facility}/>
          </div>

          {/* end facility approval */}
              
          <aside className={`flex flex-col col-span-1 md:col-span-3 gap-4 md:mt-7`}>
            <h3 className="text-2xl tracking-tight font-semibold leading-5">
              Map
            </h3>

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
                  // geoJSON={geoLocationData}
                  long={facility?.lat_long[1]}
                  name={facility?.official_name || facility?.name || ""}
                />
              </div>
            ) : (
              <div className="w-full bg-gray-200 shadow -lg flex flex-col items-center justify-center relative">
                <div className="w-full  bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none">
                  <p>No location data found for this facility?.</p>
                </div>
              </div>
            )}
          </aside>

        </div>


      </MainLayout>
    </>
  );
};

FacilityDetails.getInitialProps = async (ctx) => {
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
    .then(async (t) => {
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
        return await fetch(url, {
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
            qf: ctx.query.qf
          })
          allOptions.push({
            token: token
          })
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

export default FacilityDetails;
