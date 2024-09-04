"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DatabaseResponse {
    message: string;
    serverTime: string;
}

export default function DbTest() {
    const [result, setResult] = useState<DatabaseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function testConnection() {
            try {
                const response = await fetch('/api/postgres', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: DatabaseResponse = await response.json();
                setResult(data);
            } catch (err) {
                console.error('Error testing database connection:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        testConnection();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <h1 className="text-6xl font-bold mb-8">
                    Database Connection Test
                </h1>

                {loading && (
                    <p className="text-xl mb-4">Testing database connection...</p>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {result && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Success: </strong>
                        <span className="block sm:inline">{result.message}</span>
                        <p className="mt-2">Server time: {new Date(result.serverTime).toLocaleString()}</p>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
                    {/* You can add more content or links here */}
                </div>
            </main>

            <footer className="flex items-center justify-center w-full h-24 border-t">
                <a
                    className="flex items-center justify-center"
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <Image src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" width={72} height={16} />
                </a>
            </footer>
        </div>
    );
}