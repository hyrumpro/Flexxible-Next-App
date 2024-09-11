import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthModal from './AuthModal';
import { getCurrentUser } from "@/lib/session";
import ProfileMenu from './ProfileMenu';
import CategoryFilter from './CategoryFilter';

const Navbar: React.FC = async () => {
    const session = await getCurrentUser();

    return (
        <header className="w-full z-50 bg-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.svg" alt="Logo" width={90} height={90} />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {session?.user ? (
                            <ProfileMenu user={session.user} />
                        ) : (
                            <AuthModal />
                        )}
                    </div>
                </div>
            </nav>
            <CategoryFilter />
        </header>
    );
};

export default Navbar;

