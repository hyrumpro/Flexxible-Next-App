import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { editProject, getProjectDetails } from '@/lib/actions';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const projectId = formData.get('id') as string;

        if (!projectId) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        // Get the current project details
        const currentProject = await getProjectDetails(projectId);
        if (!currentProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const file = formData.get('file') as File | null;
        let newImageUrl = currentProject.image;

        if (file) {
            if (currentProject.image) {
                const publicId = currentProject.image.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`next-projects/${publicId}`);
                }
            }

            const fileBuffer = await file.arrayBuffer();
            const base64Data = Buffer.from(fileBuffer).toString('base64');
            const fileUri = `data:${file.type};base64,${base64Data}`;

            const uploadResult = await cloudinary.uploader.upload(fileUri, {
                invalidate: true,
                folder: 'next-projects',
            });

            newImageUrl = uploadResult.secure_url;
        }

        const updatedProject = await editProject({
            id: projectId,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            image: newImageUrl,
            liveSiteUrl: formData.get('liveSiteUrl') as string,
            githubUrl: formData.get('githubUrl') as string,
            category: formData.get('category') as string,
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error editing project:', error);
        return NextResponse.json({ error: "An error occurred while editing the project" }, { status: 500 });
    }
}