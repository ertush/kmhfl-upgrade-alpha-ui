import React, { useState, useRef, useEffect } from 'react';
import router from 'next/router';
import MainLayout from '../../components/MainLayout';
import { checkToken } from '../../controllers/auth/auth';
import {
    ChevronDoubleLeftIcon,
} from '@heroicons/react/solid';
import Select from 'react-select';
import Link from 'next/link'
import withAuth from '../../components/ProtectedRoute';


const FormData = require('form-data');

function AddAdminOffice(props) {

    
    // Form drop down options
    const countyOptions = props?.counties;
    const subCountyOptions = props?.sub_counties;
    const [status, setStatus] = useState(null)
    const [isClient, setIsClient] = useState(false)

    const [county, setCounty] = useState('');
    const [hide, setHide] = useState(false)

    // Drop down select options data
    const formRef = useRef(null)
    const countyRef = useRef(null)
    const subCountyRef = useRef(null)

    function onCheck(e) {
        const checked = e.target.checked;
        setHide(!hide)
    }


    const [subCountyOpt, setSubCountyOpt] = useState(null);
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        let _payload = {}
        const formData = new FormData(event.target)

        formData.forEach((v, k) => {
            _payload[k] = v
        })
        // _payload['county'] = countyRef.current.state?.value?.value
        // _payload['sub_county'] = subCountyRef.current.state?.value?.value



        let url = '/api/common/submit_form_data/?path=admin_offices'
        try {
            fetch(url, {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=utf-8'

                },
                method: 'POST',
                body: JSON.stringify(_payload)
            })
                .then(resp => resp)
                .then(res => {

                    if (res.status == 200) {
                        router.push('/admin_offices')
                    }
                })
                .catch(e => {
                    setStatus({ status: 'error', message: e })
                })
        } catch (e) {

            setStatus({ status: 'error', message: e })
            console.error(e)
        }

    }

    useEffect(() => {
        setIsClient(true)
       
    }, [])


    if(isClient){
    return (
        <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
            <div className="w-full  md:w-[85%] md:mx-auto px-4 md:px-0 grid grid-cols-5 gap-4  py-2 h-auto mt-8 my-4">
                <div className="col-span-5 flex flex-col gap-3 md:gap-5 px-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base py-3">
                        <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                            <Link href='/' className="text-gray-500">Home</Link>{'/'}
                            <Link href='/admin_offices' className="text-gray-500">Admin Offices</Link> {'/'}
                            <span className="text-gray-500">Add Admin Office</span>
                        </div>
                    </div>
                    <div className={"col-span-5 flex items-center justify-between  w-full bg-transparent border border-gray-600 drop-shadow text-gray text-black p-4 md:divide-x md:divide-gray-200z  border-l-8 " + (true ? "border-gray-600" : "border-red-600")}>
                        <h2 className='flex items-center text-xl font-bold text-black capitalize gap-2'>
                            {'New Admin Office'}
                        </h2>
                        
                    </div>

                </div>

                <div className='col-span-5 flex flex-col justify-center items-start px-1 md:px-4 w-full '>
                    <div className=' w-full flex flex-col bg-gray-50 mt-4 items-start p-3 text-gray shadow-md'
                        style={{ minHeight: '250px' }}>

                        <>

                            <form
                                className='flex flex-col w-full items-start justify-start gap-3'
                                onSubmit={handleSubmit}
                                ref={formRef}
                            >
                                {/* Office Name*/}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='name'
                                        className='text-gray-600 capitalize text-sm'>
                                        Office Name
                                        <span className='text-medium leading-12 font-semibold'>
                                            {' '}
                                            *
                                        </span>
                                    </label>
                                    <input
                                        required
                                        type='text'
                                        name='name'
                                        className='flex-none w-full bg-transparent text-gray p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* national */}
                                <div className='w-full flex flex-row items-center justify-start gap-1 mb-3'>

                                    <input
                                        type="checkbox"
                                        name='is_national'
                                        id='is_national'
                                        onClick={onCheck}
                                    />

                                    <label
                                        htmlFor='is_national'
                                        className='text-gray-600 capitalize text-sm'>

                                        Is National Office
                                    </label>

                                </div>

                                {!hide && (
                                    <>
                                        {/* County */}
                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                            <label
                                                htmlFor='county'
                                                id='county'
                                                className='text-gray-600 capitalize text-sm'>
                                                County
                                            </label>
                                            <Select
                                                													
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
                                                options={countyOptions || []}
                                                ref={countyRef}
                                                placeholder='Select County'
                                                onChange={async (ev) => {
                                                    if (ev.value.length > 0) {

                                                        setCounty(String(ev.label).toLocaleUpperCase())

                                                        try {
                                                            const resp = await fetch(`/api/filters/subcounty/?county=${ev.value}${"&fields=id,name,county&page_size=30"}`)

                                                            setSubCountyOpt((await resp.json()).results.map(({ id, name }) => ({ value: id, label: name })) ?? [])


                                                        }
                                                        catch (e) {
                                                            console.error('Unable to fetch sub_county options')
                                                            setSubCountyOpt(null)
                                                        }
                                                    } else {
                                                        return setSubCountyOpt(null)
                                                    }
                                                }}
                                                name='county'
                                                className='flex-none w-full flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                            />
                                        </div>

                                        {/* Sub County */}
                                        <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                            <label
                                                htmlFor='sub_county'
                                                className='text-gray-600 capitalize text-sm'>
                                                Sub-County
                                                <span className='text-medium leading-12 font-semibold'>
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <Select
                        									
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
                                                options={subCountyOpt ?? subCountyOptions}

                                                ref={subCountyRef}
                                                placeholder='Select Sub County'
                                                name='sub_county'
                                                id='sub_county'
                                                className='flex-none w-full flex-grow  placeholder-gray-500 border border-gray-600 outline-none'
                                            />
                                        </div>
                                    </>
                                )}


                                {/* Email */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='email'
                                        className='text-gray-600 capitalize text-sm'>
                                        Email
                                        <span className='text-medium leading-12 font-semibold'>
                                            {' '}
                                            *
                                        </span>
                                    </label>
                                    <input
                                        required
                                        type='email'
                                        name='email'
                                        className='flex-none w-full bg-transparent text-gray p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className='w-full flex flex-col items-start justify-start gap-1 mb-3'>
                                    <label
                                        htmlFor='phone_number'
                                        className='text-gray-600 capitalize text-sm'>
                                        Phone Number
                                        <span className='text-medium leading-12 font-semibold'>{' '}*</span>
                                    </label>
                                    <input
                                        required
                                        type='number'
                                        name='phone_number'
                                        className='flex-none w-full bg-transparent text-gray p-2 flex-grow border placeholder-gray-500 border-gray-600 focus:shadow-none focus:bg-white focus:border-black outline-none'
                                    />
                                </div>

                                {/* Cancel & Save */}
                                <div className='flex gap-3 items-center w-full'>
                                    <button type='submit' className='text-gray bg-blue-600 border-2 border-blue-600 p-2 text-white flex text-md font-semibold'
                                    >
                                        <span className='text-medium font-semibold text-white'>
                                            Save
                                        </span>
                                    </button>
                                    <button className='flex items-center justify-start p-2 border-2 border-black text-gray'>
                                        <span className='text-medium font-semibold text-black ' onClick={() => { router.push('admin_offices') }}>
                                            Cancel
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </>

                    </div>
                </div>
            </div>
        </MainLayout>

    )
    }
    else {
        return null
    }
}

