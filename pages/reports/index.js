import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { checkToken } from '../../controllers/auth/auth';
import MainLayout from '../../components/MainLayout';
import * as Tabs from "@radix-ui/react-tabs";
import { darken, styled } from '@mui/material/styles';
import {
    DataGrid,
    GridToolbar
} from '@mui/x-data-grid';
import { propsToGridData } from '../../components/ReportsData';
import { UserContext } from '../../providers/user';
// import Select from 'react-select';
import { useRouter } from 'next/router';
import { Select as CustomSelect } from '../../components/Forms/formComponents/Select'


const StyledDataGrid = styled(DataGrid)(() => ({
    '& .super-app-theme--Row': {
        borderTop: `1px solid ${darken('rgba(5, 150, 105, 1)', 1)}`,
        FontFace: 'IBM Plex Sans'
    },
    '& .super-app-theme--Cell': {
        borderRight: `1px solid ${darken('rgba(5, 150, 105, 0.4)', 0.2)}`,
        FontFace: 'IBM Plex Sans'

    }
}))


function Reports(props) {

    const userCtx = useContext(UserContext);
    const [user, setUser] = useState(userCtx);
    // const [orgUnitFilter, setOrgUnitFilter] = useState('county')
    // const [fileteredReports, setFilteredReports] = useState({})

    const [bedsCotsReport, setBedsCotsReport] = useState({ rows: null, columns: null })
    const [kephReport, setKephReport] = useState({ rows: null, columns: null })
    const [ownershipReport, setOwnershipReport] = useState({ rows: null, columns: null })
    const [facilityTypeReport, setFacilityTypeReport] = useState({ rows: null, columns: null })
    const [facilityRegulatorReport, setFacilityRegulatorReport] = useState({ rows: null, columns: null })
    const [servicesReport, setServicesReport] = useState({ rows: null, columns: null })
    const [infrastructureCategoryReport, setInfrasturctureCategoryReport] = useState({ rows: null, columns: null })
    const [infrastructureReport, setInfrasturctureReport] = useState({ rows: null, columns: null })
    const [hrCategoryReport, setHrReportCategory] = useState({ rows: null, columns: null })
    const [hrReport, setHrReport] = useState({ rows: null, columns: null })
    const [gisReport, setGisReport] = useState({ rows: null, columns: null })
    const [accreditationReport, setAccreditationReport] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [selectedOrgUnit, setSelectedOrgUnit] = useState(null)
    const [selectedKeph, setSelectedKeph] = useState(null)
    const [selectedOwner, setSelectedOwner] = useState(null)
    const [selectedType, setSelectedType] = useState(null)


    const router = useRouter()
    // Constants

    const [reportTitle, setReportTitle] = useState('Beds and Cots');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {

    }, [reportTitle])

    useEffect(() => {
        setUser(userCtx)
        if (user.id === 6) {
            router.push('/auth/login')
        }

        setIsClient(true);

        setBedsCotsReport({
            rows: propsToGridData(props, 0)?.rows,
            columns: propsToGridData(props, 0)?.columns
        })

        setKephReport({
            rows: propsToGridData(props, 1)?.rows,
            columns: propsToGridData(props, 1)?.columns
        })

        setOwnershipReport({
            rows: propsToGridData(props, 2)?.rows,
            columns: propsToGridData(props, 2)?.columns
        })
        setFacilityTypeReport({
            rows: propsToGridData(props, 3)?.rows,
            columns: propsToGridData(props, 3)?.columns
        })
        setFacilityRegulatorReport({
            rows: propsToGridData(props, 4)?.rows,
            columns: propsToGridData(props, 4)?.columns
        })
        setServicesReport({
            rows: propsToGridData(props, 5)?.rows,
            columns: propsToGridData(props, 5)?.columns
        })
        setInfrasturctureCategoryReport({
            rows: propsToGridData(props, 6)?.rows,
            columns: propsToGridData(props, 6)?.columns
        })
        setInfrasturctureReport({
            rows: propsToGridData(props, 7)?.rows,
            columns: propsToGridData(props, 7)?.columns
        })
        setHrReportCategory({
            rows: propsToGridData(props, 8)?.rows,
            columns: propsToGridData(props, 8)?.columns
        })
        setHrReport({
            rows: propsToGridData(props, 9)?.rows,
            columns: propsToGridData(props, 9)?.columns
        })
        setGisReport({
            rows: propsToGridData(props, 10)?.rows,
            columns: propsToGridData(props, 10)?.columns
        })
        setAccreditationReport({
            rows: propsToGridData(props, 11)?.rows,
            columns: propsToGridData(props, 11)?.columns
        })




    }, [])


    async function handleCustomSelectChange(event, reportType, token, filter) {

        if (selectedOrgUnit !== null) {
            setSelectedOrgUnit(null)
        }

        if (selectedPeriod !== null) {
            setSelectedPeriod(null)
        }

        if (selectedKeph !== null) {
            setSelectedKeph(null)
        }

        if (selectedType !== null) {
            setSelectedType(null)
        }

        if (selectedOwner !== null) {
            setSelectedOwner(null)
        }

        

        if (event.target) {
            // setOrgUnitFilter(value)

            const value = event.target?.value

            switch (filter) {
                case 'year':
                    setSelectedPeriod(value)
                    break;
                case 'org_unit':
                    setSelectedOrgUnit(value)
                    break;
                case 'keph':
                    setSelectedKeph(value)
                    break;
                case 'type':
                    setSelectedType(value)
                    break;
                case 'owner':
                    setSelectedOwner(value)
                    break;
                
            }

            const filterType = ((filterType) => {

                switch (filterType) {
                    case 'year':
                        return 'report_year'
                    case 'org_unit':
                        return 'report_groupby'
                    case 'keph':
                        return 'filter_keph'
                    case 'type':
                        return 'filter_type'
                    case 'owner':
                        return 'filter_owner'
                }
            })(filter)

            let filterReport = {}
            setLoading(true)

            try {
                const report = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${reportType}&${filterType}=${value}`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                filterReport = { 
                    [`${reportType}`]: reportType.includes("facility_infrastructure_report_all_hierachies") || reportType.includes("facility_human_resource_category_report_all_hierachies") ? 
                    (await report.json())?.results : 
                    (await report.json())?.results?.results 
                }
                // setFilteredReports({[`${reportType}`]: (await report.json())?.results?.results } ?? {})
            } catch (e) {
                console.error("Error: ", e.message)
            } finally {

                setLoading(false)
                switch (reportType) {
                    case 'beds_and_cots_by_all_hierachies':


                        const bedscots = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 0, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 0)
                            }
                        })(filter)

                        setBedsCotsReport({
                            rows: bedscots?.rows,
                            columns: bedscots?.columns
                        })

                        break;
                    case 'facility_keph_level_report_all_hierachies':

                        const keph = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 1, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 1)
                            }
                        })(filter)

                        setKephReport({
                            rows: keph?.rows,
                            columns: keph?.columns
                        })

                        break;
                    case 'facility_owner_report_all_hierachies':

                        const owner = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 2, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 2)
                            }
                        })(filter)

                        setOwnershipReport({
                            rows: owner?.rows,
                            columns: owner?.columns
                        })

                        break;
                    case 'facility_type_report_all_hierachies':

                        const type = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 3, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 3)
                            }
                        })(filter)

                        setFacilityTypeReport({
                            rows: type?.rows,
                            columns: type?.columns
                        })

                        break;
                    case 'facility_regulatory_body_report_all_hierachies':

                        const reg = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 4, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 4)
                            }
                        })(filter)

                        setFacilityRegulatorReport({
                            rows: reg?.rows,
                            columns: reg?.columns
                        })

                        break;
                    case 'facility_services_report_all_hierachies':

                        const services = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 5, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 5)
                            }
                        })(filter)

                        setServicesReport({
                            rows: services?.rows,
                            columns: services?.columns
                        })

                        break;
                    case 'facility_infrastructure_report_all_hierachies':

                        const infra_cat = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 6, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 6)
                            }
                        })(filter)

                        setInfrasturctureCategoryReport({
                            rows: infra_cat?.rows,
                            columns: infra_cat?.columns
                        })


                        const infra = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 7, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 7)
                            }
                        })(filter)

                        setInfrasturctureReport({
                            rows: infra?.rows,
                            columns: infra?.columns
                        })

                        break;
                    case 'facility_human_resource_category_report_all_hierachies':

                        const hr_category = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 8, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 8)
                            }
                        })(filter)

                        setHrReportCategory({
                            rows: hr_category?.rows,
                            columns: hr_category?.columns
                        })

                        const hr = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 9, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 9)
                            }
                        })(filter)

                        setHrReport({
                            rows: hr?.rows,
                            columns: hr?.columns
                        })

                        break;
                    case 'gis':

                        const gis = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 10, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 10)
                            }
                        })(filter)

                        setGisReport({
                            rows: gis?.rows,
                            columns: gis?.columns
                        })

                        break;
                        case 'accreditation':

                        const nhif = ((filterType) => {
                            if (filterType == 'org_unit') {
                                return filterReport && propsToGridData(filterReport, 11, value)
                            } else {
                                return filterReport && propsToGridData(filterReport, 11)
                            }
                        })(filter)

                        setAccreditationReport({
                            rows: nhif?.rows,
                            columns: nhif?.columns
                        })

                        break;



                }
            }
        }



    }

    const periodOptions = (() => {

        let currentYear = new Date().getFullYear()

        const periodOptions = []

        for (const _ of new Array(5)) {

            periodOptions.push(
                {
                    label: currentYear.toString(),
                    value: currentYear.toString()
                }
            )

            currentYear -= 1

        }

        return periodOptions

    })()

    const orgUnitOptions = [
        {
            label: 'County',
            value: 'county'
        },
        {
            label: 'Sub County',
            value: 'sub_county'
        },
        {
            label: 'Ward',
            value: 'ward'
        }

    ]


    
    if (isClient) {
        return (
            <div className="w-full">
                <Head>
                    <title>KMHFR | Reports</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>


                <MainLayout isLoading={false} isFullWidth={false}>
                    <div className="w-full md:w-[85%] md:mx-auto grid grid-cols-7 gap-4 p-1  my-3">
                        {/* Header */}
                        <div className="col-span-1 md:col-span-7 flex-1 flex-col items-start justify-start gap-4">
                            {/* Breadcramps */}
                            <div className="flex flex-row gap-2 text-sm md:text-base md:my-3">
                                <Link className="text-gray-700" href="/">
                                    Home
                                </Link>
                                {"/"}
                                <Link className="text-gray-700" href="/reports">
                                    Reports
                                </Link>
                                {"/"}
                                <span className="text-gray-700" href="/facilities">
                                    {reportTitle} Report
                                </span>


                            </div>
                            {/* Header Bunner  */}
                            <div
                                className={
                                    `col-span-5 mt-4 grid grid-cols-6 gap-5  md:gap-8 py-6 w-full bg-transparent border ${"border-gray-600"} drop-shadow  text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 
                    ${"border-gray-600"}
                `}
                            >
                                <div className="col-span-6 md:col-span-3">
                                    <h1 className="text-4xl tracking-tight font-bold leading-tight">
                                        {reportTitle} Report
                                    </h1>
                                    <div className="flex flex-col gap-1 w-full items-start justify-start">

                                    </div>
                                </div>

                            </div>
                        </div>



                        {/* Tabs */}
                        <div className='w-full col-span-1 md:col-span-7 flex shadow-sm bg-gray-50 px-0 mx-0 h-700 flex-1'>

                            <Tabs.Root
                                orientation="horizontal"
                                className="w-full flex flex-col tab-root"
                                defaultValue="facilities"
                            >
                                

                                <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-gray-400">
                                    {/* Facilities Tab */}
                                    <Tabs.Tab
                                        id={1}
                                        value="facilities"
                                        className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                        onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setSelectedKeph(null); setSelectedOwner(null); setSelectedType(null) }}
                                    >
                                        Facility Reports
                                    </Tabs.Tab>
                                    {/* CHUs Tab */}
                                    <Tabs.Tab
                                        id={2}
                                        value="chus"
                                        className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                        onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setSelectedKeph(null); setSelectedOwner(null); setSelectedType(null) }}
                                    >
                                        Community Health Unit Reports
                                    </Tabs.Tab>
                                </Tabs.List>
                                {/* Facility Reports*/}
                                <Tabs.Panel
                                    value="facilities"
                                    className="grow-1 tab-panel"
                                >
                                    <Tabs.Root
                                        orientation="horizontal"
                                        className="w-full flex flex-col tab-root"
                                        defaultValue="beds_cots"
                                    >

                                    <pre>{
                                        JSON.stringify(infrastructureCategoryReport?.rows, null, 2)
                                        }</pre>

                                        <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-gray-400">
                                            <Tabs.Tab
                                                id={1}
                                                value="beds_cots"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Beds and Cots') }}
                                            >
                                                Beds and Cots
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={2}
                                                value="keph_level"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Keph Level') }}
                                            >
                                                Keph Level
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={3}
                                                value="facility_ownership"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Facility Ownership') }}
                                            >
                                                Facility Ownership
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={4}
                                                value="facility_type"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Facility Type') }}
                                            >
                                                Facility Type
                                            </Tabs.Tab>

                                            <Tabs.Tab
                                                id={5}
                                                value="regulatory_body"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Regulatory Body') }}
                                            >
                                                Regulatory Body
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={6}
                                                value="services"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Services') }}
                                            >
                                                Services
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={7}
                                                value="infrastructure_category"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Infrastructure Category') }}
                                            >
                                                Infrastructure category
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={8}
                                                value="infrastructure"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Infrastructure') }}
                                            >
                                                Infrastructure
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={9}
                                                value="human_resources_category"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Human Resources Category') }}

                                            >
                                                Human resources Category
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={10}
                                                value="human_resources"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Human Resources') }}

                                            >
                                                Human resources
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={11}
                                                value="geocodes"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('Geo Location') }}

                                            >
                                                Geo Codes
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={12}
                                                value="accreditation"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                                onClick={() => { setSelectedOwner(null); setSelectedType(null); setSelectedKeph(null); setSelectedOrgUnit(null); setSelectedPeriod(null); setReportTitle('NHIF Accreditation'); }}

                                            >
                                                NHIF Accreditation
                                            </Tabs.Tab>

                                            {/* <Tabs.Tab
                                            id={4}
                                            value="regulatory_body"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                            Facility Incharge Details
                                            </Tabs.Tab> */}

                                        </Tabs.List>

                                        {/* Beds and Cots Report */}
                                        <Tabs.Panel
                                            value="beds_cots"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Beds and Cots Data Grid */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={bedsCotsReport?.columns}
                                                    rows={bedsCotsReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>
                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'beds_and_cots_by_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'beds_and_cots_by_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'beds_and_cots_by_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'beds_and_cots_by_all_hierachies', props?.token, 'year')}
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'

                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'beds_and_cots_by_all_hierachies', props?.token, 'org_unit')}
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'

                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>


                                        </Tabs.Panel>

                                        {/* Keph Level Report */}
                                        <Tabs.Panel
                                            value="keph_level"
                                            className="grow-1 tab-panel"

                                        >
                                            {/* Keph Level Data grid */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={kephReport?.columns}
                                                    rows={kephReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_keph_level_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_keph_level_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_keph_level_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_keph_level_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'


                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_keph_level_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'


                                                                    />
                                                                </div>

                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* Ownerp Report */}
                                        <Tabs.Panel
                                            value="facility_ownership"
                                            className="grow-1 tab-panel"

                                        >
                                            {/* Facility Ownership */}
                                            <div className='shadow-mdw-full  max-h-min col-span-7'>

                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={ownershipReport?.columns}
                                                    rows={ownershipReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    sx={{ overflowX: 'scroll' }}
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_owner_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_owner_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_owner_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_owner_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'

                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_owner_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'

                                                                    />

                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* Facility Type Report */}
                                        <Tabs.Panel
                                            value="facility_type"
                                            className="grow-1 tab-panel"

                                        >
                                            {/* Facility Type */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={facilityTypeReport?.columns}
                                                    rows={facilityTypeReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />
                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_type_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_type_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_type_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />


                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_type_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_type_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* Facility Regulatory Body Report */}
                                        <Tabs.Panel
                                            value="regulatory_body"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Regulatory Body  */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={facilityRegulatorReport?.columns}
                                                    rows={facilityRegulatorReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />
                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_regulatory_body_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_regulatory_body_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_regulatory_body_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_regulatory_body_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_regulatory_body_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        </Tabs.Panel>

                                        {/* Facility Serivece Report */}
                                        <Tabs.Panel
                                            value="services"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Services */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={servicesReport?.columns}
                                                    rows={servicesReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_services_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_services_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_services_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_services_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_services_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* Facility Infrastructure Report */}
                                        <Tabs.Panel
                                            value="infrastructure"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Infrastructure */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={infrastructureReport?.columns}
                                                    rows={infrastructureReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />


                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>


                                        </Tabs.Panel>

                                        {/* Facility Infrastructure Category Report */}
                                        <Tabs.Panel
                                            value="infrastructure_category"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Infrastructure */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={infrastructureCategoryReport?.columns}
                                                    rows={infrastructureCategoryReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />


                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_infrastructure_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>


                                        </Tabs.Panel>

                                        {/* HR Report Category*/}
                                        <Tabs.Panel
                                            value="human_resources_category"
                                            className="grow-1 tab-panel"
                                        >

                                            {/* Human resource */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={hrCategoryReport?.columns}
                                                    rows={hrCategoryReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />


                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* HR Report */}
                                        <Tabs.Panel
                                            value="human_resources"
                                            className="grow-1 tab-panel"
                                        >

                                            {/* Human resource */}

                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={hrReport?.columns}
                                                    rows={hrReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />


                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_human_resource_category_report_all_hierachies', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* GIS Report */}
                                        <Tabs.Panel
                                            value="geocodes"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Geocodes */}
                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={gisReport?.columns}
                                                    rows={gisReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'gis', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'gis', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'gis', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'gis', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'gis', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>

                                        {/* GIS Report */}
                                        <Tabs.Panel
                                            value="accreditation"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* Geocodes */}
                                            <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={accreditationReport?.columns}
                                                    rows={accreditationReport?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                        toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                                <GridToolbar
                                                                    className="border border-gray-300"
                                                                    sx={{
                                                                        flex: 1,
                                                                        display: 'flex',
                                                                        marginX: 0,
                                                                        gap: 5,
                                                                        alignItems: 'start',

                                                                    }}
                                                                />

                                                                <div className='max-w-min flex gap-x-2 justify-end mr-2'>

                                                                    <CustomSelect
                                                                        name="keph"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_nhif_accreditation', props?.token, 'keph')}
                                                                        options={props?.kephOptions}
                                                                        defaultValue={selectedKeph}
                                                                        placeholder='Filter by Keph'

                                                                    />

                                                                    <CustomSelect
                                                                        name="type"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_nhif_accreditation', props?.token, 'type')}
                                                                        options={props?.typeOptions}
                                                                        defaultValue={selectedType}
                                                                        placeholder='Filter by Type'

                                                                    />

                                                                    <CustomSelect
                                                                        name="owner"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_nhif_accreditation', props?.token, 'owner')}
                                                                        options={props?.ownerOptions}
                                                                        defaultValue={selectedOwner}
                                                                        placeholder='Filter by Owner'

                                                                    />

                                                                    <CustomSelect
                                                                        name="year"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_nhif_accreditation', props?.token, 'year')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={periodOptions}
                                                                        defaultValue={selectedPeriod}
                                                                        placeholder='Filter by period'
                                                                    />


                                                                    <CustomSelect
                                                                        name="org_unit"
                                                                        onChange={(e) => handleCustomSelectChange(e, 'facility_nhif_accreditation', props?.token, 'org_unit')}
                                                                        className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                                        options={orgUnitOptions}
                                                                        defaultValue={selectedOrgUnit}
                                                                        placeholder='Filter by Admin Heirachy'
                                                                    />
                                                                </div>
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div>

                                        </Tabs.Panel>


                                    </Tabs.Root>
                                </Tabs.Panel>
                                {/* Community Units Reports */}
                                <Tabs.Panel
                                    value="chus"
                                    className="grow-1 tab-panel"
                                >

                                    <Tabs.Root
                                        orientation="horizontal"
                                        className="w-full flex flex-col tab-root"
                                        defaultValue="chu_services"
                                    >

                                        <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-gray-600">
                                            <Tabs.Tab
                                                id={1}
                                                value="chu_services"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                                CHU Services
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={2}
                                                value="chu_status"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                                CHU Status
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                id={3}
                                                value="chu_count"
                                                className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            >
                                                CHU Count
                                            </Tabs.Tab>


                                        </Tabs.List>

                                        {/* CHU Services Data Grid */}
                                        <Tabs.Panel
                                            value="chu_services"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* CHU Services */}
                                            {/* { console.log({rows:propsToGr, orgUnitFilteridData(props, 9)?.rows, columns: propsToGridData(props, 9).columns})  } */}

                                            {/* <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={propsToGridData(props, 9, orgUnitFilter).columns}
                                                    rows={propsToGridData(props, 9)?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                       toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                            <GridToolbar
                                                                className="border border-gray-300"
                                                                sx={{
                                                                    flex: 1,
                                                                    display: 'flex',
                                                                    marginX: 0,
                                                                    gap: 5,
                                                                    alignItems:'start',
                                                                    
                                                                }}
                                                            />

                                                            <CustomSelect                                               
	    name="year" 
            onChange={({value}) => handleCustomSelectChange(value, 'date', props?.token)}
            className="w-full max-w-xs rounded border mr-2 border-gray-400"
    options={[
        {
            label:'2018',
            value:'2018'
        },
        {
            label:'2019',
            value:'2019'
        },
        {
            label:'2020',
            value:'2020'
        }
    
    
    ]}
    placeholder='Filter by period'
    
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

    
/>

                                                            
                                                            <CustomSelect 
                                                            name="org_unit" 
                                                            onChange={({value}) => handleCustomSelectChange(value, 'beds_and_cots_by_all_hierachies', props?.token)}
                                                            className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                    options={[
                                                        {
                                                            label:'County',
                                                            value:'county'
                                                        },
                                                        {
                                                            label:'Sub County',
                                                            value:'sub_county'
                                                        },
                                                        {
                                                            label:'Ward',
                                                            value:'ward'
                                                        }
                                                    
                                                    
                                                    ]}
                                                    placeholder='Filter by Admin Heirachy'
                                                    
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

                                                    
                                                />
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div> */}
                                        </Tabs.Panel>
                                        {/* CHU Status Data Grid*/}

                                        <Tabs.Panel
                                            value="chu_status"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* CHU Status */}
                                            {/* <div className='shadow-md w-full max-h-min col-span-7'>
                                                { console.log({rows: propsToGridData(props, 7).rows }) }
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={propsToGridData(props, 7, orgUnitFilter).columns}
                                                    rows={propsToGridData(props, 7)?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                       toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                            <GridToolbar
                                                                className="border border-gray-300"
                                                                sx={{
                                                                    flex: 1,
                                                                    display: 'flex',
                                                                    marginX: 0,
                                                                    gap: 5,
                                                                    alignItems:'start',
                                                                    
                                                                }}
                                                            />

                                                            <CustomSelect                                               
	    name="year" 
            onChange={({value}) => handleCustomSelectChange(value, 'date', props?.token)}
            className="w-full max-w-xs rounded border mr-2 border-gray-400"
    options={[
        {
            label:'2018',
            value:'2018'
        },
        {
            label:'2019',
            value:'2019'
        },
        {
            label:'2020',
            value:'2020'
        }
    
    
    ]}
    placeholder='Filter by period'
    
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

    
/>

                                                            
                                                            <CustomSelect 
                                                            name="org_unit" 
                                                            onChange={({value}) => handleCustomSelectChange(value, 'beds_and_cots_by_all_hierachies', props?.token)}
                                                            className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                    options={[
                                                        {
                                                            label:'County',
                                                            value:'county'
                                                        },
                                                        {
                                                            label:'Sub County',
                                                            value:'sub_county'
                                                        },
                                                        {
                                                            label:'Ward',
                                                            value:'ward'
                                                        }
                                                    
                                                    
                                                    ]}
                                                    placeholder='Filter by Admin Heirachy'
                                                    
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

                                                    
                                                />
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div> */}
                                        </Tabs.Panel>

                                        {/* CHU Count Data Grid */}

                                        <Tabs.Panel
                                            value="chu_count"
                                            className="grow-1 tab-panel"
                                        >
                                            {/* CHU Status */}
                                            {/* <div className='shadow-md w-full max-h-min col-span-7'>
                                                <StyledDataGrid
                                                    loading={loading}
                                                    columns={propsToGridData(props, 1, orgUnitFilter0).columns}
                                                    rows={propsToGridData(props, 10)?.rows}
                                                    getRowClassName={() => `super-app-theme--Row`}
                                                    rowSpacingType="border"
                                                    showColumnRightBorder
                                                    showCellRightBorder
                                                    rowSelection={false}
                                                    getCellClassName={() => 'super-app-theme--Cell'}
                                                    slots={{
                                                       toolbar: () => (
                                                            <div className='w-full flex justify-between border-b border-gray-400 py-2'>
                                                            <GridToolbar
                                                                className="border border-gray-300"
                                                                sx={{
                                                                    flex: 1,
                                                                    display: 'flex',
                                                                    marginX: 0,
                                                                    gap: 5,
                                                                    alignItems:'start',
                                                                    
                                                                }}
                                                            />

                                                            <CustomSelect                                               
	    name="year" 
            onChange={({value}) => handleCustomSelectChange(value, 'date', props?.token)}
            className="w-full max-w-xs rounded border mr-2 border-gray-400"
    options={[
        {
            label:'2018',
            value:'2018'
        },
        {
            label:'2019',
            value:'2019'
        },
        {
            label:'2020',
            value:'2020'
        }
    
    
    ]}
    placeholder='Filter by period'
    
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

    
/>

                                                            
                                                            <CustomSelect 
                                                            name="org_unit" 
                                                            onChange={({value}) => handleCustomSelectChange(value, 'beds_and_cots_by_all_hierachies', props?.token)}
                                                            className="w-full max-w-xs rounded border mr-2 border-gray-400"
                                                    options={[
                                                        {
                                                            label:'County',
                                                            value:'county'
                                                        },
                                                        {
                                                            label:'Sub County',
                                                            value:'sub_county'
                                                        },
                                                        {
                                                            label:'Ward',
                                                            value:'ward'
                                                        }
                                                    
                                                    
                                                    ]}
                                                    placeholder='Filter by Admin Heirachy'
                                                    
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

                                                    
                                                />
                                                            </div>
                                                        ),
                                                    }}
                                                />
                                            </div> */}

                                        </Tabs.Panel>

                                    </Tabs.Root>

                                </Tabs.Panel>
                            </Tabs.Root>
                        </div>



                    </div>
                </MainLayout>
            </div>
        );
    }
    else {
        return null
    }
}


Reports.getInitialProps = async (ctx) => {

    ctx?.res?.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )


    const reports = [
        'beds_and_cots_by_all_hierachies',
        'facility_keph_level_report_all_hierachies',
        'facility_owner_report_all_hierachies',
        'facility_type_report_all_hierachies',
        'facility_regulatory_body_report_all_hierachies',
        'facility_services_report_all_hierachies',
        'facility_infrastructure_report_all_hierachies',
        'chul_status_all_hierachies',
        'gis',
        'chul_services_all_hierachies',
        'chul_count_all_hierachies',
        'facility_human_resource_category_report_all_hierachies',
        'kephOptions',
        'ownerOptions',
        'typeOptions',
        'accreditation'
    ];

    const allReports = {
        'beds_and_cots_by_all_hierachies': [],
        'facility_keph_level_report_all_hierachies': [],
        'facility_owner_report_all_hierachies': [],
        'facility_type_report_all_hierachies': [],
        'facility_regulatory_body_report_all_hierachies': [],
        'facility_services_report_all_hierachies': [],
        'facility_infrastructure_report_all_hierachies': [],
        'chul_status_all_hierachies': [],
        'gis': [],
        'accreditation':[],
        'chul_services_all_hierachies': [],
        'chul_count_all_hierachies': [],
        'facility_human_resource_category_report_all_hierachies': [],
        kephOptions: [],
        ownerOptions:[],
        typeOptions:[]
    }


    const token = (await checkToken(ctx.req, ctx.res))?.token;
    let url = '';


    for (const report of reports)
        switch (report) {
            case 'beds_and_cots_by_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=beds_and_cots_by_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;

                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["beds_and_cots_by_all_hierachies"] = (await _data.json())?.results?.results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err.message);

                }

                break;
            case 'facility_keph_level_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_keph_level_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;

                try {

                    const _keph = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_keph_level_report_all_hierachies"] = (await _keph.json()).results?.results
                }

                catch (err) {
                    console.log(`Error fetching ${report}: `, err);
                }

                break;
            case 'facility_owner_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_owner_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_owner_report_all_hierachies"] = (await _data.json())?.results?.results
                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'facility_type_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_type_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_type_report_all_hierachies"] = (await _data.json()).results?.results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'facility_regulatory_body_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_regulatory_body_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_regulatory_body_report_all_hierachies"] = (await _data.json())?.results?.results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'facility_services_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_services_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_services_report_all_hierachies"] = (await _data.json())?.results?.results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;
            case 'facility_human_resource_category_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_human_resource_category_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_human_resource_category_report_all_hierachies"] = (await _data.json()).results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'facility_infrastructure_report_all_hierachies':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_infrastructure_report_all_hierachies${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        },
                    })

                    allReports["facility_infrastructure_report_all_hierachies"] = (await _data.json())?.results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'gis':
                url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=gis${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county&page_size=47'}`;


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        }
                    })

                    allReports["gis"] = (await _data.json()).results?.results

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

                case 'accreditation':
                    url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=facility_nhif_accreditation${ctx?.query?.groupby !== undefined ? `&report_groupby=${ctx?.query?.groupby}` : '&report_groupby=county&page_size=47'}`;
    
    
                    try {
    
                        const _data = await fetch(url, {
                            headers: {
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                            }
                        })
    
                        allReports["facility_nhif_accreditation"] = (await _data.json()).results?.results
    
                    }
                    catch (err) {
                        console.log(`Error fetching ${report}: `, err);
    
                    }
    
                    break;
                
            
            case 'kephOptions':
                url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/keph/`


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        }
                    })

                    allReports["kephOptions"] = (await _data.json()).results?.map(({ id: value, name: label }) => ({ value, label }))

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'typeOptions':
                url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_types_details/?is_parent=false`


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        }
                    })

                    allReports["typeOptions"] = (await _data.json()).results?.map(({ id: value, name: label }) => ({ value, label }))

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

            case 'ownerOptions':

                url = `${process.env.NEXT_PUBLIC_API_URL}/facilities/owner_types/`


                try {

                    const _data = await fetch(url, {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            Accept: 'application/json',
                        }
                    })

                    allReports["ownerOptions"] = (await _data.json()).results?.map(({ id: value, name: label }) => ({ value, label }))

                }
                catch (err) {
                    console.log(`Error fetching ${report}: `, err);

                }

                break;

               

            /*
case 'chul_status_all_hierachies':
    url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


    try {

        const _data = await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
            },
        })

        allReports["chul_status_all_hierachies"] = (await _data.json()).results 

    }
    catch (err) {
        console.log(`Error fetching ${report}: `, err);
        // allReports.push({
        //     error: true,
        //     err: err,
        //     chul_status_all_hierachies: [],
        // })
    }
    break;
case 'chul_services_all_hierachies':
    url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


    try {

        const _data = await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
            },
        })

            allReports["chul_services_all_hierachies"] = (await _data.json()).results.map((
                {
                    
                    "WASH: Water, sanitation and hygiene education, including hand washing": wash_sanitation,
                    "iCCM: Education on danger signs and referral for malaria, pneumonia and diarrhea": iccm,
                    "WASH: Water treatment provision": wash_water_treatment,
                    "health_unit__facility__ward__name": ward,
                    "health_unit__facility__ward__sub_county__county__name": county,
                    "health_unit__facility__ward__sub_county__name": sub_county,
                    "HIV, TB and Malaria: Treatment defaulter tracing": hiv_tb_malaria_treatment,
                    "HIV, TB and Malaria: Education, support for treatment adherence, and referral": hiv_tb_malaria_education,
                    "iCCM: Provision of AL drugs to treat malaria": iccm_malaria_drugs,
                    "HIV, TB and Malaria: Provision of condoms": hiv_tb_malaria_condoms,
                    "Referrals to health facilities": referrals_health_facilities,
                    "Provision of Information, Education & Communication (IEC) materials": provision_of_information,
                    "iCCM: Rapid diagnostic testing of malaria": iccm_rapid_diagnostic,
                    "Nutrition: Education, child growth monitoring, screening and referrals": nutrition_education,
                    "MNCH: Education, counseling of mothers, and referral for ANC": mnch_education,
                    "Deworming of children": deworming_children,
                    "HIV, TB and Malaria: Provision of psychosocial support groups": hiv_tb_malaria_ppsg,
                    "Management of diarrhea, injuries, wounds, jiggers and other minor illnesses.": mgmt_diarrhea,
                    "NCD: Education and support for treatment adherence": ncd_eduaction,
                    "HIV, TB and Malaria: Provision of home based care for PLWA": hiv_tb_malaria_provision,
                    "First Aid Services": first_aid_services,        
                    "iCCM: Provision of Long Lasting Insecticide Treated Nets": iCCM_provision_long_lasting,
                    "Growth monitoring for children under 5 years.": growth_monitoring,
                    "NCD: Diabetes and hypertension screening and referral": ncd_diabetes,
            
                    
                },
                index
            ) => ({
                wash_sanitation,
                iccm,
                wash_water_treatment,
                ward,
                county,
                hiv_tb_malaria_treatment,
                hiv_tb_malaria_education,
                iccm_malaria_drugs,
                hiv_tb_malaria_condoms,
                referrals_health_facilities,
                provision_of_information,
                iccm_rapid_diagnostic,
                nutrition_education,
                mnch_education,
                deworming_children,
                sub_county,
                hiv_tb_malaria_ppsg,
                mgmt_diarrhea,
                ncd_eduaction,
                hiv_tb_malaria_provision,
                first_aid_services,
                iCCM_provision_long_lasting,
                growth_monitoring,
                ncd_diabetes,
            
                id:index
                
            })
            ) 

    }
    catch (err) {
        console.log(`Error fetching ${report}: `, err);

        // allReports.push({
        //     error: true,
        //     err: err,
        //     chul_services_all_hierachies: [],
        // })
    }
    break;

 
 
 
case 'chul_status_all_hierachies':
    url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


    try {

        const _data = await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
            },
        })

        allReports["chul_status_all_hierachies"] = (await _data.json()).results 

    }
    catch (err) {
        console.log(`Error fetching ${report}: `, err);
        // allReports.push({
        //     error: true,
        //     err: err,
        //     chul_status_all_hierachies: [],
        // })
    }
    break;
case 'chul_count_all_hierachies':
    url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/chul/?report_type=${report}`;


    try {

        const _data = await fetch(url, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
            },
        })

        allReports["chul_count_all_hierachies"] = (await _data.json()).results 

    }
    catch (err) {
        console.log(`Error fetching ${report}: `, err);
        // allReports.push({
        //     error: true,
        //     err: err,
        //     chul_count_all_hierachies: [],
        // })
    }
    break;
    */


        }

    allReports["token"] = token

    return allReports
}




export default Reports