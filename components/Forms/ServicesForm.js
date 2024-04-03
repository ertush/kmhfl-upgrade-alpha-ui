import {useState, useEffect, useContext, useMemo} from 'react';
import EditListItem from './formComponents/EditListItem';
import { FormOptionsContext } from '../../pages/facilities/add';
// import { FormContext } from './Form';

import {
    handleServiceDelete,
    handleServiceSubmit,
    handleServiceUpdates
} from '../../controllers/facility/facilityHandlers'
// import { FacilityIdContext } from './EditForm'
import { FacilityUpdatesContext } from '../../pages/facilities/edit/[id]';
import {useRouter} from 'next/router'
import { UpdateFormIdContext } from './Form';


export function ServicesForm() {


    const setFormId = useContext(UpdateFormIdContext)

    const[facilityId, setFacilityId] = useMemo(() => {
        let id = ''

        function setId(_id) {
            id = _id
        }

        if(window) {
            setId(new URL(window.location.href).searchParams.get('facilityId'))
        }

        // console.log({id})

        return [id, setId]
    }, [])
 
    const [regulationFormURL, setRegulationFormURL] = useState('');

    const router = useRouter()

    const [submitting, setSubmitting] = useState(false)
    
    const options = useContext(FormOptionsContext);
    
    const { updatedSavedChanges, updateFacilityUpdateData } = options?.data ? useContext(FacilityUpdatesContext) : {updatedSavedChanges: null, updateFacilityUpdateData: null }
 
    //Options
    const serviceOptions = ((_services) => {

		// extract service categories and compose into an array of objects

		const categories = _services.map(({category_name, category}) => ({label:category_name, value:category}));

		const serviceCategoryValues = [ ...(new Set(categories.map(({value}) => value)).values()) ];

		const serviceCategories = serviceCategoryValues.map((id) => {
			return categories.filter(({value}) => value === id)[0]
		})

		return {
			categories: serviceCategories,
		}
	})(options?.services ?? [])

    //State
    const [services, setServices] = useState();

    const editMode = options?.data ? true : false

    //Event handlers
    function handleServicePrevious(e) {
      
        e.preventDefault()

        let formData = ""

        if(window) {
            formData = window.localStorage.getItem('regulation')
        }

        router.push({
            pathname: '/facilities/add',
            query: {
                formId: 3,
                formData,
                from:'previous'
            }
        })
        .then((navigated) => {
            if(navigated) setFormId(3)
        })
        

  } 

  useEffect(() => {
    
  }, [])

    return <>
                <h4 className="text-lg uppercase pb-2 mt-4 border-b border-gray-400  w-full mb-4 font-semibold text-gray-900">Services</h4>
                <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                
                    {/* Edit list Container */}
                    <div className='flex items-center w-full h-auto min-h-[300px]'>

                        <EditListItem
                            itemData={options?.data ? options?.data.facility_services : null}
                            categoryItems={serviceOptions.categories}
                            itemId={facilityId ?? options?.data?.id}
                            options={options?.services}
                            token={options?.token}
                            itemName={'facility_services'}
                            handleItemsSubmit={handleServiceSubmit}
                            handleItemsUpdate={handleServiceUpdates}
                            setSubmitting={setSubmitting}
                            submitting={submitting}
                            editMode={editMode}
                            handleItemPrevious={handleServicePrevious}
                            setFormId={setFormId}                          
                            /> 

                    </div>
                </div>
            </>
}