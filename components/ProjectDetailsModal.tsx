import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetailsModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-96">
                        <Image
                            src={project.image}
                            alt={project.title}
                            layout="fill"
                            objectFit="cover"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                        >
                            <Image src="/close.svg" alt="Close" width={24} height={24} />
                        </button>
                    </div>
                    <div className="p-8">
                        <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
                        <p className="text-gray-600 mb-6">{project.description}</p>
                        <div className="flex items-center mb-6">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                                {project.category}
                            </span>
                        </div>
                        <div className="flex items-center mb-8">
                            <Image
                                src={project.createdBy.avatarUrl}
                                alt={project.createdBy.name}
                                width={40}
                                height={40}
                                className="rounded-full mr-4"
                            />
                            <div>
                                <p className="font-semibold">{project.createdBy.name}</p>
                                <p className="text-sm text-gray-500">{project.createdBy.email}</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700"
                                >
                                    <Image src="/github.svg" alt="GitHub" width={20} height={20} className="mr-2" />
                                    GitHub Repository
                                </a>
                            )}
                            {project.liveSiteUrl && (
                                <a
                                    href={project.liveSiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Image src="/globe.svg" alt="Live Site" width={20} height={20} className="mr-2" />
                                    Live Site
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProjectDetailsModal;