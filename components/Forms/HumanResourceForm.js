import {useContext, useCallback} from 'react';
import EditListWithCount from './formComponents/EditListWithCount';
import { FormOptionsContext } from '../../pages/facilities/add';
import { FormContext } from './Form';
import {
    handleHrSubmit
} from '../../controllers/facility/facilityHandlers';




export function HumanResourceForm() {

    // Constants
    const facilityId = '09990980'

    // Context
    const options = useContext(FormOptionsContext);
    const [formId, setFormId] = useContext(FormContext);


    // Options
    const hrOptions = ((_hr) => {

		// extract infrastructure categories and compose into an array of objects

		const categories = _hr.map(({category_name, category}) => ({label:category_name, value:category}));

		const hrCategoryValues = [ ...(new Set(categories.map(({value}) => value)).values()) ];

		const hrCategories = hrCategoryValues.map((id) => {
			return categories.filter(({value}) => value === id)[0]
		})

		return {
			categories: hrCategories,
		}

	})(options['17']?.hr ?? [])


    //Event handlers
    const handleHrPrevious = useCallback(() => {
    setFormId(`${parseInt(formId) - 1}`);
    }, []);

    return (
        <>
            <h4 className="text-lg uppercase pb-2 border-b border-gray-100 w-full mb-4 font-semibold text-blue-900">Human resource </h4>
            <div className='flex flex-col w-full items-start justify-start gap-3 mt-6'>

                {/* Edit List With Count Container*/}
                <div className='flex items-center w-full h-auto min-h-[300px]'>

                    {/* Edit List With Count*/}
                    <EditListWithCount
                        initialSelectedItems={[]}
                        itemsCategory={null}
                        categoryItems={hrOptions.categories}
                        itemsCategoryName={'human resource'}
                        options={options['17']?.hr}
                        itemId={facilityId}
                        item={null}
                        handleItemsSubmit={handleHrSubmit}
                        handleItemsUpdate={() => null}
                        removeItemHandler={() => null}
                        setIsSavedChanges={null}
                        setItemsUpdateData={null}
                        handleItemPrevious={handleHrPrevious}
                        nextItemCategory={'finish'}
                        previousItemCategory={'infrastructure'}
                        setIsSaveAndFinish={() => null}
                    />

                </div>

            </div>
        </>
    )
}