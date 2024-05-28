
import { forwardRef } from 'react'


const Select = forwardRef(function Select(props, ref) {

    return (
        <select
          ref={ref}
          as="select"
          {...props}
          className='flex-none w-full p-2 border border-gray-800 rounded bg-transparent flex-grow  placeholder-gray-200  focus:border-black outline-none'>
          {
            ((_options) => _options.map(({ value, label }, i) =>
              <option className={`py-1 hover:bg-red-300 text-normal font-normal ${i == 0 ? 'text-gray-300' : ''}`} key={i} value={value}>{label}</option>
            ))(props.options?.length ? [{label:props.placeholder ??  "Select option..", value:""}, ...props.options] : [])
          }
        </select>
    )
});

export { Select }