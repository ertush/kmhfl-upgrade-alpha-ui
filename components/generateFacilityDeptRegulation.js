import { useRef, useEffect, useContext } from "react"
import Select from '../components/Forms/formComponents/FromikSelect';
import { Field } from 'formik'
import { FacilityDeptRegulationContext } from "./Forms/RegulationForm";
import { XCircleIcon } from "@heroicons/react/outline";

const FacilityDeptRegulationFactory = ({facilityDeptOptions,  setFacilityDepts, fieldNames, formikState, index}) => {

 
    const facilityDepts = useContext(FacilityDeptRegulationContext);

   

    return (
        <> 
      
            {/* Name */}
            <Select options={facilityDeptOptions || []} 
                required
                id={`facility-dept-name-${index}`}
                placeholder="Select Name"
                name={`${fieldNames[0]}_${index}`} 
                />
            
            {/* Regulatory Body */}
            <Field id={`facility-dept-reg-body-${index}`} type="text" readOnly  name={`${fieldNames[1]}_${index}`}  className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* License No. */}
            <Field id={`facility-dept-license_no-${index}`} type="text" name={`${fieldNames[2]}_${index}`} className="flex-none w-full bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />

            {/* Reg No. */}
            <Field id={`facility-dept-reg_no-${index}`} type="text" name={`${fieldNames[3]}_${index}`} className="flex-none  bg-transparent p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none" />
        
            <button
            id={`delete-btn-${index}`}
            onClick={(ev) => {
                ev.preventDefault();
                facilityDepts.splice(index, 1);
                setFacilityDepts(facilityDepts);

            }}><XCircleIcon className='w-7 h-7 text-red-400' /></button>

        </>
    )
}

export default FacilityDeptRegulationFactory
