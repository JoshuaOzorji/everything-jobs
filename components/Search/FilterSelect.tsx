import React from "react";

interface Option {
	_id: string;
	name: string;
}

interface FilterSelectProps {
	label: string;
	value: string;
	options: Option[];
	onChange: (value: string) => void;
	placeholder?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
	label,
	value,
	options,
	onChange,
	placeholder = "All",
}) => {
	return (
		<div className='mb-4'>
			<label className='block mb-2 text-sm font-bold text-myBlack'>
				{label}
			</label>
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='w-full p-2 border rounded focus:outline-none'>
				<option value=''>{placeholder}</option>
				{options.map((option) => (
					<option
						key={option._id}
						value={option.name}>
						{option.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default FilterSelect;
