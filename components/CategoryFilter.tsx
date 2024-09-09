"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const categories = ["All", "Front-end", "Back-end", "UI/UX", "Mobile", "Full Stack", "Game Dev"];

const CategoryFilter: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'All';

    const createQueryString = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'All') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        return params.toString();
    };

    return (
        <div className="w-full bg-light-white border-b border-nav-border">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
                    {categories.map((category) => (
                        <Link
                            key={category}
                            href={`${pathname}${category === 'All' ? '' : `?${createQueryString(category)}`}`}
                            className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors duration-300 ${
                                currentCategory.toLowerCase() === category.toLowerCase()
                                    ? 'bg-primary-purple text-white'
                                    : 'bg-light-white-100 text-gray-700 hover:bg-light-white-200'
                            }`}
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;