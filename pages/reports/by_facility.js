import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DownloadIcon } from '@heroicons/react/outline'
import React, { useState, useEffect } from 'react'
import { checkToken } from '../../controllers/auth/auth'
import { useRouter } from 'next/router'
import { SearchIcon, DotsHorizontalIcon } from "@heroicons/react/solid";
import { AgGridReact } from 'ag-grid-react';
import { LicenseManager } from '@ag-grid-enterprise/core';
import ReportsSideMenu  from './reportsSideMenu'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const ByWard = (props) => {
    // require('ag-grid-enterprise')
    LicenseManager.setLicenseKey("test");
    // const router = useRouter()
    

    const LinkCellRenderer = (params) =>{
        let query = null
        let pathname =''
        console.log(params);
        props.current_url.includes('chu') ? (query = { id: params.data.id }, pathname= '/community-units/[id]' ) : (query= {id: params.data.facility_id}, pathname= '/facilities/[id]/')
        return(
            <Link
            href={{ pathname:pathname, query: query }}
    
            ><a>{params.value}</a></Link>
        )}

    const [columns, setColumns]= useState([
        {headerName: "Facility Code", field: "facility_code"},
        {headerName: "Facility Name", field: "facility_name", cellRenderer: "LinkCellRenderer", cellStyle: {color: 'blue',maxWidth: 200, overflow: 'visible', }},
        {headerName: "No. of functional general beds", field: "number_of_beds"},
        {headerName: "No. of functional cots", field: "number_of_cots"},
    ])

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [facilities, setFacilities]=useState([])
    const [filtered, setFiltered]=useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const [title, setTitle] = useState(`Facilities with beds and cots ${window.document.location.href.split('&')[1].split('=')[1] ? 'in' : 'by'} ${window.document.location.href.split('&')[window.document.location.href.split('&').length - 1].split('=')[1].replaceAll('+', ' ')}`)
    const [label, setLabel]=useState('beds_cots')

     
    const onGridReady = (params) => {
        let lnlst= []
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        const updateData = (data) => params.api.setRowData(data);

        if(props.current_url.includes('chu')){       
            lnlst = props.data.results.map(({code,name,facility_name,county,date_established,status,number_of_chvs,id})=>({code,name,facility_name,county,date_established,status,number_of_chvs,id}))
        } else{
            lnlst =  props.data.results.map(({facility_code,facility_name,facility_id,number_of_beds,number_of_cots})=>({facility_code, facility_name, number_of_beds, number_of_cots,facility_id }))
        }
     
        setFacilities(lnlst)
        updateData(lnlst)
    };
    
    const filterField = (search, value) => value?.toString().toLowerCase().includes(search.toLowerCase());
    const filter =(searchTerm)=>{
        if (searchTerm !== '' && searchTerm.length > 3) {
            const filteredData = facilities.filter((row) => {
                return Object.keys(row).some((field) => {
                    return filterField(searchTerm, row[field]);
                });
            });
            setFiltered(filteredData);
        } else {
            setFiltered(facilities);
        }
            
    }
    useEffect(() => {
        filter(searchTerm)
        if(props.current_url.includes('chu')){
            setTitle('Community Health Units')
            setLabel('chus_count')
            setColumns([
                {headerName: "Code", field: "code"},
                {headerName: "Name", field: "name", cellRenderer: "LinkCellRenderer", cellStyle: {color: 'blue',maxWidth: 200, overflow: 'visible', }},
                {headerName: "Facility", field: "facility_name"},
                {headerName: "County", field: "county"},
                {headerName: "Date Established", field: "date_established"},
                {headerName: "Status", field: "status"},
                {headerName: "CHVs", field: "number_of_chvs"},
                ])
        }
    }, [searchTerm])
    return (
        <div className="">
            <Head>
                <title>KMHFR - Reports</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MainLayout isLoading={false} isFullWidth={false}>
                <div className="w-full grid grid-cols-7 gap-4 p-1 md:mx-4 my-2">
                    <div className="col-span-7 flex flex-col gap-x-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-1">
                            <div className="flex flex-row items-center justify-between gap-x-2 gap-y-0 text-sm md:text-base py-1">
                                <a className="text-blue-700" href="/">Home</a> {'/'}
                                <span className="text-gray-500">Static Reports</span> 
                            </div>
                            <div className={"col-span-5 flex items-center justify-between p-6 w-full bg-transparent drop-shadow  text-black md:divide-x md:divide-gray-200z border-l-8 " + (true ? "border-blue-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {title}
                                </h2>
                        </div>
                        </div>
                    </div>
                    <ReportsSideMenu />
                    <main className="col-span-6 md:col-span-5 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}
                        
                          <div className='mx-4'>
                            <form
                                className="inline-flex flex-row flex-grow items-left gap-x-2 py-2 lg:py-0"
                                //   action={path || "/facilities"}
                                >
                                <input
                                    name="q"
                                    id="search-input"
                                    className="flex-none bg-transparent  p-2 flex-grow shadow-sm border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                    type="search"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    // defaultValue={searchTerm}
                                    placeholder="Search anything ...."
                                />
                                <button
                                    type="submit"
                                    className="bg-transparent border border-black text-black flex items-center justify-center px-4 py-1 "
                                >
                                    <SearchIcon className="w-5 h-5" />
                                </button>
                                <div className='text-white text-md'>

                                <button className="flex items-center bg-blue-600 text-white  justify-start text-center font-medium active:bg-gray-200 p-2 w-full" onClick={(e) => {
                                                e.preventDefault()
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += `&format=excel&access_token=${props.token}` } else { dl_url += `?format=excel&access_token=${props.token}` }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                // window.open(dl_url, '_blank', 'noopener noreferrer')
                                                window.location.href = dl_url
                                            }}
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Export</span>
                                </button> 
                                </div>
                           
                                    
                            </form>
                            <h5 className="text-lg font-medium text-gray-800 float-right">
                                {props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 ml-2 text-base">{props?.data?.start_index || 0} - {props?.data?.end_index || 0} of {props?.data?.count || 0} </small>}
                            </h5>
                          </div>
                        <div className="flex flex-col justify-center items-center px-1 md:px-2 w-full">
                      
                            <div className="ag-theme-alpine" style={{ minHeight: '100vh', width: '100%' }}>
                                <AgGridReact
                                    rowStyle={{width: '100vw'}}
                                    sideBar={false}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                        resizable: true
                                    }}
                                    enableCellTextSelection={true}
                                    onGridReady={onGridReady}
                                    rowData={filtered}
                                    columnDefs={columns}
                                    suppressAutoSize={false}
                                    suppressMenuHide={true}
                                    frameworkComponents={{
                                        LinkCellRenderer
                                      }}
                                    />
                            </div>
                        </div>
                        {facilities && facilities.length > 0 && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                <li className="text-base text-gray-600">
                                    <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + props?.data?.current_page}>
                                        <a className="text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline">{props?.data?.current_page}</a>
                                    </Link>
                                </li>
                                {props?.path && props?.data?.near_pages && props?.data?.near_pages.map(page => (
                                    <li key={page} className="text-base text-gray-600">
                                        <Link href={props.path + (props.path.includes('?') ? '&page=' : '?page=') + page}>
                                            <a className="text-blue-800 p-2 hover:underline active:underline focus:underline">{page}</a>
                                        </Link>
                                    </li>
                                ))}
                                <li className="text-sm text-gray-400 flex">
                                    <DotsHorizontalIcon className="h-3" />
                                </li>

                            </ul>}

                    </main>




                    {/* Floating div at bottom right of page */}
                    {/* <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-blue-50/50 bg-blend-lighten shadow-lg -lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 1000 results.
                        </p>
                    </div> */}
                  
                </div>
            </MainLayout >
        </div>
    )
}   

