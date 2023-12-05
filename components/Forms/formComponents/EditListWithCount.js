import { useState, useEffect, useRef } from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Select from 'react-select'
import { defer } from 'underscore';
import { Formik, Form, Field } from 'formik'
import {
    ChevronDoubleRightIcon,
    ChevronDoubleLeftIcon,
    PlusIcon
} from '@heroicons/react/solid';
import { useAlert } from 'react-alert'
import { useLocalStorageState } from '../hooks/formHook';
import { number } from 'zod';


function EditListWithCount(
    {
        initialSelectedItems,
        // itemsCategory,
        nextItemCategoryId,
        otherItemsCategory,
        itemsCategoryName,
        itemId,
        item,
        handleItemsSubmit,
        handleItemsUpdate,
        removeItemHandler,
        setIsSavedChanges,
        setItemsUpdateData,
        handleItemPrevious,
        setNextItemCategory,
        nextItemCategory,
        previousItemCategory,
        // setIsSaveAndFinish,
        categoryItems,
        options,
        token,
        itemData
    }
) {

    const alert = useAlert()

    // const {reset} = useLocalStorageState({key: "reset", value: null}).actions;

    const [isFormSubmit, setIsFormSubmit] = useState(false)
    const [currentItem, setCurrentItem] = useState(null)
    const [deletedItems, setDeletedItems] = useState([])
    const [itemOptions, setItemOptions] = useState([])
    const [specialities, setSpecialities] = useState([])
    const [query, setQuery] = useState('') 
    const [selectedRows, setSelectedRows] = useState([]);

    const [categoryOptions, setCategoryItems] = useState( (test)=> {

         
        let newarray=[];
        categoryItems.forEach(element => {
            let customitem={value:element.value, label:element.label, catcount:0}
            newarray.push(customitem);
        });
        return newarray;
  });
    // });
    function CountCategoryTotalSpecialities(specialityid,newvalue){
        let total=0;
        let _categoryid="";
        selectedRows.forEach(element => {
            if(element.rowid==specialityid){
                _categoryid=element.categoryid;
               
            }
        }); 
        categoryOptions.forEach(item => {
            if(item.value==_categoryid){
                selectedRows.filter(k=>k.categoryid==_categoryid).forEach(element => {
                    if(element.rowid==specialityid){
                        element.count=newvalue;
                    }
                    total=total+ parseInt( element.count);
                });
             }
        });
        // console.log(total,_categoryid)
        if(categoryOptions.some(item=>item.value==_categoryid)){
            setCategoryItems(prevArray => 
                prevArray.map(item => 
                  item.value === _categoryid ? { ...item, catcount: total } : item
                )
              );
        }
    }
    // console.log(categoryOptions)

    const [selectedItems, setSelectedItems] = useState((initialSelectedItems ? (() => {
        const result = []

        if (initialSelectedItems.length > 0) {
            initialSelectedItems.map(({ subCategories, id, meta_id, count }) => {
                        
                result.push({ name: subCategories[0], id, meta_id, count })

            })
        }
``
        return result

    })() : []))

    const editItem = itemsCategoryName.includes('human resource') ? itemData?.map(({name, id, count}) => ({id, name, count})) : itemData?.map(({infrastructure_name:name,  infrastructure:id, count}) => ({id, name, count}));

    const [savedItems, saveSelectedItems] = useLocalStorageState({
        key: itemData ? `${itemsCategoryName}_edit_form` :  `${itemsCategoryName}_form`,
        value: itemData ? editItem : []
      }).actions.use();

    const items = typeof savedItems === 'string' && savedItems.length > 0 ? JSON.parse(savedItems) : savedItems;

    // Refs

    const itemRef = useRef(null);
    


    //Effects 
    useEffect(() => {
        //store service when service is added
        if(selectedItems.length !== 0){
            // console.log(selectedItems)

            const x = selectedItems;

            if(editItem && editItem.length > 1){
                if(editItem[0]?.id === items[0]?.id) x.push(editItem[0]);
            }

            //Check if infrastructure has count

            x.forEach(obj => {
                if(
                    obj?.name?.includes("Main Grid") ||
                    obj?.name?.includes("Gas") ||
                    obj?.name?.includes("Bio-Gas") ||
                    // WATER SOURCE
                    obj?.name?.includes("Roof Harvested Water") ||
                    obj?.name?.includes("River / Dam / Lake") ||
                    obj?.name?.includes("Donkey Cart / Vendor") ||
                    obj?.name?.includes("Piped Water") ||
                    // MEDICAL WASTE MANAGEMENT
                    obj?.name?.includes("Sewer systems") ||
                    obj?.name?.includes("Dump without burning") ||
                    obj?.name?.includes("Open burning") ||
                    obj?.name?.includes("Remove offsite") ||
                    // ACCESS ROADS
                    obj?.name?.includes("Tarmac") ||
                    obj?.name?.includes("Earthen Road") ||
                    obj?.name?.includes("Graded ( Murrum )") ||
                    obj?.name?.includes("Gravel")
                ){
                    delete obj['count']
                }
            })


          saveSelectedItems(
            JSON.stringify(x)
          );
        }
      }, [selectedItems]);


    const initialValues = (() => {
        const _initValues = {}
        initialSelectedItems.forEach(({ id, count }) => {
            _initValues[id] = count
        })


        return _initValues
    })()

    function validateCount(value) {

        let error;
        if (value == null || value == undefined || value == '') {
            error = 'This field is required'
        } else {

            if (value) {
                if (value.toString().match(/^-\d+$/) !== null) {
                    error = 'This field must be at least 1'
                }
            }
        }

        return error;

    }


    const formatGroupLabel = (data) => (
        <div style={
            {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }
        }>
            <span>{data.label}</span>
            <span style={
                {
                    backgroundColor: '#EBECF0',
                    borderRadius: '2em',
                    color: '#172B4D',
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 'normal',
                    lineHeight: '1',
                    minWidth: 1,
                    padding: '0.167em 0.5em',
                    textAlign: 'center',
                }
            }>{data.options.length}</span>
        </div>
    );

    useEffect(() => {

        // reset itemOptions
        if (isFormSubmit && otherItemsCategory) setItemOptions(((options) => {
            return options?.map(({ name, subCategories, value }) => ({
                label: name,
                options: subCategories.map((_label, i) => ({ label: _label, value: value[i] }))
            }))
        })(otherItemsCategory))

        return () => {
            setIsFormSubmit(false)

        }

    }, [isFormSubmit])

    const filterSpecialities = (ctg) => {
        const filteredOptions = options.filter((option) => option.category=== ctg );
        setSpecialities(filteredOptions)

    }

    const handleCheckboxChange = (id, name,category) => {
        setSelectedRows((prevSelectedRows) => {
          if (prevSelectedRows.filter((row) => row.rowid == id).length>0) {
            return prevSelectedRows.filter((row) => row.rowid !== id);
          } else {
              let customitem={rowid:id, sname:name, count:0,categoryid:category}
            return [...prevSelectedRows, customitem];
          }
        });
      }; 
    //   console.log(specialities)
      
    const handleInputChange = (rowvalue, targetvalue) => {
          // Update the selected rows values
          if(selectedRows.some(item=>item.rowid==rowvalue)){
              setSelectedRows(prevArray => 
                  prevArray.map(item => 
                    item.rowid === rowvalue ? { ...item, count: targetvalue } : item
                  )
                );
                
          }
          CountCategoryTotalSpecialities(rowvalue,targetvalue)
      };  
  
    //   console.log(specialities)
  

    const onSearch = ((event, issearchcategory,issearchspeciality)=>{

        const _query=event.target.value;
        setQuery(_query);
        if(_query.length > 3){
            if(issearchcategory){
                let subset = categoryItems.filter((e)=>e.label.toLowerCase().includes(_query.toLowerCase()))
                setCategoryItems(subset);
            }else if(issearchspeciality ){
                let _specialities = specialities.filter((e)=>e.name.toLowerCase().includes(_query.toLowerCase()))
                setSpecialities(_specialities);
            }
        }
        else{
            if(issearchspeciality){
                filterSpecialities(specialities[0].category)
            }
            setCategoryItems(categoryItems);
        }
    });
    // console.log({ options, categoryItems })

    return (

        <Formik
            initialValues={initialValues}
            initialErrors={false}
            onSubmit={(values) => { 

                // setIsSaveAndFinish(true)
                // console.log({values})

                if (item) {

                    // Update the list of values
                    deletedItems.forEach(([{ id }]) => {
                        delete values[id]
                    })

                    // Filter Edited fields only
                    const valueKeys = []
                    // const disjointValues = {}

                    Object.values(values).filter((v, i) => {
                        if (v !== Object.values(initialValues)[i]) valueKeys.push(Object.keys(values)[i]);
                        return v !== Object.values(initialValues)[i]
                    })[0];

                    // for (let key in valueKeys) disjointValues[valueKeys[key]] = values[valueKeys[key]];

                    handleItemsUpdate(token, [values, savedItems, itemId], alert)
                        .then(resp => {
                            defer(() => setIsSavedChanges(true))
                            let update_id;

                            if (resp.ok) {
                                fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${itemId}/`,
                                    {
                                        headers: {
                                            'Authorization': 'Bearer ' + token,
                                            'Accept': 'application/json, text/plain, */*',
                                            'Content-Type': 'application/json;charset=utf-8'
                                           } 
                                    
                                    }
                                    
                                    ).then(async resp => {

                                    const results = await resp.json()
                                    
                                    update_id = results?.latest_update

                                    if (update_id) {
                                        try {
                                            const itemsUpdateData = await (await fetch(
                                                `${process.env.NEXT_PUBLIC_API_URL}/facilities/facility_updates/${update_id}`,
                                                {
                                                    headers: {
                                                        'Authorization': 'Bearer ' + token,
                                                        'Accept': 'application/json, text/plain, */*',
                                                        'Content-Type': 'application/json;charset=utf-8'
                                                       }
                                                }
                                                )).json()
                                            setItemsUpdateData(itemsUpdateData)
                                        }
                                        catch (e) {
                                            console.error('Encountered error while fetching item update data', e.message)
                                        }
                                    }
                                })
                                    .catch(e => console.error('unable to fetch item update data. Error:', e.message))
                            }

                        })
                        .catch(e => console.error('unable to fetch item data. Error:', e.message))
                }

                else {
                    nextItemCategory === 'finish' ? /* Human Resource */ (() => {

                        handleItemsSubmit(token, [savedItems, values], itemId, alert)
                        .then(resp => {
                            if(resp.ok){
                                alert.success('Facility humanresource saved successfully')
                            }else {
                                alert.error('Unable to save facility humanresource')
                            }
                            //
                            if(window){
                                window.localStorage.clear()
                            }

                        })
                        
                    })() :  /* Infrastructure */ handleItemsSubmit(token, [savedItems, values, nextItemCategoryId, setNextItemCategory], itemId)
                        .then(resp => {
                            if(resp.ok){
                                alert.success('Facility Infrastructure saved successfully')
                            }else {
                                alert.error('Unable to save facility infrastructure')
                            }
                           
                        })
                        .catch(e => console.error('unable to submit item data. Error:', e.message))
                }

            }}
        >
            {({ errors }) => (

                <Form
                    name="list_item_with_count_form"
                    className="flex flex-col w-full items-start justify-start gap-3 "
               
                >

                    {/* Item List Dropdown */}
                    <div className='w-full flex flex-col p-3 bg-blue-50 shadow-md items-start justify-start gap-3 mb-3'>
                        {/* category */}

                        <label
                            htmlFor='available_items_with_count'
                            className='capitalize text-md font-semibold leading-tight tracking-tight'>
                            Category {itemsCategoryName}
                        </label>

                        <div className="flex items-start gap-2 w-full h-auto">
                   
                            <Select

                                options={categoryItems}
                                formatGroupLabel={formatGroupLabel}
                                onChange={(e) => {


                                    // Reset item category
                                    if(itemRef.current !== null){
                                        itemRef.current?.clearValue()
                                    }

                                    const _options = []
                                    let _values = []
                                    let _subCtgs = []

                                    if (options.length > 0) {
                                        options.forEach(({ category_name: ctg, category }) => {
                                            let allOccurences = options.filter(({ category_name }) => category_name === ctg)

                                            allOccurences.forEach(({ id, name }) => {
                                                _subCtgs.push(name)
                                                _values.push(id)
                                            })

                                            if (_options.map(({ name }) => name).indexOf(ctg) === -1) {

                                                _options.push({
                                                    category: ctg,
                                                    categoryId: category,
                                                    itemLabels: _subCtgs,
                                                    itemIds: _values
                                                })
                                            }

                                            _values = []
                                            _subCtgs = []

                                        })
                                    }

                                    const filters = _options.filter(({ categoryId }) => (categoryId === e.value))[0]

                                    const item_options = filters.itemLabels.map((label, i) => ({ label, value: filters.itemIds[i] }))



                                    setItemOptions(item_options)
                                }
                                }
                                name="category_items_with_count"
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: 'transparent',
                                        outLine: 'none',
                                        border: 'none',
                                        outLine: 'none',
                                        textColor: 'transparent',
                                        padding: 0,
                                        height: '4px',
                                        width: '100%'
                                    }),

                                }}

                                className='flex w-full   placeholder-gray-500 border border-blue-600 outline-none'
                            />

                            <div name="hidden_btn" className="bg-transparent w-20 p-2 flex items-center justify-evenly gap-2"
                            ></div>
                        </div>


                        <label
                            htmlFor='available_items_with_count'
                            className='capitalize text-md font-semibold leading-tight tracking-tight'>
                            {itemsCategoryName}
                        </label>

                        <div className="flex items-start gap-2 w-full h-auto">

                            <Select

                                options={itemOptions}
                                ref={itemRef}
                                formatGroupLabel={formatGroupLabel}
                                onChange={(e) => {
                                    setCurrentItem({ id: e?.value, name: e?.label, count: 1 })
                                }
                                }
                                name="available_items_with_count"
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: 'transparent',
                                        outLine: 'none',
                                        border: 'none',
                                        outLine: 'none',
                                        textColor: 'transparent',
                                        padding: 0,
                                        height: '4px',
                                        width: '100%'
                                    }),

                                }}
                                className='flex w-full   placeholder-gray-500 border border-blue-600 outline-none'
                            />
                            <button className="bg-blue-700  p-2 flex items-center justify-evenly gap-2"
                                onClick={e => {
                                    e.preventDefault()
                               
                                    // console.log({items})

                                    if (currentItem)
                                        setSelectedItems([
                                            currentItem,
                                            ...selectedItems,
                                        ])

                                }}>
                                <p className='text-white font-semibold'>Add</p>
                                <PlusIcon className='w-4 h-4 text-white' />
                            </button>


                        </div>
                    </div>


                    {/* Item Selected Table */}

                    <Table className="card bg-blue-50 shadow-md">
                        <TableBody>

                            <TableRow>
                                <TableCell className='bg-blue-50 text-black border-b border-blue-600'>
                                    <p className="text-md w-full flex flex-wrap font-bold justify-between items-center leading-tight tracking-tight">
                                        Assigned {itemsCategoryName}
                                    </p>{" "}
                                </TableCell>
                                <TableCell className='bg-blue-50 text-blue-700 border-b border-blue-600'>

                                </TableCell>
                                <TableCell className='bg-blue-50 text-blue-700 border-b border-blue-600'>

                                </TableCell>
                            </TableRow>
                            <TableRow className="border-b border-blue-600">
                                <TableCell>
                                    <p className='capitalize text-base font-semibold'>{itemsCategoryName}</p>
                                </TableCell>
                                <TableCell>
                                    <p className='text-base font-semibold'>Number</p>
                                </TableCell>
                                <TableCell className='text-xl font-semibold'>
                                    <p className='text-base font-semibold'>Action</p>
                                </TableCell>
                            </TableRow>

                            <>
                                {typeof items === 'object' &&
                                    items?.map(({ name, id, meta_id, count }, __id) => (
                                        <TableRow
                                            key={id}
                                        >
                                            <TableCell>{name}</TableCell>
                                            {/* {console.log({ selectedItems })} */}
                                            <TableCell>
                                                {
                                                    !(
                                                        // Exclude the Number input if   
                                                        // POWER SOURCE  
                                                        name.includes("Main Grid") ||
                                                        name.includes("Gas") ||
                                                        name.includes("Bio-Gas") ||
                                                        // WATER SOURCE
                                                        name.includes("Roof Harvested Water") ||
                                                        name.includes("River / Dam / Lake") ||
                                                        name.includes("Donkey Cart / Vendor") ||
                                                        name.includes("Piped Water") ||
                                                        // MEDICAL WASTE MANAGEMENT
                                                        name.includes("Sewer systems") ||
                                                        name.includes("Dump without burning") ||
                                                        name.includes("Open burning") ||
                                                        name.includes("Remove offsite") ||
                                                        // ACCESS ROADS
                                                        name.includes("Tarmac") ||
                                                        name.includes("Earthen Road") ||
                                                        name.includes("Graded ( Murrum )") ||
                                                        name.includes("Gravel")
                                                    ) &&
                                                    <Field
                                                        as='input'
                                                        type='number'
                                                        min={1}
                                                        name={id}
                                                        // defaultValue={itemData ? count : 0}
                                                        validate={validateCount}
                                                        className="flex-none w-24 bg-transparent border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none"
                                                    />
                                                }
                                                {errors[id] && <div><span className='text-red-600 mt-1'>{errors[id]}</span></div>}
                                            </TableCell>
                                            <TableCell>

                                                <button
                                                    type="button"
                                                    disabled={(items.length - 1) == __id ? false : true}

                                                    onClick={async (e) => {
                                                     if((items.length - 1) == __id) {

                                                        e.preventDefault()
                                                        let _items = items
                                                        setDeletedItems([...deletedItems, _items.splice(__id, 1)])
                                                        
                                                        setSelectedItems(_items);
                                                        saveSelectedItems(_items);
                                                        removeItemHandler(e, meta_id, alert)
                                                     }

                                                    }}
                                                    className={`flex ${(items.length - 1) == __id ? 'cursor-pointer' : 'cursor-not-allowed'}  items-center justify-center space-x-2 bg-red-400  p-1 px-2`}
                                                >
                                                    <span className="text-medium font-semibold text-white">
                                                        Remove
                                                    </span>
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))

                                }
                            </>
                        </TableBody>
                    </Table>


                    {/* Save btn */}

                    {
                        savedItems.length > 0 && item !== null &&

                        <div className="w-full flex justify-end h-auto mt-3">
                            <button type='submit' className='p-2 text-white bg-blue-600  font-semibold'>save & finish</button>
                        </div>
                    }

                    {
                        item === null &&

                        <div className='flex justify-between items-center w-full mt-4'>
                            <button onClick={handleItemPrevious} className='flex items-center justify-start space-x-2 p-1 border border-blue-900  px-2'>
                                <ChevronDoubleLeftIcon className='w-4 h-4 text-blue-900' />
                                <span className='text-medium font-semibold text-blue-900 '>
                                    {previousItemCategory}
                                </span>
                            </button>
                            <button
                                type='submit'
                                className='flex items-center justify-start space-x-2 bg-blue-700  p-1 px-2'>
                                <span className='text-medium font-semibold text-white'>
                                    {nextItemCategory}
                                </span>
                                <ChevronDoubleRightIcon className='w-4 h-4 text-white' />
                            </button>
                        </div>
                    }

                    <div className='w-full grid grid-cols-12 gap-4'>
                         <div className="col-span-5" >
                            <input type="text" onChange={(e)=>onSearch(e,true,false)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none" placeholder="Search" />
                            <ul>
                                {categoryOptions.map(({label, value}) => (
                                    <>

                                        <div key={value} className='card bg-blue-50 shadow-md p-2'>

                                            <li className="flex items-center justify-start space-x-2  p-1 px-2  hover:bg-red" onClick={()=>filterSpecialities(value)} key ={value}>{label}</li>
                                            <hr></hr>
                                        </div>
                                    </>
                                ))}
                            </ul>
                         </div>
                         <div className="col-span-7" >
                                <input type="text" onChange={(e)=>onSearch(e,false,true)} className="col-span-12 border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none" placeholder="Search" />
                                {/* {specialities.length === 0 && <p className="text-center">No specialities found</p>} */}
                                {/* <ul>
                                {specialities.map(({id, name})=>(
                                    <>
                                    <div className='card bg-blue-50 shadow-md p-2 flex col-span-12'>
                                        <div className="col-span-4  justify-start space-x-2  p-1 px-2">

                                            <li className="flex  justify-start  " key={id}>{name}</li> 
                                        </div>
                                        <div className="col-span-4  justify-start space-x-2  p-1 px-2">
                                            <input type="checkbox" className="bg-transparent border border-blue-600 p-2 placeholder-gray-500  focus:shadow-none focus:bg-white focus:border-black outline-none" />
                                        </div>
                                        <div className="col-span-4  justify-start space-x-2  p-1 px-2">

                                            <input type='number' min={0} className='' />
                                        </div>

                                    </div>
                                    <hr/>
                                    </>
                                ))}
                                </ul> */}

                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                        <th className="border px-1 py-1">Speciality</th>
                                        <th className="border px-1 py-1">Present</th>
                                        <th className="border px-1 py-1">Number</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-blue-50 shadow-md'>
                                        {specialities.length === 0 && <tr><td colSpan={3} className="text-center">No specialities found</td></tr>}
                                        {specialities.map((row) => (
                                        <tr key={row.id}>
                                            <td className="border px-1 py-1">
                                            <label  className="w-full p-2" >{row.name}</label>
                                            </td>
                                            <td className="border px-1 py-1">
                                            <input
                                                type="checkbox"
                                                className="p-1 w-5 h-5"
                                                checked={selectedRows.some(item=>item.rowid.includes(row.id))}
                                                onChange={() => handleCheckboxChange(row.id, row.name,row.category)}
                                            /> Yes
                                            </td>
                                            <td className="border px-1 py-1">
                                            <input
                                                type="number"
                                                className="p-1" 
                                                min={0}
                                                defaultValue={selectedRows.filter(k=>k.rowid==row.id).length>0?Number(selectedRows.filter(k=>k.rowid==row.id)[0].count):0}
                                                onChange={(e) => handleInputChange(row.id, e.target.value)}
                                                disabled={!selectedRows.some(item=>item.rowid.includes(row.id))}                                            />
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>

                                

                         </div>

                         {/* summary table */}
                         <div className="col-span-12" >

                         <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                        <th className="border px-1 py-1">Name</th>
                                        <th className="border px-1 py-1">Present</th>
                                        <th className="border px-1 py-1">Number</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-blue-50 shadow-md'>
                                        {selectedRows.length === 0 && <tr><td colSpan={3} className="text-center">No specialities found</td></tr>}
                                        {selectedRows.map((row) => (
                                        // <tr key={row.id}>
                                        //     <td className="border px-1 py-1">
                                        //     <label  className="w-full p-2" >{row.name}</label>
                                        //     </td>
                                        //     <td className="border px-1 py-1">
                                        //     <input
                                        //         type="checkbox"
                                        //         className="p-1 w-5 h-5"
                                        //         checked={selectedRows.includes(row.id)}
                                        //         onChange={() => handleCheckboxChange(row.id)}
                                        //     /> Yes
                                        //     </td>
                                        //     <td className="border px-1 py-1">
                                        //     <input
                                        //         type="number"
                                        //         className="p-1" min={0}
                                        //         disabled={!selectedRows.includes(row.id)}
                                        //     />
                                        //     </td>
                                        // </tr>
                                        <tr>
                                            <td className="border px-1 py-1">{row.sname}</td>
                                            <td className="border px-1 py-1">Yes</td>
                                            <td className="border px-1 py-1">{Number(row.count)}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                         </table>
                         </div>
                    </div>



                </Form>
            )}
        </Formik>


    )
}


export default EditListWithCount