"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CreateProjectModal from '@/components/CreateProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import { deleteProject } from '@/lib/actions';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl?: string;
}

interface ProjectInput {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl?: string;
}


const UserProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [editingProject, setEditingProject] = useState<ProjectInput | null>(null);

    useEffect(() => {
        const fetchUserProjects = async () => {
            try {
                const [projectsResponse, userResponse] = await Promise.all([
                    fetch('/api/user-projects'),
                    fetch('/api/userId')
                ]);

                if (!projectsResponse.ok || !userResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const projectsData = await projectsResponse.json();
                const userData = await userResponse.json();

                setProjects(projectsData.projects);
                setUserId(userData.userId);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch projects');
                console.error('Error:', err);
                setLoading(false);
            }
        };

        fetchUserProjects();
    }, []);

    const handleDeleteProject = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(projectId);
                setProjects(projects.filter(project => project.id !== projectId));
            } catch (error) {
                console.error('Error deleting project:', error);
                setError('Failed to delete project. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <p className="text-2xl font-bold mb-4">{error}</p>
                <p className="text-lg">Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Your Projects</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Add New Project</span>
                </motion.button>
            </div>
            <AnimatePresence>
                {projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center text-gray-500 mt-16"
                    >
                        <p className="text-2xl font-semibold mb-4">No projects found.</p>
                        <p>Start by adding a new project using the button above.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-2">

                                            <motion.div
                                                whileHover={{scale: 1.1}}
                                                className="bg-white p-2 rounded-full shadow-md cursor-pointer"
                                                onClick={() => setEditingProject(project)}
                                            >
                                                <Image
                                                    src="/pencile.svg"
                                                    alt="Edit"
                                                    width={20}
                                                    height={20}
                                                />
                                            </motion.div>

                                        <motion.div
                                            whileHover={{scale: 1.1}}
                                            className="bg-white p-2 rounded-full shadow-md cursor-pointer"
                                            onClick={() => handleDeleteProject(project.id)}
                                        >
                                            <Image
                                                src="/trash.svg"
                                                alt="Delete"
                                                width={20}
                                                height={20}
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
                                    <p className="text-sm text-blue-600 mb-4">{project.category}</p>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
            {showModal && userId && (
                <CreateProjectModal onClose={() => setShowModal(false)} creatorId={userId} />
            )}
            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </div>
    );
};

export default UserProjectsPage;
