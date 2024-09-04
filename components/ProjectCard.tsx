// components/ProjectCard.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    liveSiteUrl: string | null;
    githubUrl: string | null;
    category: string;
    createdBy: {
        name: string;
        avatarUrl: string;
    };
    likes: number;
    views: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
                                                     id,
                                                     title,
                                                     description,
                                                     image,
                                                     liveSiteUrl,
                                                     githubUrl,
                                                     category,
                                                     createdBy,
                                                     likes,
                                                     views,
                                                 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="relative h-64 w-full">
                <Image src={image} alt={title} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <motion.h3
                        className="text-2xl font-bold text-white text-center px-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {title}
                    </motion.h3>
                </div>
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {category}
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="ml-2 text-sm text-gray-700">{createdBy.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className="flex items-center space-x-1"
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <Image
                                src={isLiked ? "/hearth-purple.svg" : "/hearth.svg"}
                                alt="Like"
                                width={20}
                                height={20}
                            />
                            <span className="text-sm text-gray-600">{likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                            <Image src="/eye.svg" alt="Views" width={20} height={20} />
                            <span className="text-sm text-gray-600">{views}</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    {liveSiteUrl && (
                        <Link href={liveSiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                            Live Site
                        </Link>
                    )}
                    {githubUrl && (
                        <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline text-sm font-medium">
                            GitHub
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;