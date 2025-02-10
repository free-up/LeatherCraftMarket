import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Загружен файл:", file.name);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;