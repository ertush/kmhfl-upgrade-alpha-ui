import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../../../components/MainLayout';
import {DotsHorizontalIcon} from '@heroicons/react/solid';
import { checkToken } from '../../../controllers/auth/public_auth';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {SearchIcon } from "@heroicons/react/solid";
import Select from 'react-select'



const Home = (props) => {
	const router = useRouter();
	// const cus = props?.data?.results;
	const [cus, setcus] = useState([])
	const filters = props?.filters;
	const [drillDown, setDrillDown] = useState({});
	const qf = props?.query?.qf || 'all';
	const [viewAll, setViewAll] = useState(false);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const code=useRef(null)
	const allchus = useRef(null)
	const name = useRef(null)
	const county = useRef(null)
	const subcounty = useRef(null)
	const ward = useRef(null)
	const constituency = useRef(null)

	const status_options = props.filters?.chu_status || props.filters?.status || [];
	const counties = props?.filters?.county || [];
	const [units, setUnits]=useState([])
	const st =useRef(null)


	useEffect(() => {
		
		let qry = props?.query;
		delete qry.searchTerm;
		delete qry.qf
		setDrillDown({ ...drillDown, ...qry });
		if (filters && Object.keys(filters).length > 0) {
			filters['status'] = filters['chu_status'];
			delete filters['chu_status'];
		}

	}, [filters]);
	useEffect(() => {
		if(props?.current_url.includes('search')|| router.asPath.includes('search')){
			setViewAll(true)
			setcus(props?.data)

		}else{
			setViewAll(false)
		}
		
	}, [props?.current_url]);

	const administrative_units= [
		{label:'county', ref:county,array: counties},
		{label: 'subcounty', ref:subcounty, array: units['sub_counties']},
		{label: 'constituency', ref:constituency, array: units['sub_counties']},
		{label: 'wards', ref:ward, array: units['wards']}
	]
	const getUnits = async (path, id) => {
		try{
			let url = `/api/common/fetch_form_data/?path=${path}&id=${id}`

			const response = await fetch(url, {
				headers:{
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
				method:'GET'
			})

			let results = await response.json()
			let res = {}
			res[path]= results.results
			setUnits({...units,...res})
			
		}catch (err){
			
		}
	}

	const filterCHUs = async (e) => {
		if(e !== undefined){
			e.preventDefault()
		}
		let url = API_URL +`/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`
		const filter_options ={
			name: name.current.value,
			code: code.current.value,
			status: st?.current?.state?.value?.value || '',
			county: county?.current?.state?.value?.value|| '',
			sub_county: subcounty?.current?.state?.value?.value || '',
			constituency: constituency?.current?.state?.value?.value|| '',
			ward:ward?.current?.state?.value?.value|| ''
		}
		
		let qry = Object.keys(filter_options).map(function (key) {
			if(filter_options[key] !== ''){
				let er = (key) + '=' + (filter_options[key]);
				return er
			}
         }).filter(Boolean).join('&')
		
		if(qry !== ''){
			url += `&${qry}`
		}
		if(allchus.current.value !== ''){
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${allchus.current.value}"}}}`
		}
		
		try {
			const r = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + props?.token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			setcus(json)
			setViewAll(true)

		} catch (error) {
			console.log(error);
			setcus([])
			setViewAll(false)
		}
	}

	return (
		<div className=''>
			<Head>
				<title>KMHFL - Community Units</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
				<div className='w-full grid grid-cols-5 gap-4 px-1 md:px-4 py-2 my-4'>
					<div className='col-span-5 flex flex-col gap-3 md:gap-5 px-4'>
						<div className='flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3'>
							{/* Bread Crumbs */}

							<div className='flex flex-row gap-2 text-sm md:text-base py-3'>
								<Link className='text-green-700' href='/'>
									Home
								</Link>
								{'/'}
								<span className='text-gray-500'>Community Units</span>
							</div>
							<div className={"col-span-5 flex justify-between w-full bg-gray-50 drop-shadow rounded text-black p-4 md:divide-x md:divide-gray-200z items-center border-l-8 " + (true ? "border-green-600" : "border-red-600")}>
                                <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                                    {'Community Units'}
                                </h2>
								<p>Use the form on the left to filter CHUs or &nbsp;
								 <button className='text-lg text-blue-500 font-semibold' 
								 onClick={()=>{
									setViewAll(true)
									filterCHUs()
								}
								}
								>view all CHUs</button></p>
                               
                        </div>

						</div>
							
					</div>
				
                    <div className='col-span-1 w-full md:col-start-1 h-auto border-r-2 border-gray-300 h-full'>
                        <form onSubmit={(e)=>filterCHUs(e)}>
                            {/* <div className='card flex flex-wrap'> */}
                            <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>

                                        <label className=" text-gray-600">Search all CHUs</label>
                                        {/* &nbsp; */}
                                        <input
                                            name="allchus"
											ref={allchus}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="Search all CHUs"
                                        />                          
                            </div>
                            &nbsp;
                            <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
                                        <h2>CHU Info</h2>
                                        &nbsp; 
                                        <label className=" text-gray-600">CHU Name</label>
                                        <input
                                            name="name"
											ref={name}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="CHU Name"
                                        />    
                                         &nbsp; &nbsp; 
                                        <label className=" text-gray-600">CHU Code</label>
                                        <input
                                            name="code"
											ref={code}
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 flex-grow shadow-sm border placeholder-gray-500 w-full border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            placeholder="CHU Code"
                                        />  
                                         &nbsp; &nbsp; 
                                        <label className=" text-gray-600">Status</label>
											<Select name={'status'} ref={st} id={'status'} className="w-full max-w-xs p-1 rounded bg-gray-50"
										   options={
											   (() => {
													   let opts = [...Array.from(status_options || [],
														   fltopt => {
															   if (fltopt.id != null && fltopt.id.length > 0) {
																   return {
																	   value: fltopt.id, label: fltopt.name 
																   }
															   }
														   })]
													   return opts
											   })()
										   }
										   placeholder={`Select status`}
										   />
                            </div>
							&nbsp;
                            <div className="card col-span-6 md:col-span-2 flex flex-col items-start justify-start p-3 rounded shadow-lg border border-gray-300/70 bg-gray-50" style={{ minHeight: '50px' }}>
								<h2>Administrative Units</h2> &nbsp;
								<div  className="w-full max-w-xs flex flex-col items-start justify-start mb-3" id='first'>
									{administrative_units.map(ct=>(
										<>
										<label htmlFor={ct.label} className="text-gray-600 capitalize text-sm ml-1">{ct.label}:</label>
									   <Select name={ct.label}  ref={ct.ref} defaultValue={drillDown[ct.label] || "national"} id={ct.label} className="w-full max-w-xs p-1 rounded bg-gray-50"
										   options={
											   (() => {
													   let opts = [...Array.from(ct.array || [],
														   fltopt => {
															   if (fltopt.id != null && fltopt.id.length > 0) {
																   return {
																	   value: fltopt.id, label: fltopt.name 
																   }
															   }
														   })]
													   return opts
											   })()
										   }
										   placeholder={`Select ${ct.label}`}
										   onChange={sl => {
											   let nf = {}
											   if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
												   nf[ct.label] = sl.value
											   } else {
												   delete nf[ct.label]
											   }
											   ct.label == 'county' && sl?.value !== undefined && getUnits('sub_counties', sl?.value)
											   ct.label == 'subcounty' && sl?.value !== undefined && getUnits('wards', sl?.value)
										   }} 
										   />
   
										   &nbsp;
										</>
									))}
								</div>
								
							</div>
							&nbsp;
							<div className='flex flex-row gap-4'> 

							<button
								type="submit"
								className="bg-green-500 border-1 border-black text-black flex items-center justify-center px-4 py-1 rounded"
							>
								<SearchIcon className="w-5 h-5" /> Search
							</button>  
							<button
								type="button"
								className="bg-gray-100 border-1 border-black text-black flex items-center justify-center px-4 py-1 rounded"
								onClick={()=>{
									setDrillDown({})
									name.current.value ='',code.current.value='', st.current.select.clearValue(), allchus.current.value = '',
									county.current.select.clearValue(),subcounty.current.select.clearValue(),ward.current.select.clearValue(),constituency.current.select.clearValue()
								}}
							>Reset
							</button>  
							</div>
                        </form>
                    </div>

                     {/* Main body */}
					<div className="col-span-6 md:col-span-4 flex flex-col gap-4 order-last md:order-none"> {/* CHANGED colspan */}

					    <div className='mx-4 float-right'>
							 
						   {viewAll && <h5 className="text-lg font-medium text-gray-800 float-right">
                                {cus?.count && cus?.count > 0 && <small className="text-gray-500 ml-2 text-base">{cus?.start_index || 0} - {cus?.end_index || 0} of {cus?.count || 0} </small>}
                            </h5>}
						</div>
						<div className='flex flex-col justify-center items-center px-1 md:px-4 w-full '>
							{/* <pre>{JSON.stringify(cus[0], null, 2)}</pre> */}
							{viewAll && cus?.results && cus?.results.length > 0 ? (
								cus?.results.map((comm_unit, index) => (
									<div
										key={comm_unit.id}
										className='px-1 md:px-3 grid grid-cols-8 gap-3 border-b py-4 hover:bg-gray-50 w-full'>
										<div className='col-span-8 md:col-span-4 flex flex-col gap-1 group items-center justify-start text-left'>
											<h3 className='text-2xl w-full'>
												<a
													href={'/public/chu/' + comm_unit.id}
													// href={'#'}
													className='hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800'>
													<small className='text-gray-500'>
														{index + props?.data?.start_index}.
													</small>{' '}
													{comm_unit.official_name ||
														comm_unit.official_name ||
														comm_unit.name}
												</a>
											</h3>
											{/* <p className="text-sm text-gray-600 w-full">{comm_unit.nearest_landmark || ' '}{' '} {comm_unit.location_desc || ' '}</p> */}
											<p className='text-sm text-gray-600 w-full flex gap-2 items-center'>
												<span className='text-lg text-black font-semibold'>
													# {comm_unit.code ? comm_unit.code : 'NO_CODE' || ' '}
												</span>
												<span>{comm_unit.facility_name || ' '}</span>
											</p>
											<div className='text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full'>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														County:
													</label>
													<span>
														{comm_unit.facility_county ||
															comm_unit.county ||
															'N/A'}
													</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														Sub-county:
													</label>
													<span>
														{comm_unit.facility_subcounty ||
															comm_unit.sub_county ||
															'N/A'}
													</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>Ward:</label>
													<span>{comm_unit.facility_ward || 'N/A'}</span>
												</div>
												<div className='flex flex-col items-start justify-start gap-0 leading-none'>
													<label className='text-xs text-gray-500'>
														Constituency:
													</label>
													<span>
														{comm_unit.constituency_name ||
															comm_unit.facility_constituency ||
															'N/A'}
													</span>
												</div>
											</div>
										</div>
										<div className='col-span-8 md:col-span-3 flex flex-wrap items-center gap-3 text-lg'>
											{comm_unit.status_name ? (
												<span
													className={
														'leading-none border whitespace-nowrap shadow-xs text-sm rounded py-1 px-2 text-black ' +
														(comm_unit.status_name
															.toLocaleLowerCase()
															.includes('non-')
															? ' bg-red-200 border-red-300/60'
															: comm_unit.status_name
																	.toLocaleLowerCase()
																	.includes('fully')
															? ' bg-green-200 border-green-300/60'
															: ' bg-yellow-200 border-yellow-300/60')
													}>
													{comm_unit.status_name[0].toLocaleUpperCase()}
													{comm_unit.status_name.slice(1).toLocaleLowerCase()}
												</span>
											) : (
												''
											)}
											{/* {!comm_unit.rejected ? <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (comm_unit.approved ? "bg-green-200 text-black" : "bg-gray-400 text-black")}>{comm_unit.approved ? "Approved" : "Not approved"}</span> : <span className={"leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + "bg-gray-400 text-black"}>{comm_unit.rejected ? "Rejected" : ""}</span>} */}
											{comm_unit.has_edits ? (
												<span
													className={
														'leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-black'
													}>
													Has edits
												</span>
											) : (
												''
											)}
										</div>
										<div className='col-span-8 md:col-span-1 flex flex-wrap items-center gap-4 text-lg pt-3 md:pt-0 justify-around md:justify-end'>
										
										</div>
									</div>
								))
							) : (
								<div className='w-full flex items-center justify-start gap-2 bg-yellow-100 border font-medium rounded border-yellow-300 p-3'>
									<span className='text-base text-gray-700'>
										No community units found
									</span>
									<Link href={props.path || '/'}>
										<a className='text-blue-700 hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800'>
											Refresh.
										</a>
									</Link>
								</div>
							)}
							{viewAll && cus?.results && cus?.results.length >= 30 && (
								<ul className='list-none flex p-2 flex-row gap-2 w-full items-center my-2'>
									<li className='text-base text-gray-600'>
		
										<a
											href={
												(() => 
												props.path.includes('?page') ?
												props.path.replace(/\?page=\d+/,`?page=${cus?.current_page}`)
												:
												props.path.includes('?q') && props.path.includes('&page') ?
												props.path.replace(/&page=\d+/, `&page=${cus?.current_page}`)
												:
												props.path.includes('?q') ?
												`${props.path}&page=${cus?.current_page}`                                    
												:
												`${props.path}?page=${cus?.current_page}`
											)()
											}
											className='text-gray-400 font-semibold p-2 hover:underline active:underline focus:underline'>
											{cus?.current_page}
										</a>
									</li>
									{cus?.near_pages &&
										cus?.near_pages.map((page) => (
											<li key={page} className='text-base text-gray-600'>

												<a
													href={
														(() => 
                                                            props.path.includes('?page') ?
                                                            props.path.replace(/\?page=\d+/,`?page=${page}`)
                                                            :
                                                            props.path.includes('?q') && props.path.includes('&page') ?
                                                            props.path.replace(/&page=\d+/, `&page=${page}`)
                                                            :
                                                            props.path.includes('?q') ?
                                                            `${props.path}&page=${page}`
                                                            :
                                                            `${props.path}?page=${page}`
                   
                                                        )()
													}
													className='text-blue-800 p-2 hover:underline active:underline focus:underline'>
													{page}
												</a>
											</li>
										))}
									<li className='text-sm text-gray-400 flex'>
										<DotsHorizontalIcon className='h-3' />
									</li>
									
								</ul>
							)}
						</div>
					</div>
				</div>
			</MainLayout>
		</div>
	);
};

