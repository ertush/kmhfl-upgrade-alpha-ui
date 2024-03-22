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


    // Constants

    const gisRowData = ((gisData) => 
        gisData.map(({
             facility_county: county,
             facility_sub_county: sub_county,
             facility_ward: ward,
             facility_name: name,
             facility_code: code,
             facility_lat:lat,
             facility_long:lng,
             
         }, index) => ({
             county,
             sub_county,
             ward,
             name,
             code,
             lat,
             lng,
             id:index
         }))
     )(props?.gis)

    const [reportTitle, setReportTitle] = useState('Beds and Cots');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {

    }, [reportTitle])

    useEffect(() => {
        setUser(userCtx)
		if(user.id === 6){
			router.push('/auth/login')
		}

        setIsClient(true);
        
	}, [])


    if(isClient){
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
                        <pre>
                            {
                                JSON.stringify(propsToGridData(props, 5)?.rows, null, 2)
                            }
                        </pre>
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
                                            onClick={() => null}
                                        >
                                            Facility Reports
                                        </Tabs.Tab>
                                        {/* CHUs Tab */}
                                        <Tabs.Tab
                                            id={2}
                                            value="chus"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => null}
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
                                    
                                    <Tabs.List className="list-none w-full flex justify-evenly flex-wrap gap-2 md:gap-3 px-4 uppercase leading-none tab-list font-semibold border-b border-gray-400">
                                        <Tabs.Tab
                                            id={1}
                                            value="beds_cots"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Beds and Cots')}
                                        >
                                            Beds and Cots
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={2}
                                            value="keph_level"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Keph Level')}
                                        >
                                            Keph Level
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={3}
                                            value="facility_ownership"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Facility Ownership')}
                                        >
                                            Facility Ownership
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={4}
                                            value="facility_type"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Facility Type')}
                                        >
                                            Facility Type
                                        </Tabs.Tab>

                                        <Tabs.Tab
                                            id={5}
                                            value="regulatory_body"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Regulatory Body')}
                                        >
                                            Regulatory Body
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={6}
                                            value="services"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Services')}
                                        >
                                            Services
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={7}
                                            value="infrastructure"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Infrastructure')}
                                        >
                                            Infrastructure
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={8}
                                            value="human_resources"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Human Resources')}

                                        >
                                            Human resources
                                        </Tabs.Tab>
                                        <Tabs.Tab
                                            id={9}
                                            value="geocodes"
                                            className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                            onClick={() => setReportTitle('Geo Location')}

                                        >
                                            Geo Codes
                                        </Tabs.Tab>
                                    
                                        {/* <Tabs.Tab
                                        id={4}
                                        value="regulatory_body"
                                        className="p-2 whitespace-nowrap focus:outline:none flex items-center justify-center text-gray-500 text-base hover:text-black cursor-default border-b-2 border-transparent tab-item"
                                        >
                                        Facility Incharge Details
                                        </Tabs.Tab> */}

                                    </Tabs.List>

                                    <Tabs.Panel
                                        value="beds_cots"
                                        className="grow-1 tab-panel"
                                    >
                                        {/* Beds and Cots Data Grid */}

                                        <div style={{ height: 700, width: '100%', backgroundColor: '#f9fafb' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 0).columns}
                                                rows={propsToGridData(props, 0)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div>


                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="keph_level"
                                        className="grow-1 tab-panel"
                                        
                                    >
                                        {/* Keph Level Data grid */}

                                        <div style={{ height: 700, width: '100%', backgroundColor: '#f9fafb' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 1).columns}
                                                rows={propsToGridData(props, 1)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div>

                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="facility_ownership"
                                        className="grow-1 tab-panel"

                                    >
                                        {/* Facility Ownership */}
                                        <div style={{ height: 700, width:'100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 2).columns}
                                                rows={propsToGridData(props, 2)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                sx={{overflowX:'scroll'}}
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div>

                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="facility_type"
                                        className="grow-1 tab-panel"

                                    >
                                        {/* Facility Type */}

                                         <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 3).columns}
                                                rows={propsToGridData(props, 3)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div> 

                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="regulatory_body"
                                        className="grow-1 tab-panel"
                                    >
                                        {/* Regulatory Body  */}                                  
                                        
                                         <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 4).columns}
                                                rows={propsToGridData(props, 4)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div> 
                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="services"
                                        className="grow-1 tab-panel"
                                    >
                                        {/* Services */}                                  
                                        
                                         <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 5).columns}
                                                rows={propsToGridData(props, 5)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div> 

                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="infrastructure"
                                        className="grow-1 tab-panel"
                                    >
                                        {/* Infrastructure */}                                  
                                        
                                        {/* <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 6).columns}
                                                rows={propsToGridData(props, 6)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div> */}


                                    </Tabs.Panel>
                                    <Tabs.Panel
                                    value="human_resources"
                                        className="grow-1 tab-panel"
                                    >

                                            {/* Human resource */}                                  
                                        
                                            {/* <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 11).columns}
                                                rows={propsToGridData(props, 11)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                             </div> */}

                                    </Tabs.Panel>
                                    <Tabs.Panel
                                        value="geocodes"
                                        className="grow-1 tab-panel"
                                    >
                                        {/* Geocodes */}
                                        {/* <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={[
                                                    {
                                                    headerName:'County',
                                                    field:'county',
                                                    flex:1
                                                    },
                                                    {
                                                        headerName:'Sub County',
                                                        field:'sub_county',
                                                        flex:1
                                                    },
                                                    {
                                                        headerName:'Ward',
                                                        field:'ward',
                                                        flex:1
                                                    },
                                                    {
                                                        headerName:'Facility Name',
                                                        field:'name',
                                                        flex:1
                                                    }, 
                                                    {
                                                        headerName:'Code',
                                                        field:'code',
                                                        flex:1
                                                    },  
                                                    {
                                                        headerName:'Latitude',
                                                        field:'lat',
                                                        flex:1
                                                    },
                                                    {
                                                        headerName:'Longitude',
                                                        field:'lng',
                                                        flex:1
                                                    }
                                                
                                            ]}
                                                rows={gisRowData}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
                                                    ),
                                                }}
                                            />
                                        </div> */}

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
                                        {/* { console.log({rows:propsToGridData(props, 9)?.rows, columns: propsToGridData(props, 9).columns})  } */}
                                        
                                        {/* <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 9).columns}
                                                rows={propsToGridData(props, 9)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
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
                                        {/* <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            { console.log({rows: propsToGridData(props, 7).rows }) }
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 7).columns}
                                                rows={propsToGridData(props, 7)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
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
                                        {/* <div style={{ height: 700, width: '100%', backgroundColor: '#eff6ff' }} className='shadow-md col-span-7'>
                                            <StyledDataGrid
                                                columns={propsToGridData(props, 10).columns}
                                                rows={propsToGridData(props, 10)?.rows}
                                                getRowClassName={() => `super-app-theme--Row`}
                                                rowSpacingType="border"
                                                showColumnRightBorder
                                                showCellRightBorder
                                                rowSelection={false}
                                                getCellClassName={() => 'super-app-theme--Cell'}
                                                slots={{
                                                    toolbar: () => (
                                                        <GridToolbar
                                                            sx={{
                                                                flex: 1,
                                                                display: 'flex',
                                                                marginX: 'auto',
                                                                gap: 5,
                                                                padding: '0.45rem'
                                                            }}
                                                        />
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
    else{
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
        'facility_human_resource_category_report_all_hierachies'
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
        'chul_services_all_hierachies': [],
        'chul_count_all_hierachies': [],
        'facility_human_resource_category_report_all_hierachies': []
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
                        console.log(`Error fetching ${report}: `, err);

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
                        console.log(allReports["facility_keph_level_report_all_hierachies"])
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
                        console.log(allReports["facility_owner_report_all_hierachies"])
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
                        /*
                case 'facility_human_resource_category_report_all_hierachies':
                            url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


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
                                // allReports.push({
                                //     error: true,
                                //     err: err,
                                //     facility_human_resource_category_report_all_hierachies: [],
                                // })
                            }

                            break;
                case 'facility_infrastructure_report_all_hierachies':
                            url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                            try {

                                const _data = await fetch(url, {
                                    headers: {
                                        Authorization: 'Bearer ' + token,
                                        Accept: 'application/json',
                                    },
                                })

                                allReports["facility_infrastructure_report_all_hierachies"] = (await _data.json()).results 

                            }
                            catch (err) {
                                console.log(`Error fetching ${report}: `, err);
                                // allReports.push({
                                //     error: true,
                                //     err: err,
                                //     facility_infrastructure_report_all_hierachies: [],
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

                case 'gis':
                    url = `${process.env.NEXT_PUBLIC_API_URL}/reporting/?report_type=${report}`;


                    try {

                        const _data = await fetch(url, {
                            headers: {
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                            },
                        })

                        allReports["gis"] = (await _data.json()).results 

                    }
                    catch (err) {
                        console.log(`Error fetching ${report}: `, err);
                        // allReports.push({
                        //     error: true,
                        //     err: err,
                        //     gis: [],
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

    return allReports
}
    



export default Reports