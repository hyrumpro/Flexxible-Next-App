"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { getProjects } from "@/lib/actions";
import ProjectCard from '@/components/ProjectCard';

const PROJECTS_PER_PAGE = 9;

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [after, setAfter] = useState(null);

    const fetchProjects = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const newProjects = await getProjects(undefined, PROJECTS_PER_PAGE, after);
            setProjects(prev => [...prev, ...newProjects]);
            setAfter(newProjects[newProjects.length - 1]?.id);
            setHasMore(newProjects.length === PROJECTS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }, [after, loading, hasMore]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
            fetchProjects();
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchProjects, loading]);

    return (
        <section className="flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-12">Discover Amazing Projects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                ))}
            </div>
            {loading && (
                <div className="mt-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
            {!hasMore && (
                <p className="mt-8 text-gray-600">No more projects to load.</p>
            )}
        </section>
    );
};

export default Home;