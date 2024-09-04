import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import Image from "next/image";

type Props = {
    title: string;
    value: string;
    options: Array<string>;
    onChange: (value: string) => void;
};

const CustomMenu: React.FC<Props> = React.memo(({ title, value, options, onChange }) => {
    const defaultOption = "Select one";
    const allOptions = [defaultOption, ...options];

    const handleChange = (newValue: string) => {
        if (newValue !== value) {
            onChange(newValue);
        }
    };

    return (
        <div className="w-full">
            <Listbox value={value} onChange={handleChange}>
                {({ open }) => (
                    <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
                            {title}
                        </Listbox.Label>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 sm:text-sm form_field-input">
                                <span className="block truncate">{value}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <Image
                                        src="/arrow-down.svg"
                                        width={12}
                                        height={6}
                                        alt="arrow down"
                                        className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {allOptions.map((option) => (
                                        <Listbox.Option
                                            key={option}
                                            className={({ active }) =>
                                                `${active ? 'text-white bg-blue-600' : 'text-gray-900'}
                                                cursor-default select-none relative py-2 pl-10 pr-4`
                                            }
                                            value={option}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                        {option}
                                                    </span>
                                                    {selected ? (
                                                        <span className={`${active ? 'text-white' : 'text-blue-600'}
                                                            absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    );
});

CustomMenu.displayName = 'CustomMenu';

export default CustomMenu;