ByWard.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 
   
// api/reporting/?report_type=beds_and_cots_by_county - number of beds and cots
// console.log(ctx.query)
    const fetchData = (token) => {
        let url = ''
        let status = ctx.query.status || ''
        let drill_down = JSON.parse(localStorage.getItem('drill_down')) || {}
        if(ctx.query.type == 'status'){
            url =API_URL + `/reporting/chul/?report_type=${ctx.query.type}&county=${drill_down.county}&sub_county=${drill_down.sub_county}&ward=${drill_down.ward}&status=${status}&chu_list=true`
        } else if(ctx.query.type=='chu_count'){
            url =API_URL + `/reporting/chul/?report_type=status&${ctx.query.level}=${ctx.query.id}&chu_list=true`
        } else{
            url = API_URL + `/reporting/?report_type=individual_facility_beds_and_cots&report_level=county&${ctx.query.level}=${ctx.query.id}`
        }
        let query = { 'searchTerm': ''}
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        }

        if(ctx?.query?.ward){
            query['ward'] = ctx?.query?.ward
        }

        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }
   
        let current_url = url + '&page_size=100000'
        if (ctx?.query?.page) {
          
            url = `${url}&page=${ctx.query.page}`
        }
        
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                    return {
                        data: json, query, token, path: ctx.asPath || '/users', current_url: current_url 
                    }
                
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/users',
                    current_url: ''
                }
            })
    }

    return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            return fetchData(token).then(t => t)
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/users'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/users',
                current_url: ''
            }
        }, 1000);
    })

}

export default ByWard