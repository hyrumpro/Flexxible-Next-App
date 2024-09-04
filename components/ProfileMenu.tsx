// components/ProfileMenu.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

type User = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

type ProfileMenuProps = {
    user: User;
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center focus:outline-none"
            >
                <Image
                    src={user.image || '/default-avatar.png'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <svg
                    className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="profile_menu-items">
                    <div className="px-4 py-3">
                        <p className="text-sm leading-5 font-medium text-gray-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-sm leading-5 text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                        <Link
                            href="/profile"
                            className="custom_menu-item"
                            onClick={() => setIsOpen(false)}
                        >
                            Your Profile
                        </Link>
                        <Link
                            href="/projects"
                            className="custom_menu-item"
                            onClick={() => setIsOpen(false)}
                        >
                            Your Projects
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="custom_menu-item text-red-500 hover:bg-red-50"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
