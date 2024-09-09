"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProjects } from "@/lib/actions";
import ProjectCard from '@/components/ProjectCard';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import { Project } from '@/types';

const PROJECTS_PER_PAGE = 9;

const Home: React.FC = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const decodedCategory = category ? decodeURIComponent(category) : undefined;

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [after, setAfter] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const projectsRef = useRef<Set<string>>(new Set());

    const fetchProjects = useCallback(async (reset: boolean = false) => {
        if (loading || (!hasMore && !reset)) return;
        setLoading(true);
        setError(null);

        try {
            const newProjects = await getProjects(decodedCategory, PROJECTS_PER_PAGE, reset ? null : after);
            const uniqueNewProjects = newProjects.filter(project => !projectsRef.current.has(project.id));

            setProjects(prev => reset ? uniqueNewProjects : [...prev, ...uniqueNewProjects]);
            uniqueNewProjects.forEach(project => projectsRef.current.add(project.id));

            setAfter(uniqueNewProjects[uniqueNewProjects.length - 1]?.id || null);
            setHasMore(uniqueNewProjects.length === PROJECTS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [after, decodedCategory]);

    useEffect(() => {
        projectsRef.current.clear();
        setProjects([]);
        setAfter(null);
        setHasMore(true);
        fetchProjects(true);
    }, [decodedCategory]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 &&
                !loading &&
                hasMore
            ) {
                fetchProjects();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchProjects, loading, hasMore]);

    const handleCardClick = (project: Project) => {
        setSelectedProject(project);
    };

    return (
        <section className="flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-12">
                Discover {decodedCategory ? `${decodedCategory} ` : ''}Projects
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        liveSiteUrl={project.liveSiteUrl}
                        githubUrl={project.githubUrl}
                        category={project.category}
                        createdBy={project.createdBy}
                        likes={project.likes}
                        views={project.views}
                        onClick={() => handleCardClick(project)}
                    />
                ))}
            </div>
            {loading && (
                <div className="mt-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            {!hasMore && projects.length > 0 && (
                <p className="mt-8 text-gray-600">No more projects to load.</p>
            )}
            {!loading && projects.length === 0 && (
                <p className="mt-8 text-gray-600">No projects found.</p>
            )}
            {selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
};

export default Home;