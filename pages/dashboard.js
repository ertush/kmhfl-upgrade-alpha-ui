import Head from 'next/head'
// import Link from 'next/link'
import MainLayout from '../components/MainLayout'
// import { DotsHorizontalIcon, DownloadIcon, PencilIcon } from '@heroicons/react/solid'
import { checkToken } from '../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import { Menu } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/outline'
import BarChart from '../components/BarChart'
import Select from 'react-select'

const Dash = (props) => {
    const router = useRouter()
    // console.log('props:::', props)
    // console.log('props:::', Object.keys(props))
    // console.log('props.data:::', Object.keys(props?.data))

    let filters = props?.filters
    let [drillDown, setDrillDown] = useState({})
    const [user, setUser] = useState(null)

    useEffect(() => {
        let mtd = true
        if (mtd) {
            if (filters && Object.keys(filters).length > 0) {
                Object.keys(filters).map(ft => {
                    if (props?.query[ft] && props?.query[ft] != null && props?.query[ft].length > 0) {
                        setDrillDown({ ...drillDown, [ft]: props?.query[ft] })
                    }
                })
            }
            if (typeof window !== 'undefined') {
                let usr = window.sessionStorage.getItem('user')
                if (usr && usr.length > 0) {
                    setUser(JSON.parse(usr))
                }
            }
        }
        return () => { mtd = false }
    }, [filters])
console.log(props?.data);
    return (
        <div className="">
            <Head>
                <title>KMHFL - Overview</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-6 gap-4 px-1 md:px-4 py-2 my-4">
                    <div className="col-span-6 flex flex-col gap-3 md:gap-5 px-2">
                        <div className="flex flex-row gap-2 text-sm md:text-base py-3">
                            <a className="text-green-700" href="/">Home</a> {'>'}
                            <span className="text-gray-500">Dashboard</span>
                        </div>
                        <div className="flex flex-col w-full md:flex-wrap lg:flex-row xl:flex-row gap-1 text-sm md:text-base py-1 items-center justify-between">
                            <h1 className="w-full md:w-auto text-4xl tracking-tight font-bold leading-3 flex items-start justify-center gap-x-1 gap-y-2 flex-grow mb-4 md:mb-2 flex-col">
                                <span>Overview</span>
                                {drillDown && drillDown?.county &&
                                    <small className="text-blue-900 text-base font-semibold ml-1">
                                        {filters && filters?.county && filters?.county.find(ft => ft.id == drillDown?.county)?.name != undefined ? filters.county.find(ft => ft.id == drillDown?.county)?.name + " County" : "National Summary" || ""}
                                    </small>
                                }
                            </h1>
                            <div className="flex-grow flex items-center justify-end w-full md:w-auto">
                                {/* --- */}
                                {user && user?.is_national && <div className="w-full flex flex-col items-end justify-end mb-3">
                                    {filters && Object.keys(filters).length > 0 &&
                                        Object.keys(filters).map(ft => (
                                            <div key={ft} className="w-full max-w-xs flex flex-col items-start justify-start mb-3">
                                                <label htmlFor={ft} className="text-gray-600 capitalize font-semibold text-sm ml-1">{ft.split('_').join(' ')}:</label>
                                                <Select name={ft} defaultValue={drillDown[ft] || "national"} id={ft} className="w-full max-w-xs p-1 rounded bg-gray-50"
                                                    options={
                                                        (() => {
                                                            if (user && user?.is_national) {
                                                                let opts = [{ value: "national", label: "National summary" }, ...Array.from(filters[ft] || [],
                                                                    fltopt => {
                                                                        if (fltopt.id != null && fltopt.id.length > 0) {
                                                                            return {
                                                                                value: fltopt.id, label: fltopt.name + ' county'
                                                                            }
                                                                        }
                                                                    })]
                                                                return opts
                                                            } else {
                                                                let opts = [...Array.from(filters[ft] || [],
                                                                    fltopt => {
                                                                        if (fltopt.id != null && fltopt.id.length > 0) {
                                                                            return {
                                                                                value: fltopt.id, label: fltopt.name + ' county'
                                                                            }
                                                                        }
                                                                    })]
                                                                return opts
                                                            }
                                                        })()
                                                    }
                                                    placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                    onChange={sl => {
                                                        let nf = {}
                                                        if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                            nf[ft] = sl.value
                                                        } else {
                                                            delete nf[ft]
                                                            // let rr = drillDown.filter(d => d.key !== ft)
                                                            // setDrilldown(rr)
                                                        }
                                                        setDrillDown({ ...drillDown, ...nf })
                                                        let value = sl.value
                                                        if (value === 'national') {
                                                            router.push('/dashboard')
                                                        } else {
                                                            router.push('/dashboard?county=' + value)
                                                        }
                                                    }} />
                                            </div>
                                        ))}
                                    {/* ~~~F L T R S~~~ */}
                                </div>}
                                {/* --- */}
                            </div>
                        </div>
                    </div>

                    {/* <div className="w-full col-span-6 flex flex-col items-start justify-start gap-1 bg-gray-50 shadow border border-gray-300/70">
                        <details className="py-1 px-2 text-gray-400 cursor-default rounded w-full">
                            <summary>props</summary>
                            <pre className="language-json leading-normal text-xs whitespace-pre-wrap text-gray-800 overflow-y-auto normal-case" style={{ maxHeight: '40vh' }}>
                                {JSON.stringify(props, null, 2)}
                            </pre>
                        </details>
                    <details className="py-1 px-2 text-gray-400 cursor-default rounded w-full">
                            <summary>drillDown</summary>
                            <pre className="language-json leading-normal text-xs whitespace-pre-wrap text-gray-800 overflow-y-auto normal-case" style={{ maxHeight: '40vh' }}>
                                {JSON.stringify(drillDown, null, 2)}
                            </pre>
                        </details>
                        <details className="py-1 px-2 text-gray-400 cursor-default rounded w-full">
                            <summary>filters</summary>
                            <pre className="language-json leading-normal text-xs whitespace-pre-wrap text-gray-800 overflow-y-auto normal-case" style={{ maxHeight: '40vh' }}>
                                {JSON.stringify(filters, null, 2)}
                            </pre>
                        </details>
                    </div> */}

                    {/* Facilities summary 1/3 - FILTERABLE */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility owners </h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                {props?.data?.owner_types.map((ot,i)=>(
                                    <tr key={i}>
                                     <><td className="table-cell text-left text-gray-900 p-2">{ot.name}</td>
                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ot.count || 0}</td></>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facility Types </h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                {props?.data?.types_summary.map((ts,i)=>(
                                    <tr key={i}>
                                     <><td className="table-cell text-left text-gray-900 p-2">{ts.name}</td>
                                        <td className="table-cell text-right font-semibold text-gray-900 p-2">{ts.count || 0}</td></>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Facilities summary 1/3 - FILTERABLE */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Facilities summary</h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total facilities</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.total_facilities || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total approved</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.approved_facilities || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total rejected</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.rejected_facilities_count || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total closed</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.closed_facilities_count || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total pending approval</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.pending_updates || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* CUs summary - FILTERABLE 1/3 */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Community Units summary</h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total community health units</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.total_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Total CHUs rejected</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.rejected_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">New CHUs pending approval</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_created_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Updated CHUs pending approval</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.chus_pending_approval || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Recent changes 1/3 - FILTERABLE */}
                    <div className="col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Recent changes</h4>
                        <table className="w-full text-sm md:text-base p-2">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th className="text-left text-gray-800 p-2 text-sm uppercase">Metric</th>
                                    <th className="text-right text-gray-800 p-2 text-sm uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-lg">
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">New facilities added</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_created || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">Facilities updated</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_updated || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">New CHUs added</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_created_chus || 0}</td>
                                </tr>
                                <tr>
                                    <td className="table-cell text-left text-gray-900 p-2">CHUs updated</td>
                                    <td className="table-cell text-right font-semibold text-gray-900 p-2">{props?.data?.recently_updated_chus || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Facilities & CHUs by county (bar) 1/1 */}
                    <div className="col-span-6 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facilities &amp; CHUs by county</h4>
                        <BarChart
                            title="Facilities & CHUs by county"
                            categories={Array.from(props?.data?.county_summary, cs => cs.name) || []}
                            tooltipsuffix="#"
                            xaxistitle="County"
                            yaxistitle="Number"
                            data={(() => {
                                let data = [];
                                data.push({
                                    name: 'Facilities',
                                    data: Array.from(props?.data?.county_summary, cs => parseFloat(cs.count)) || []
                                });
                                data.push({
                                    name: 'CHUs',
                                    data: Array.from(props?.data?.county_summary, cs => parseFloat(cs.chu_count)) || []
                                });
                                return data;
                            })() || []} />
                    </div>
                    {/* Facility owners & categories - national summary - FILTERABLE (bar) 1/2 */}
                    <div className="col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facility owners</h4>
                        <BarChart
                            title="Facility owners"
                            categories={Array.from(props?.data?.owner_types, ot => ot.name) || []}
                            tooltipsuffix="#"
                            xaxistitle="Owner"
                            yaxistitle="Number"
                            data={(() => {
                                return [{ name: "Owner", data: Array.from(props?.data?.owner_types, ot => parseFloat(ot.count)) || [] }];
                            })() || []} />
                    </div>
                    {/* Facility types - national summary - FILTERABLE (bar) 1/2 */}
                    <div className="col-span-6 md:col-span-3 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '250px' }}>
                        <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-2 font-semibold text-blue-900">Facility types</h4>
                        <BarChart
                            title="Facility types"
                            categories={Array.from(props?.data?.types_summary, ts => ts.name) || []}
                            tooltipsuffix="#"
                            xaxistitle="Type"
                            yaxistitle="Number"
                            data={(() => {
                                return [{ name: "Type", data: Array.from(props?.data?.types_summary, ts => parseFloat(ts.count)) || [] }];
                            })() || []} />
                    </div>


                    {/* (((((( Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, results are limited at the moment.
                        </p>
                    </div>
                    {/* ))))))) */}
                </div>
            </MainLayout>
        </div>
    )
}


Dash.getInitialProps = async (ctx) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const fetchFilters = token => {
        // let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Csub_county'
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county'
        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(jzon => {
                return jzon
            }).catch(err => {
                console.log('Error fetching filters: ', err)
                return {
                    error: true,
                    err: err,
                    filters: [],
                    api_url: API_URL
                }
            })
    }

    const fetchData = (token) => {
        let url = API_URL + '/facilities/dashboard/'
        let query = { 'searchTerm': '' }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${ctx.query.q}"}}}`
        }
        let other_posssible_filters = ["county"]

        other_posssible_filters.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                if (url.includes('?')) {
                    url += `&${flt}=${ctx?.query[flt]}`
                } else {
                    url += `?${flt}=${ctx?.query[flt]}`
                }
            }
        })
        console.log('running fetchData(' + url + ')')
        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            // .then(json => {
            //     return {
            //         data: json, query, path: ctx.asPath || '/dashboard', current_url: url, api_url: process.env.NEXT_PUBLIC_API_URL
            //     }
            // })
            .then(json => {
                return fetchFilters(token).then(ft => {
                    return {
                        data: json, query, filters: { ...ft }, path: ctx.asPath || '/dashboard', current_url: url, api_url: API_URL
                    }
                })
            })
            .catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    filters: {},
                    path: ctx.asPath || '/dashboard',
                    current_url: '',
                    api_url: API_URL
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
                window.location.href = '/dashboard'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/dashboard',
                current_url: '',
                api_url: API_URL
            }
        }, 1000);
    })

}

export default Dash




/*

https://api.kmhfltest.health.go.ke/api/facilities/dashboard/

https://api.kmhfltest.health.go.ke/api/facilities/dashboard/?fields=recently_created&last_month=true

https://api.kmhfltest.health.go.ke/api/facilities/dashboard/?fields=recently_created&last_week=true

https://api.kmhfltest.health.go.ke/api/facilities/dashboard/?fields=recently_created&last_three_months=true

*/