Home.getInitialProps = async (ctx) => {
	
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const fetchFilters = async (token) => {
		let filters_url =
			API_URL +
			'/common/filtering_summaries/?fields=county,chu_status';

		try {
			const r = await fetch(filters_url, {
				headers: {
					Authorization: 'Bearer ' + token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			return json;
		} catch (err) {
			console.log('Error fetching filters: ', err);
			return {
				error: true,
				err: err,
				filters: [],
				path: ctx.asPath || '/',
			};
		}
	};

	const fetchData = async (token) => {
		let filterQuery = JSON.parse(JSON.stringify(ctx.query));
		let qry = ''
		let url =API_URL + `/chul/units/?fields=id,code,name,status_name,date_established,facility,facility_name,facility_county,facility_subcounty,facility_ward,facility_constituency`;	
		let query = { searchTerm: '' };
		if (ctx?.query?.q) {
			query.searchTerm = ctx.query.q;
			url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`;
		}
		let other_posssible_filters = [
			'county',
			'constituency',
			'ward',
			'status',
			'sub_county',
		];
		other_posssible_filters.map((flt) => {
			if (ctx?.query[flt]) {
				query[flt] = ctx?.query[flt];
				url = url + '&' + flt.replace('chu_', '') + '=' + ctx?.query[flt];
			}
		});
		// let current_url = url + '&page_size=25000' //change the limit on prod
		let current_url = url + '&page_size=100';
		if (ctx?.query?.page) {
			url = `${url}&page=${ctx.query.page}`;
		}
		// console.log('running fetchData(' + url + ')');
		try {
			const r = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + token,
					Accept: 'application/json',
				},
			});
			const json = await r.json();
			const ft = await fetchFilters(token);
			return {
				data: json,
				query,
				token,
				filters: { ...ft },
				path: ctx.asPath || '/chu/community_units',
				current_url: current_url,
			};
		} catch (err) {
			console.log('Error fetching community units: ', err);
			return {
				error: true,
				err: err,
				data: [],
				query: {},
				path: ctx.asPath || '/chu/community_units',
				current_url: '',
			};
		}
	};
	return checkToken(ctx.req, ctx.res)
		.then((t) => {
			if (t.error) {
				throw new Error('Error checking token');
			} else {
				let token = t.token;
				return fetchData(token).then((t) => t);
			}
		})
		.catch((err) => {
			console.log('Error checking token: ', err);
			if (typeof window !== 'undefined' && window) {
				if (ctx?.asPath) {
					window.location.href = ctx?.asPath;
				} else {
					window.location.href = '/chu/community_units';
				}
			}
			setTimeout(() => {
				return {
					error: true,
					err: err,
					data: [],
					query: {},
					path: ctx.asPath || '/chu/community_units',
					current_url: '',
				};
			}, 1000);
		});
};

export default Home;
