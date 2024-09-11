"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";

type Providers = Record<string, ClientSafeProvider>;

const AuthProviders: React.FC = () => {
    const [providers, setProviders] = useState<Providers | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await getProviders();
                setProviders(res);
            } catch (err) {
                setError("Failed to load authentication providers");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProviders();
    }, []);

    if (isLoading) {
        return <div className="flexCenter h-[300px]"><div className="loader"></div></div>;
    }

    if (error) {
        return (
            <div className="flexCenter flex-col h-[300px]">
                <p className="text-red-500 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!providers) {
        return <div className="text-center text-gray-500">No authentication providers available.</div>;
    }

    return (
        <div className="flexCenter flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8 bg-light-white rounded-2xl shadow-md">
            <h2 className="modal-head-text text-center">Sign In</h2>
            <p className="text-gray-600 text-center max-w-md">
                Choose your preferred method to sign in and start exploring amazing projects!
            </p>
            <div className="flex flex-col w-full max-w-md gap-4 mt-4">
                {Object.values(providers).map((provider) => (
                    <button
                        key={provider.id}
                        onClick={() => signIn(provider.id)}
                        className="flexCenter gap-4 w-full px-6 py-4 text-base font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <img
                            src={`/${provider.id.toLowerCase()}.svg`}
                            alt={provider.name}
                            className="w-6 h-6"
                        />
                        <span>Continue with {provider.name}</span>
                    </button>
                ))}
            </div>
            <p className="text-small text-gray-500 mt-6">
                By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
};

export default AuthProviders;
