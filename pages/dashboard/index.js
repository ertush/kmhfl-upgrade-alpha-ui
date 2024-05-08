import Head from 'next/head'
import MainLayout from '../../components/MainLayout'
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import Chart from '../../components/Chart'
import Select from 'react-select'
// import { Select as CustomSelect } from '../../components/Forms/formComponents/Select'
import { UserContext } from '../../providers/user'
import { useReactToPrint } from 'react-to-print'
import 'react-datepicker/dist/react-datepicker.css';
import propTypes from 'prop-types'



function Dashboard(props) {

    const router = useRouter()

    const userCtx = useContext(UserContext)

    const filters = props?.filters


    //create period items 
    const Years = [
        {
            value: (new Date().getFullYear()).toString() + '-01-01',
            label: (new Date().getFullYear()).toString()
        },
        {
            value: (new Date().getFullYear() - 1).toString() + '-01-01',
            label: (new Date().getFullYear() - 1).toString()
        },
        {
            value: (new Date().getFullYear() - 2).toString() + '-01-01',
            label: (new Date().getFullYear() - 2).toString()
        },
        {
            value: (new Date().getFullYear() - 3).toString() + '-01-01',
            label: (new Date().getFullYear() - 3).toString()
        },
        {
            value: (new Date().getFullYear() - 4).toString() + '-01-01',
            label: (new Date().getFullYear() - 4).toString()
        },
        {
            value: 'custom',
            label: 'Custom Range'
        }
    ]

    const quarters = [
        {
            value: 'All',
            label: 'All Quarters'
        },
        {
            value: 'quarter 1',
            label: 'Quarter 1'
        },
        {
            value: 'quarter 2',
            label: 'Quarter 2'
        },
        {
            value: 'quarter 3',
            label: 'Quarter 3'
        },
        {
            value: 'quarter 4',
            label: 'Quarter 4'
        }
    ]
    const [isquarterOpen, setIsquarterOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [drillDown, setDrillDown] = useState({})
    const [user, setUser] = useState(userCtx)
    const [subcounties, setSubcounties] = useState([])
    const [counties, setCounties] = useState([])
    const [wards, s] = useState([])
    const [isClient, setIsClient] = useState(false);

    const [ownerPresentationType, setOwnerPresentationType] = useState('pie')
    const [facilityTypePresentationType, setFacilityTypePresentationType] = useState('bar')
    const [summaryPresentationType, setSummaryPresentationType] = useState('bar')
    const [chuSummaryPresentationType, setCHUSummaryPresentationType] = useState('column')
    const [recentChangesPresentationType, setRecentChangesPresentationType] = useState('table')
    const [facilityKephPresentationType, setFacilityKephPresentationType] = useState('pie')
    const [facilityCHUsPresentationType, setFacilityCHUsPresentationType] = useState('bar')


    const dwn = useRef()

    async function fetchCounties() {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=counties`)
            setCounties({ county: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch counties: ${err.message}`)
        }
    }

    async function fetchSubCounties(county) {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=sub_counties&id=${county}`)
            setSubcounties({ subcounties: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch sub_counties: ${err.message}`)
        }
    }

    async function fetchWards(sub_county) {

        try {
            const r = await fetch(`/api/common/fetch_form_data/?path=wards&id=${sub_county}`)
            s({ wards: (await r.json())?.results })
        } catch (err) {
            console.log(`Unable to fetch wards: ${err.message}`)
        }
    }

    function getperiod(item, curryear) {
        let startdate = ''
        let enddate = ''
        try {
            if (item === 'All') {
                startdate = curryear + "-01-01"
                enddate = curryear + "-12-" + (new Date(curryear, 12, 0).getDate().toString())
            }
            else if (item === 'quarter 1') {
                startdate = curryear + "-01-01"
                enddate = curryear + "-03-" + (new Date(curryear, 3, 0).getDate().toString())
            }
            else if (item === 'quarter 2') {
                startdate = curryear + "-04-01"
                enddate = curryear + "-06-" + (new Date(curryear, 6, 0).getDate().toString())
            }
            else if (item === 'quarter 3') {
                startdate = curryear + "-07-01"
                enddate = curryear + "-09-" + (new Date(curryear, 9, 0).getDate().toString())
            }
            else if (item === 'quarter 4') {
                startdate = curryear + "-10-01"
                enddate = curryear + "-12-" + (new Date(curryear, 12, 0).getDate().toString())
            }
            else {
                return null
            }
            return [startdate, enddate]
        } catch (error) {
            return null
        }
    }


    useEffect(() => {
        setUser(userCtx)

        let mtd = true
        if (mtd) {

            if (filters && Object.keys(filters).length > 0) {
                Object.keys(filters)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (subcounties && Object.keys(subcounties).length > 0) {
                Object.keys(subcounties)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (wards && Object.keys(wards).length > 0) {
                Object.keys(wards)?.map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (userCtx) setUser(userCtx)
        }
        return () => { mtd = false }

    }, [filters, subcounties, wards])


    // Check for user authentication
    useEffect(() => {
        setIsClient(true)


        if (userCtx?.groups[0].id == 2) fetchWards(user?.user_sub_counties[0]?.sub_county ?? null)
        if (userCtx?.groups[0].id == 1) fetchSubCounties(userCtx?.county)
        if (userCtx?.groups[0].id == 7) fetchCounties();

        setUser(userCtx)



    }, [])


    // console.log(props.data)
    const exportToPdf = useReactToPrint({
        documentTitle: 'Summary',
        content: () => dwn.current,
    });


    const totalSummary = [
        { name: 'Total Facilities', count: `${props?.data?.total_facilities || 0}` },
        { name: 'Total approved facilities', count: `${props?.data?.approved_facilities || 0}` },
        { name: 'Total rejected facilities', count: `${props?.data?.rejected_facilities_count || 0}` },
        { name: 'Total closed facilities', count: `${props?.data?.closed_facilities_count || 0}` },
        { name: 'Total facilities pending approval', count: `${props?.data?.pending_updates || 0}` },
        { name: 'Total facilities rejected at validation', count: `${props?.data?.facilities_rejected_at_validation || 0}` },
        { name: 'Total facilities rejected at approval', count: `${props?.data?.facilities_rejected_at_approval || 0}` },

    ]

    const chuSummary = [
        { name: 'Total community health units', count: `${props?.data?.total_chus || 0}` },
        { name: 'Total CHUs rejected', count: `${props?.data?.rejected_chus || 0}` },
        { name: 'New CHUs pending approval', count: `${props?.data?.recently_created_chus || 0}` },
        { name: 'Updated CHUs pending approval', count: `${props?.data?.chus_pending_approval || 0}` },

    ]

    for (let i = 0; i < props?.data?.cu_summary?.length; i++) {
        chuSummary.push(props?.data?.cu_summary[i]);
    }
    for (let i = 0; i < props?.data?.validations?.length; i++) {
        totalSummary.push(props?.data?.validations[i]);
    }

    // console.log({data: props?.data})
    const recentChanges = [
        { name: 'New facilities added', count: `${props?.data?.recently_created || 0}` },
        { name: 'Facilities updated', count: `${props?.data?.recently_updated || 0}` },
        { name: 'New CHUs added', count: `${props?.data?.recently_created_chus || 0}` },
        { name: 'CHUs updated', count: `${props?.data?.recently_updated_chus || 0}` }
    ]

    // console.log(user)
    const csvHeaders = useMemo(
        () => [
            { key: 'metric', label: 'Metric' },
            { key: 'value', label: 'Value' },
        ],
        [],
    );

    const groupID = user?.groups[0]?.id

    const userCounty = user?.user_counties[0]?.county_name

    const userSubCounty = user?.user_sub_counties[0]?.sub_county_name

    function countyOptions(filters, ft) {
        if (groupID === 5 || groupID === 7) {
            let opts = [{ value: "national", label: "National summary" }, ...Array.from(filters[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        } else {
            let opts = [...Array.from(filters[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        }
    }

    function subCountyOptions(filters, ft) {
        if (groupID === 1) {
            let opts = [{ value: "county", label: "County summary" }, ...Array.from(subcounties[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        } else {
            let opts = [...Array.from(subcounties[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        }
    }

    function wardOptions(filters, ft) {

        if (groupID === 2) {
            let opts = [{ value: "Subcounty", label: "Subcounty summary" }, ...Array.from(wards[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        } else {
            let opts = [...Array.from(wards[ft] || [],
                fltopt => {
                    if (fltopt.id != null && fltopt.id.length > 0) {
                        return {
                            value: fltopt.id, label: fltopt.name
                        }
                    }
                })]
            return opts
        }

    }

    const chartPresentationOptions = [
        {
            label: 'Pie Chart',
            value: 'pie'
        },
        {
            label: 'Bar Chart',
            value: 'bar'
        },
        {
            label: 'Column Chart',
            value: 'column'
        },
        {
            label: 'Line Chart',
            value: 'line'
        },
        {
            label: 'Table',
            value: 'table'
        }
    ]





    function handleYearChange(value) {

        // event.preventDefault()

        const year = value.value //event.target.value
        const county = document.querySelector("#county-filter")
        const subCounty = document.querySelector("#sub-county-filter")
        const ward = document.querySelector("#ward-filter")

        if (value.label == "custom") {
            setIsquarterOpen(false)
            setIsOpen(true)
            return;
        } else {
            router.push({
                pathname: 'dashboard',
                query: {
                    year: year,
                    ...(() => {
                        if (county?.childNodes[3]?.value) {
                            return {
                                county: county?.childNodes[3]?.value
                            }
                        }

                        if (subCounty?.childNodes[3]?.value) {
                            return {
                                sub_county: subCounty?.childNodes[3]?.value
                            }
                        }

                        if (ward?.childNodes[3]?.value) {
                            return {
                                ward: ward?.childNodes[3]?.value
                            }
                        }

                        return {}

                    })()
                }
            })
        }

    }


    function handleCountyOrgUnitChange(value) {

        const year = document.querySelector("#year-filter")
        const subCounty = document.querySelector("#sub-county-filter")
        const ward = document.querySelector("#ward-filter")

        const orgUnit = value.value //event.target.value


        if (orgUnit) {
            router.push({
                pathname: 'dashboard',
                query: {
                    county: orgUnit,
                    ...(() => {
                        if (year?.childNodes[3]?.value) {
                            return {
                                year: year.childNodes[3]?.value
                            }
                        }

                        if (subCounty?.childNodes[3]?.value) {
                            return {
                                sub_county: subCounty.childNodes[3]?.value
                            }
                        }

                        if (ward?.childNodes[3]?.value) {
                            return {
                                ward: ward.childNodes[3]?.value
                            }
                        }

                        return {}

                    })()
                }
            })

        }
    }

    function handleSubCountyOrgUnitChange(value) {

        // event.preventDefault()

        const year = document.querySelector("#year-filter")
        const county = document.querySelector("#county-filter")
        const ward = document.querySelector("#ward-filter")

        const orgUnit = value.value //event.target.value



        if (orgUnit) {
            router.push({
                pathname: 'dashboard',
                query: {
                    sub_county: orgUnit,
                    ...(() => {
                        if (year?.childNodes[3]?.value) {
                            return {
                                year: year.childNodes[3]?.value
                            }
                        }

                        if (county?.childNodes[3]?.value) {
                            return {
                                county: county?.childNodes[3]?.value
                            }
                        }

                        if (ward?.childNodes[3]?.value) {
                            return {
                                ward: ward?.childNodes[3]?.value
                            }
                        }

                        return {}

                    })()
                }
            })

        }
    }

    function handleWardOrgUnitChange(value) {

        // event.preventDefault()

        const year = document.querySelector("#year-filter")
        const county = document.querySelector("#county-filter")
        const subCounty = document.querySelector("#sub-county-filter")

        const orgUnit = value.value //event.target.value


        if (orgUnit) {
            router.push({
                pathname: 'dashboard',
                query: {
                    ward: orgUnit,
                    ...(() => {
                        if (ward?.childNodes[3]?.value) {
                            return {
                                year: ward?.childNodes[3]?.value
                            }
                        }

                        if (county?.childNodes[3]?.value) {
                            return {
                                county: county?.childNodes[3]?.value
                            }
                        }

                        if (subCounty?.childNodes[3]?.value) {
                            return {
                                sub_county: subCounty?.childNodes[3]?.value
                            }
                        }

                        return {}

                    })()
                }
            })

        }
    }

    function handlePresentationChange({value}, chart_type) {
        if(chart_type == 'owner_chart') setOwnerPresentationType(value)
        if(chart_type == 'facility_type_chart') setFacilityTypePresentationType(value)
        if(chart_type == 'facility_summary_chart') setSummaryPresentationType(value)
        if(chart_type == 'chu_summary_chart') setCHUSummaryPresentationType(value)
        if(chart_type == 'recent_changes_chart') setRecentChangesPresentationType(value)
        if(chart_type == 'facility_keph_chart') setFacilityKephPresentationType(value)
        if(chart_type == 'facility_chu_chart') setFacilityCHUsPresentationType(value)
        
    }

    function defaultPresentation(chart_type) {
        if(chart_type == 'owner_chart') {
            chartPresentationOptions.find(({value}) => value == ownerPresentationType)
        }
        if(chart_type == 'facility_type_chart') chartPresentationOptions.find(({value}) => value == facilityTypePresentationType)
        if(chart_type == 'facility_summary_chart') chartPresentationOptions.find(({value}) => value == summaryPresentationType)
        if(chart_type == 'chu_summary_chart') chartPresentationOptions.find(({value}) => value == chuSummaryPresentationType)
        if(chart_type == 'recent_changes_chart') chartPresentationOptions.find(({value}) => value == recentChangesPresentationType)
        if(chart_type == 'facility_keph_chart') chartPresentationOptions.find(({value}) => value == facilityKephPresentationType)
        if(chart_type == 'facility_chu_chart') chartPresentationOptions.find(({value}) => value == facilityCHUsPresentationType)
    }


    if (isClient) {

        // return (
        //     <pre>
        //         {
        //             JSON.stringify(props, null, 2)
        //         }
        //     </pre>
        // )

        return (
            <div className="">
                <Head>
                    <title>KMHFR | Dashboardboard</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>

                    <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-1 md:grid-cols-6 gap-3 md:mt-3 md:mb-12 mb-6 px-4 md:px-0">
                        <div className="col-span-6 flex flex-col gap-3 md:gap-5 mb-8 ">
                            {/* Debug */}

                            <div className="no-print flex flex-row gap-2 md:text-base py-3">
                                {/* <Link className="text-gray-700" href="/" >Home</Link>  */}
                                {/* <span className="text-gray-600 text-2xl">Dashboard</span>  */}

                            </div>



                            <div className="flex flex-col w-full md:flex-wrap lg:flex-row xl:flex-row gap-1 text-sm md:text-base items-center justify-between">






                                <div className="w-full flex justify-between">
                                    {/* {
                                        <pre>
                                            {
                                                JSON.stringify(Object.entries(props?.query), null, 2)
                                            }
                                        </pre>
                                    } */}

                                    <h1 className="w-full md:w-auto text-4xl tracking-tight font-bold leading-3 flex items-start justify-center gap-x-1 gap-y-2 flex-grow mb-4 md:mb-2 flex-col">
                                        {
                                            Object.entries(props?.query)?.length >= 2 ?
                                                props?.filters?.county?.find(({ id }) => id == Object.entries(props?.query)[1][1])?.name
                                                :
                                                'National'
                                        }
                                    </h1>

                                    {/* show datetime filters */}
                                    {/* --- */}
                                    {user &&
                                        <div className="w-auto flex items-center gap-3">

                                            <div className='w-auto flex realtive'>
                                                <Select
                                                    className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                    options={Years}
                                                    placeholder='Filter by Year'
                                                    name='year'
                                                    id="year-filter"
                                                    onChange={handleYearChange}
                                                />
                                                <span className='absolute inset-y-0 right-0'>x</span>
                                            </div>

                                            {/* County Select */}

                                            {
                                                (groupID == 5 || groupID == 7) &&
                                                filters && Object.keys(filters).length > 0 &&
                                                Object.keys(filters)?.map(ft => (
                                                    <Select
                                                        className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                        name={ft}
                                                        id={"county-filter"}
                                                        options={countyOptions(filters, ft)}
                                                        placeholder={`Filter by ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}`}
                                                        onChange={handleCountyOrgUnitChange} />
                                                ))}

                                            {/* county user */}
                                            {groupID === 1 && <div className="max-w-min">
                                                {subcounties && Object.keys(subcounties).length > 0 &&
                                                    Object.keys(subcounties)?.map(ft => (
                                                        <Select
                                                            className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                            name={ft}
                                                            id="sub-county-filter"
                                                            options={
                                                                subCountyOptions(filters, ft)
                                                            }
                                                            placeholder={`Filter by ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}`}
                                                            onChange={handleSubCountyOrgUnitChange} />

                                                    ))}
                                            </div>
                                            }
                                            {/* sub_county user */}

                                            {groupID === 2 &&
                                                <div className="flex">

                                                    {wards && Object.keys(wards).length > 0 &&
                                                        Object.keys(wards)?.map(ft => (
                                                            <Select name={ft}
                                                                className="max-w-max md:w-[250px] rounded border border-gray-400"
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

                                                                id="ward-filter"
                                                                options={wardOptions(filters, ft)}
                                                                placeholder={`Filter by ${ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}`}
                                                                onChange={handleWardOrgUnitChange} />

                                                        ))}
                                                </div>
                                            }
                                            {/* </div> */}

                                            <div className="relative">
                                                {/* Modal overlay */}
                                                {isOpen && (
                                                    <div className="fixed z-50 inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                                                        {/* Modal content */}
                                                        <div className="bg-white p-4 -md">
                                                            <h1 className="text-lg font-bold mb-2 ">Select Date Range</h1>

                                                            <div className='grid grid-cols-2 gap-4'>
                                                                <div>
                                                                    <label>Start Date</label>
                                                                    <br />
                                                                    <input id='startdate'
                                                                        type="date"
                                                                        className="border border-gray-400 p-2 -md"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>End Date</label>
                                                                    <br />
                                                                    <input id='enddate'
                                                                        type="date"
                                                                        className="border border-gray-400 p-2 -md"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 flex justify-center">
                                                                <button
                                                                    onClick={() => {
                                                                        setIsOpen(false)
                                                                    }
                                                                    }
                                                                    className="w-full px-4 py-2 bg-gray-400 text-white -md mr-2"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setIsOpen(false)
                                                                        let parameters = "?"
                                                                        if (document.getElementById('startdate').value && document.querySelector('#startdate').value) {
                                                                            parameters += "datefrom=" + document.querySelector('#startdate').value
                                                                            parameters += "&dateto=" + document.querySelector('#enddate').value

                                                                        }
                                                                        else {
                                                                            alert("You must select Start Date and End Date")
                                                                            return;
                                                                        }

                                                                        if (props?.query?.county) {
                                                                            parameters += "&county=" + props?.query?.county
                                                                        }
                                                                        if (props?.query?.sub_county) {
                                                                            parameters += "&sub_county=" + props?.query?.sub_county
                                                                        }
                                                                        if (props?.query?.ward) {
                                                                            parameters += "&ward=" + props?.query?.ward
                                                                        }
                                                                        router.push(`/dashboard/${encodeURI(parameters)}`)
                                                                    }
                                                                    }
                                                                    className="w-full px-4 py-2 bg-gray-500 text-white -md"
                                                                >
                                                                    Set
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>


                                            {/* </div> */}
                                            {/* ~~~F L T R S~~~ */}
                                        </div>

                                    }


                                    {/* filter by organizational units  */}
                                    {/* national */}



                                </div>


                            </div>
                        </div>

                        {/* <div id="dashboard" className="w-full grid grid-cols-6 gap-4 px-1 md:px-4 py-2 my-4"> */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facility owners </h4>
                            {
                                    ownerPresentationType !== 'table' ?

                            <Chart
                                title=""
                                categories={Array?.from(props?.data?.owner_types ?? [], cs => cs.name) || []}
                                tooltipsuffix="#"
                                xaxistitle={ownerPresentationType.includes('pie') ? null : "Owner Type"}
                                yaxistitle={ownerPresentationType.includes('pie') ? null : "Count"}
                                type={ownerPresentationType}
                                data={(() => {
                                    let data = [];
                                    data?.push({
                                        name: 'Facilities',
                                        data: Array.from(props?.data?.owner_types ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                    });
                                    return data;
                                })() || []} />
                            
                                :
                                <table className="w-full h-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {props?.data?.owner_types?.map((ts, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                            }
                            <Select 
                            name="owner_chart_type" 
                            options={chartPresentationOptions} 
                            value={defaultPresentation('owner_chart')}
                            onChange={value => handlePresentationChange(value, 'owner_chart')}
                            placeholder="presentation type"
                            title="Select Presentation Type" 
                            className='self-end'/>
                            


                           
                        </div>

                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facility Types </h4>
                            {
                                    facilityTypePresentationType !== 'table' ?

                            <Chart
                                title=""
                                categories={Array?.from(props?.data?.types_summary ?? [], cs => cs.name) || []}
                                tooltipsuffix="#"
                                xaxistitle={facilityTypePresentationType.includes('pie') ? null : "Facility Type"}
                                yaxistitle={facilityTypePresentationType.includes('pie') ? null : "Count"}
                                type={facilityTypePresentationType}
                                data={(() => {
                                    let data = [];
                                    data?.push({
                                        name: 'Facilities',
                                        data: Array.from(props?.data?.types_summary ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                    });
                                    return data;
                                })() || []} />
                                :
                                <table className="w-full h-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {props?.data?.types_summary?.map((ts, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                            }
                            <Select 
                            name="facility_type_chart" 
                            options={chartPresentationOptions} 
                            value={defaultPresentation('facility_type_chart')}
                            onChange={value => handlePresentationChange(value, 'facility_type_chart')}
                            placeholder="presentation type"
                            title="Select Presentation Type" 
                            className='self-end'/>
                        </div>

                        {/* Facilities summary 1/3 - FILTERABLE */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facilities summary</h4>
                            {
                                    summaryPresentationType !== 'table' ?
                            <Chart
                                title=""
                                categories={Array?.from(totalSummary ?? [], cs => cs.name) || []}
                                tooltipsuffix="#"
                                xaxistitle={summaryPresentationType.includes('pie') ? null : "Facility Summaries"}
                                yaxistitle={summaryPresentationType.includes('pie') ? null : "Count"}
                                type={summaryPresentationType}
                                data={(() => {
                                    let data = [];
                                    data?.push({
                                        name: 'Facilities',
                                        data: Array.from(totalSummary ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                    });
                                    return data;
                                })() || []} />
                            :
                                <table className="w-full h-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {totalSummary?.map((ts, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                            }
                            <Select 
                            name="facility_summary_chart" 
                            options={chartPresentationOptions} 
                            value={defaultPresentation('facility_summary_chart')}
                            onChange={value => handlePresentationChange(value, 'facility_summary_chart')}
                            placeholder="presentation type"
                            title="Select Presentation Type" 
                            className='self-end'/>
                        </div>
                        {/* CUs summary - FILTERABLE 1/3 */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Community Units summary</h4>
                            {
                                    chuSummaryPresentationType !== 'table' ?
                            <Chart
                                title=""
                                categories={Array?.from(totalSummary ?? [], cs => cs.name) || []}
                                tooltipsuffix="#"
                                xaxistitle={chuSummaryPresentationType.includes('pie') ? null : "Community Unit Summary"}
                                getFullYearaxistitle={chuSummaryPresentationType.includes('pie') ? null : "Count"}
                                type={chuSummaryPresentationType}
                                data={(() => {
                                    let data = [];
                                    data?.push({
                                        name: 'Community Units',
                                        data: Array.from(chuSummary ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                    });
                                    return data;
                                })() || []} />
                            :
                                <table className="w-full h-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {chuSummary?.map((ts, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                            }
                            <Select 
                            name="chu_summary_chart" 
                            options={chartPresentationOptions} 
                            value={defaultPresentation('chu_summary_chart')}
                            onChange={value => handlePresentationChange(value, 'chu_summary_chart')}
                            placeholder="presentation type"
                            title="Select Presentation Type" 
                            className='self-end'/>
                            
                        </div>
                        {/* Recent changes 1/3 - FILTERABLE */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Recent changes</h4>
                            {
                                    recentChangesPresentationType !== 'table' ?
                            <Chart
                                title=""
                                categories={Array?.from(totalSummary ?? [], cs => cs.name) || []}
                                tooltipsuffix="#"
                                xaxistitle={recentChangesPresentationType.includes('pie') ? null : "Recent Changes"}
                                yaxistitle={recentChangesPresentationType.includes('pie') ? null : "Count"}
                                type={recentChangesPresentationType}
                                data={(() => {
                                    let data = [];
                                    data?.push({
                                        name: 'Community Units',
                                        data: Array.from(recentChanges ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                    });
                                    return data;
                                })() || []} />
                            :
                                <table className="w-full h-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {recentChanges?.map((ts, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                            }
                            <Select 
                            name="recent_changes_chart" 
                            options={chartPresentationOptions} 
                            value={defaultPresentation('recent_changes_chart')}
                            onChange={value => handlePresentationChange(value, 'recent_changes_chart')}
                            placeholder="presentation type"
                            title="Select Presentation Type" 
                            className='self-end'/>
                            
                        </div>
                        {/* facilities by keph level */}
                        <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-4 font-semibold text-gray-900">Facility KEPH Level </h4>
                            {
                                    facilityKephPresentationType !== 'table' ?
                            <Chart
                                title=""
                                categories={Array?.from(props?.data?.keph_level ?? [], cs => cs.name) || []}
                                tooltipsuffix="#"
                                xaxistitle=""
                                yaxistitle=""
                                type={facilityKephPresentationType}
                                data={(() => {
                                    let data = [];
                                    data?.push({
                                        name: 'Facilities',
                                        data: Array.from(props?.data?.keph_level ?? [], cs => ({ name: cs.name, y: parseFloat(cs.count) })) || []
                                    });
                                    return data;
                                })() || []} />
                                :
                                <table className="w-full h-full text-sm md:text-base p-2">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                        <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg">
                                    {props?.data?.keph_level?.map((ts, i) => (
                                        <tr key={i}>
                                            <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                                <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                            }
                            <Select 
                            name="facility_keph_chart" 
                            options={chartPresentationOptions} 
                            value={defaultPresentation('facility_keph_chart')}
                            onChange={value => handlePresentationChange(value, 'facility_keph_chart')}
                            placeholder="presentation type"
                            title="Select Presentation Type" 
                            className='self-end'/>

                            
                        </div>
                        {/* Facilities & CHUs by county (bar) 1/1 */}
                        {(groupID === 7 || groupID === 5) &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 border-b text-center border-gray-100 w-full mb-2 font-semibold text-gray-900">Facilities &amp; CHUs by County</h4>
                             

                                <Chart
                                    title=""
                                    categories={Array?.from(props?.data?.county_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="County"
                                    yaxistitle="Number"
                                    type={facilityCHUsPresentationType}
                                    data={(() => {
                                        let data = [];
                                        data?.push({
                                            name: 'Facilities',
                                            data: Array.from(props?.data?.county_summary ?? [], cs => parseFloat(cs.count)) || []
                                        });
                                        data?.push({
                                            name: 'CHUs',
                                            data: Array.from(props?.data?.county_summary ?? [], cs => parseFloat(cs.chu_count)) || []
                                        });
                                        return data;
                                    })() || []} />
                                   
                                <Select 
                                name="facility_chu_chart" 
                                options={chartPresentationOptions.filter(({value}) => (value !== 'pie' && value !== 'table'))} 
                                value={defaultPresentation('facility_chu_chart')}
                                onChange={value => handlePresentationChange(value, 'facility_chu_chart')}
                                placeholder="presentation type"
                                title="Select Presentation Type" 
                                className='self-end'/>
                                
                            </div>
                        }
                        {/* Facilities & CHUs by subcounties (bar) 1/1 */}
                        {groupID === 1 &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-gray-900">Facilities &amp; CHUs by Subcounty</h4>
                                <Chart
                                    title=""
                                    categories={Array?.from(props?.data?.constituencies_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="Subcounty"
                                    yaxistitle="Number"
                                    type="column"
                                    data={(() => {
                                        let data = [];
                                        data?.push({
                                            name: 'Facilities',
                                            data: Array.from(props?.data?.constituencies_summary ?? [], cs => parseFloat(cs.count)) || []
                                        });
                                        data?.push({
                                            name: 'CHUs',
                                            data: Array.from(props?.data?.constituencies_summary ?? [], cs => parseFloat(cs.chu_count)) || []
                                        });
                                        return data;
                                    })() || []} />
                            </div>
                        }
                        {/* Facilities & CHUs by ward (bar) 1/1 */}
                        {groupID === 2 &&
                            <div className="no-print col-span-6 flex flex-col items-start justify-start p-3 shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                                <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-gray-900">Facilities &amp; CHUs by Ward</h4>
                                <Chart
                                    title=""
                                    categories={Array?.from(props?.data?.wards_summary ?? [], cs => cs.name) || []}
                                    tooltipsuffix="#"
                                    xaxistitle="Ward"
                                    yaxistitle="Number"
                                    type="bar"
                                    data={(() => {
                                        let data = [];
                                        data?.push({
                                            name: 'Facilities',
                                            data: Array.from(props?.data?.wards_summary ?? [], cs => parseFloat(cs.count)) || []
                                        });
                                        data?.push({
                                            name: 'CHUs',
                                            data: Array.from(props?.data?.wards_summary ?? [], cs => parseFloat(cs.chu_count)) || []
                                        });
                                        return data;
                                    })() || []} />
                            </div>
                        }
                        {/* Facility owners & categories - national summary - FILTERABLE (bar) 1/2 */}
                        <div className="no-print col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3 shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-gray-900">Facility owners</h4>
                            <Chart
                                title=""
                                categories={Array.from(props?.data?.owner_types ?? [], ot => ot.name) || []}
                                tooltipsuffix="#"
                                xaxistitle="Owner"
                                yaxistitle="Number"
                                type="column"
                                data={(() => {
                                    return [{ name: "Owner", data: Array.from(props?.data?.owner_types ?? [], ot => parseFloat(ot.count)) || [] }];
                                })() || []} />
                        </div>
                        {/* Facility types - national summary - FILTERABLE (bar) 1/2 */}
                        <div className="no-print col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3  shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                            <h4 className="text-lg uppercase pt-4 text-center border-b border-gray-100 w-full mb-2 font-semibold text-gray-900">Facility types</h4>
                            <Chart
                                title=""
                                categories={Array.from(props?.data?.types_summary ?? [], ts => ts.name) || []}
                                tooltipsuffix="#"
                                xaxistitle="Type"
                                yaxistitle="Number"
                                type="column"
                                data={(() => {
                                    return [{ name: "Type", data: Array.from(props?.data?.types_summary ?? [], ts => parseFloat(ts.count)) || [] }];
                                })() || []} />
                        </div>


                        {/* Floating div at bottom right of page */}
                        {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-gray-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
                            <h5 className="text-sm font-bold">
                                <span className="text-gray-600 uppercase">Limited results</span>
                            </h5>
                            <p className="text-sm text-gray-800">
                                For testing reasons, results are limited at the moment.
                            </p>
                        </div> */}
                        {/* </div> */}

                        <style jsx global>{`
                        @media print {
                        /* Exclude the content with the "no-print" class */
                        .no-print {
                            display: none;
                        }
                        .main{
                            display:inline-block;
                            width:100%;
                        }
                        .card{
                            width:100%;
                            background-color: #fff;
                            border: 1px solid #e4e7ea;
                            margin: 20px;
                            padding: 20px;
                            box-shadow:0 0 0 0;
                            
                        }
                        }
                    `}</style>
                    </div>
                </MainLayout>
            </div>
        )
    }
    else {
        return null
    }
}


Dashboard.propTypes = {

    json: propTypes.object,
    query: propTypes.object,
    filter: propTypes.object,
    path: propTypes.string,
    current: propTypes.string,
    api_url: propTypes.string,

}

Dashboard.defaultProps = {
    api_url: `${process.env.NEXT_PUBLIC_API_URL}`,
    path: '/dashboard',
    current: `${process.env.NEXT_PUBLIC_API_URL}/facilities/dashboard`
}


export async function getServerSideProps(ctx) {


    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )


    const token = (await checkToken(ctx.req, ctx.res))?.token


    let query = { 'searchTerm': '' }

    async function fetchFilters(apiToken) {

        let url = `${process.env.NEXT_PUBLIC_API_URL}/common/filtering_summaries/?fields=county`

        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`
        }


        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Accept': 'application/json'
            }
        })
            .then(resp => resp.json())
            .catch(console.error)
    }

    async function fetchDashboardData(token) {

        let url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/dashboard`

        let other_posssible_filters = ["datefrom", "dateto", "county", "sub_county", "ward"]
        //ensure county and subcounties parameters are passed if the user is countyuser or subcountyuser respectively

        other_posssible_filters?.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                if (url.includes('?')) {
                    url += `&${flt}=${ctx?.query[flt]}`
                } else {
                    url += `?${flt}=${ctx?.query[flt]}`
                }
            }
        })

        return fetch(url, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then(json => ({
                data: json

            }))
            .catch(e => console.error(e.message))
    }


    const ft = await fetchFilters(token)

    const dashboard = await fetchDashboardData(token)


    if (dashboard?.data) {      // console.log({ft, query})
        return {
            props: {
                data: dashboard?.data,
                query,
                filters: { ...ft },

            }
        }
    } else {
        return {
            props: {
                data: null,
                query,
                filters: { ...ft },

            }
        }
    }



}

export default Dashboard


