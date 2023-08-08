
import { useRef, useContext, useEffect } from "react" // useContext 
import { XCircleIcon } from '@heroicons/react/outline'
import { FacilityContactsContext } from "../../../components/Forms/FacilityContactsForm"
import { EditFacilityContactsContext } from "../../../pages/facilities/edit/[id]"
import { useAlert } from "react-alert"
import  Select  from './FromikSelect'
import { Field } from 'formik'


const FacilityContact = ({contactTypeOptions, setFacilityContacts, index, fieldNames, contacts}) => {



    const contactTypes = useContext(FacilityContactsContext)

    const editContacts = useContext(EditFacilityContactsContext)

    const alert = useAlert()

    const contactTypeRef = useRef(null)
    const contactDetailsRef = useRef(null)
    
    const [contact, contact_type_name, id] = contacts

    useEffect(() => {

        if(contactTypeRef.current && contact_type_name && id){
            
            if (contactTypeRef?.current){ 
                
                contactTypeRef.current.state.value = contactTypeOptions.filter(({label}) => label === contact_type_name).map(obj => {obj['id'] = id; return obj})
            }
           
            // console.log({val: contactTypeRef.current?.state?.value})
        }

        if(contactDetailsRef.current ){
            contactDetailsRef.current.value = contact ?? null;
        }

     

    }, [])

    return (
        <div className="w-full grid grid-cols-2 grid-rows-1 gap-3 mt-3" id={`facility-dept-wrapper-${index}`}> 
             {/* { console.log("Add", {index, facilityDepts}) } */}
            {/* Name */}
            <Select options={contactTypeOptions || []} 
                required
                // ref={contactTypeRef}
                id={`facility-contact-type-${index}`}
                placeholder="Select Name"

                // onChange={
                //     e => {
                //         if(contactTypeRef.current && contactTypeOptions){
                        
                //             contactTypeRef.current.value = contactTypeOptions.find(({label}) => label === e.label).contact //id
                //         }
                //     }
                // }
                name={`${fieldNames[0]}_${index}`} 
                // className='flex-none w-full flex-grow  placeholder-gray-500 border border-blue-600 outline-none'
 />
            
            <div className="w-full col-start-2 flex items-center gap-x-3 justify-between">
                    {/* Regulatory Body */}
                    <Field 
                    // ref={contactDetailsRef} 
                    id={`facility-contact-detail-${index}`} 
                    type="text" 
                    name={`${fieldNames[1]}_${index}`} 
                    className="w-full flex-grow  flex-1 bg-transparent p-2 border placeholder-gray-500 border-blue-600 focus:shadow-none  focus:border-black outline-none" 
                    />

                    
                
                    {/* Delete Btn */}
                    <button 
                    id={`delete-btn-${index}`}
                    onClick={async ev => {
                        ev.preventDefault();

                        // console.log({initialValues});
                 
                        if(!contacts.includes(undefined)){
                            const _contacts = contactTypes
                            _contacts.splice(index, 1);
                            delete _contacts[index]
                            setFacilityContacts(_contacts);

                            // console.log(editContacts, contacts)

                            try{
                                if(contactTypeRef?.current) {
                                const resp = await fetch(`/api/common/submit_form_data/?path=delete_contact&id=${contactTypeRef?.current?.state?.value[0].id ?? null}`)
                                if(resp.status == 204) alert.success('Deleted Facility Contact Successfully')

                               
                                
                                }
                            }catch(e){
                                console.error(e.message)
                            }
                        }else{
                            // console.log("[ >>>> Deleting]: Value")
                            contacts.splice(index, 1);
                            // delete contactTypes[index]
                            setFacilityContacts(contacts);
                        }

                    }}
                    ><XCircleIcon className='w-7 h-7 text-red-400'/></button>
                
                </div>
        </div>
    )
}

const OfficerContactDetails = ({contactTypeOptions, setFacilityContacts, contacts, index, fieldNames}) => {


    const contactTypes = useContext(FacilityContactsContext)

    // const contactTypeRef = useRef(null)
    // const contactDetailsRef = useRef(null)
    
    const [contact_type_name, contact, id] = contacts

    // useEffect(() => {

    //     console.log({contact_type_name});
    //     if(contactTypeRef.current && contact_type_name && id){

    //         if (contactTypeRef?.current){
    //         contactTypeRef.current.state.value = contactTypeOptions.filter(({label}) => label === contact_type_name).map(obj => {obj['id'] = id; return obj})
    //         }
    //     }

    //     if(contactDetailsRef.current ){
    //         contactDetailsRef.current.value = contact ?? ''
    //     }

     

    // }, [])

    return (
        <div className="w-full grid grid-cols-2 grid-rows-1 gap-3 mt-3" id={`facility-dept-wrapper-${index}`}> 
             {/* { console.log("Add", {index, facilityDepts}) } */}

            {/* Name */}
            <Select options={contactTypeOptions || []} 
                required
                // ref={contactTypeRef}
                id={`officer-contact-type-${index}`}
                placeholder="Select Name"
                // styles={{
                //     control: (baseStyles) => ({
                //         ...baseStyles,
                //         backgroundColor: 'transparent',
                //         outLine: 'none',
                //         border: 'none',
                //         outLine: 'none',
                //         textColor: 'transparent',
                //         padding: 0,
                //         height: '4px'
                //     })}}
                // onChange={
                //     e => {
                //         if(contactTypeRef.current){
                        
                //             contactTypeRef.current.value = contactTypeOptions.find(({label}) => label === e.label).contact //id
                //         }
                //     }
                // }
                name={`${fieldNames[0]}_${index}`} 
                
                // className='flex-none w-full flex-grow  placeholder-gray-500 border border-blue-600 outline-none'
                 />
            
            <div className="w-full col-start-2 flex items-center gap-x-3 justify-between">
                    {/* Regulatory Body */}
                    <Field 
                    // ref={contactDetailsRef} 
                    id={`officer-contact-detail-${index}`} 
                    type="text" 
                     
                    name={`${fieldNames[1]}_${index}`} 
                    className="w-full flex-grow  flex-1 bg-transparent p-2 border placeholder-gray-500 border-blue-600 focus:shadow-none  focus:border-black outline-none" />

                    
                    {/* Delete Btn */}
                    <button 
                    id={`delete-btn-${index}`}
                    onClick={ev => {
                        ev.preventDefault();
                        contactTypes.splice(index, 1);
                        delete contactTypes[index]
                        setFacilityContacts(contactTypes);
                      


                    }}
                    ><XCircleIcon className='w-7 h-7 text-red-400'/></button>
                
                </div>
        </div>
    )
}

export {
    FacilityContact,
    OfficerContactDetails
}