export async function getServerSideProps(ctx){

    const allOptions = {}

    const options = [
        'counties',
        'sub_counties'
    ]



    const response = (() => checkToken(ctx.req, ctx.res)
        .then(async (t) => {
            if (t.error) {
                throw new Error('Error checking token');
            } else {

                let token = t.token;
                let url = '';


                for (let i = 0; i < options.length; i++) {
                    const option = options[i]
                    let fields = ''

                    if (option === 'counties') fields = 'id,name&page_size=47'
                    if (option === 'sub_counties') fields = 'id,name,county'
                    if (option === 'wards') fields = 'id,name,sub_county,constituency'
                    if (option === 'constituencies') fields = 'id,name,county'


                    url = `${process.env.NEXT_PUBLIC_API_URL}/common/${option}/?fields=${fields}`;


                    try {

                        const _data = await fetch(url, {
                            headers: {
                                Authorization: 'Bearer ' + token,
                                Accept: 'application/json',
                            },
                        })

                        allOptions[option] = (await _data.json()).results.map(({ id, name }) => ({ value: id, label: name }))


                    }
                    catch (err) {
                        console.log(`Error fetching ${option}: `, err);
                        allOptions[option] ={
                            error: true,
                            err: err,
                            data: []
                        };
                    }

                }



                return allOptions


            }
        })
        .catch((err) => {
            console.log('Error checking token: ', err);
            if (typeof window !== 'undefined' && window) {
                if (ctx?.asPath) {
                    window.location.href = ctx?.asPath;
                } else {
                    window.location.href = '/admin_offices';
                }
            }
            setTimeout(() => {
                return {
                    error: true,
                    err: err,
                    data: [],
                };
            }, 1000);
    }))()

    return {
        props: response
    }

}

export default withAuth(AddAdminOffice)