import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';


interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    liveSiteUrl: string | null;
    githubUrl: string | null;
    createdBy: {
        name: string;
        email: string;
        avatarUrl: string;
    };
}

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
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-96 md:h-[500px]">
                        <Image
                            src={project.image}
                            alt={project.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-all duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            <Image src="/close.svg" alt="Close" width={24} height={24} />
                        </button>
                    </div>
                    <div className="p-8 md:p-12 bg-white -mt-20 relative rounded-t-3xl">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">{project.title}</h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap items-center mb-6 gap-2">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {project.category}
              </span>
                        </div>
                        <div className="flex items-center mb-8">
                            <Image
                                src={project.createdBy.avatarUrl}
                                alt={project.createdBy.name}
                                width={48}
                                height={48}
                                className="rounded-full mr-4"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">{project.createdBy.name}</p>
                                <p className="text-sm text-gray-500">{project.createdBy.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
                                >
                                    <Image src="/github.svg" alt="GitHub" width={24} height={24} className="mr-2" />
                                    GitHub Repository
                                </a>
                            )}
                            {project.liveSiteUrl && (
                                <a
                                    href={project.liveSiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                >
                                    <Image src="/globe.svg" alt="Live Site" width={24} height={24} className="mr-2" />
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