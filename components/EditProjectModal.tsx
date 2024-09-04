import React, { useState, useCallback, useEffect } from 'react';
import { editProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import CustomMenu from './CustomMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ProjectInput {
    id: string;
    title: string;
    description?: string;
    image: string | File;
    liveSiteUrl: string;
    githubUrl?: string;
    category: string;
}

const categories = ["Front-end", "Back-end", "UI/UX", "Mobile", "Full Stack", "Game Dev"];

const EditProjectModal: React.FC<{ project: ProjectInput; onClose: () => void }> = ({ project, onClose }) => {
    const [formData, setFormData] = useState<ProjectInput>(project);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFormData(prev => ({ ...prev, image: acceptedFiles[0] }));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            let imageUrl = formData.image;
            if (formData.image instanceof File) {
                imageUrl = await uploadImage(formData.image);
            }

            const updatedProject = await editProject({ ...formData, image: imageUrl });
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                router.refresh();
            }, 2000);
        } catch (error) {
            setError('Failed to update project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        return data.secure_url;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
    <motion.div
        initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    className="bg-white rounded-lg p-8 max-w-md w-full"
    >
    <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold">Edit Project</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        </button>
        </div>
    {error && <p className="text-red-500 mb-4">{error}</p>}
        {isSuccess ? (
            <p className="text-green-500">Project updated successfully! Redirecting...</p>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            />
            <textarea
                name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            />
            <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
            <input {...getInputProps()} />
            {formData.image instanceof File ? (
                <p>New image selected: {formData.image.name}</p>
            ) : (
                <div>
                    <p>Current image:</p>
            <Image src={formData.image} alt="Current project image" width={100} height={100} />
            <p>Drag 'n' drop a new image here, or click to select one</p>
            </div>
            )}
            </div>
            <input
            type="url"
            name="liveSiteUrl"
            placeholder="Live Site URL"
            value={formData.liveSiteUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            />
            <input
                type="url"
            name="githubUrl"
            placeholder="GitHub URL (Optional)"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
                {isSubmitting ? 'Updating Project...' : 'Update Project'}
                </button>
                </form>
        )}
        </motion.div>
        </motion.div>
        </AnimatePresence>
    );
};

export default EditProjectModal;