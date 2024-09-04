import React, { useState, useCallback } from 'react';
import { createProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import CustomMenu from './CustomMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface ProjectInput {
    title: string;
    description?: string;
    image: File | null;
    liveSiteUrl: string;
    githubUrl?: string;
    category: string;
    creatorId: string;
}

const categories = ["Front-end", "Back-end", "UI/UX", "Mobile", "Full Stack", "Game Dev"];

const CreateProjectModal: React.FC<{ onClose: () => void; creatorId: string }> = ({ onClose, creatorId }) => {
    const [formData, setFormData] = useState<ProjectInput>({
        title: '',
        description: '',
        image: null,
        liveSiteUrl: '',
        githubUrl: '',
        category: 'Select one',
        creatorId,
    });

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFormData(prev => ({ ...prev, image: acceptedFiles[0] }));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        }
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCategoryChange = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Basic validation
        if (formData.title.length < 3 || formData.title.length > 100) {
            setError('Title must be between 3 and 100 characters.');
            setIsSubmitting(false);
            return;
        }
        if (formData.description && formData.description.length > 1000) {
            setError('Description must not exceed 1000 characters.');
            setIsSubmitting(false);
            return;
        }
        if (!formData.liveSiteUrl) {
            setError('Live Site URL is required.');
            setIsSubmitting(false);
            return;
        }
        if (!formData.category || formData.category === "Select one") {
            setError('Please select a category.');
            setIsSubmitting(false);
            return;
        }
        if (!formData.image) {
            setError('Please upload an image.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadImage(formData.image);

            // Create project with Cloudinary image URL
            const projectData = { ...formData, image: imageUrl };
            await createProject(projectData);

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                router.refresh();
            }, 2000);
        } catch (error) {
            setError('Failed to create project. Please try again.');
            setIsSubmitting(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.secure_url;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.9}}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {isSuccess ? (
                        <p className="text-green-500">Project created successfully! Redirecting...</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Project Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 rounded form_field-input"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 rounded form_field-input"
                                rows={3}
                            />
                            <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
                                <input {...getInputProps()} />
                                {formData.image ? (
                                    <p>Image selected: {formData.image.name}</p>
                                ) : (
                                    <p>Drag 'n' drop an image here, or click to select one</p>
                                )}
                            </div>
                            <input
                                type="url"
                                name="liveSiteUrl"
                                placeholder="Live Site URL"
                                value={formData.liveSiteUrl}
                                onChange={handleChange}
                                className="w-full p-2 rounded form_field-input"
                                required
                            />
                            <input
                                type="url"
                                name="githubUrl"
                                placeholder="GitHub URL (Optional)"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                className="w-full p-2 rounded form_field-input"
                            />
                            <CustomMenu
                                title="Category"
                                value={formData.category}
                                options={categories}
                                onChange={handleCategoryChange}
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Project...' : 'Create Project'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateProjectModal;