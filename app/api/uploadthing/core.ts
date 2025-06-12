import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
        },
    })
        .middleware(async () => {
            const session = await auth();
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const fileUrl = `https://utfs.io/f/${file.key}`;

            return {
                uploadedBy: metadata.userId,
                fileUrl,
                fileKey: file.key,
                permanent: true,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;