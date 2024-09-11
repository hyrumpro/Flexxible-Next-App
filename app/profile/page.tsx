"use client";

import React, { useState, useEffect } from 'react';
import { getUser, updateUser } from '@/lib/actions';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
    id: string;
    name: string;
    email: string;
    description?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    avatarUrl?: string;
};



const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userIdResponse = await fetch('/api/userId');
                const { userId } = await userIdResponse.json();
                const userData = await getUser(userId);
                setUser(userData);
                setEditedUser(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedUser((prev: Partial<User> | null) => {
            if (prev === null) return { [name]: value };
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await updateUser(editedUser);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Notice:</strong>
                    <span className="block sm:inline"> User not found.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="relative h-48 bg-blue-600">
                    <Image
                        src={user.avatarUrl || '/default-avatar.png'}
                        alt={user.name}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-50"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="relative px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                            <div className="flex-shrink-0">
                                <Image
                                    className="mx-auto h-20 w-20 rounded-full border-4 border-white shadow-lg"
                                    src={user.avatarUrl || '/default-avatar.png'}
                                    alt={user.name}
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user.name}</p>
                                <p className="text-sm font-medium text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <div className="mt-5 sm:mt-0">
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Image src="/pencile.svg" width={16} height={16} alt="Edit" className="mr-2" />
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.form
                                key="edit-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-4"
                            >
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={editedUser.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows={3}
                                        value={editedUser.description || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Add a description..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub URL</label>
                                    <input
                                        type="url"
                                        name="githubUrl"
                                        id="githubUrl"
                                        value={editedUser.githubUrl || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="https://github.com/yourusername"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedinUrl"
                                        id="linkedinUrl"
                                        value={editedUser.linkedinUrl || ''}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="https://www.linkedin.com/in/yourusername"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="profile-info"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-6 space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">About</h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {user.description || 'No description provided'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Links</h3>
                                    <div className="mt-2 flex space-x-4">
                                        {user.githubUrl ? (
                                            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                                                <span className="sr-only">GitHub</span>
                                                <Image src="/github.svg" width={24} height={24} alt="GitHub" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500">No GitHub link provided</span>
                                        )}
                                        {user.linkedinUrl ? (
                                            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                                                <span className="sr-only">LinkedIn</span>
                                                <Image src="/linkedin.svg" width={24} height={24} alt="LinkedIn" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500">No LinkedIn link provided</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;