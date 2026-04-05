"use client";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 5,
    y: -5,
    opacity: 1,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (file: File | null) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const nextFile = newFiles[0] ?? null;
    setFile(nextFile);
    onChange?.(nextFile);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp"
          multiple={false}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="relative mx-auto mt-5 w-full">
            {file && (
              <motion.div
                key="file-0"
                layoutId="file-upload"
                className={cn(
                  "relative z-40 mx-auto flex w-full flex-col items-center justify-center overflow-hidden rounded-md bg-black/90 p-4 md:h-24 dark:bg-white/90",
                  "shadow-sm",
                )}
              >
                <div className="flex w-full min-w-0 items-center justify-between gap-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="min-w-0 max-w-46 flex-1 truncate text-sm text-white dark:text-black"
                  >
                    {file.name}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="shadow-input w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-white/70 dark:text-black/70 font-bold"
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>

                <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-2 text-sm text-white dark:text-black">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="rounded-md bg-neutral-500 px-2 py-0.5 dark:bg-neutral-50"
                  >
                    {file.type}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className="ml-auto"
                  >
                    modified {new Date(file.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
              </motion.div>
            )}

            {!file && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative z-40 mx-auto mt-2 flex h-10 w-full max-w-32 items-center justify-center rounded-md bg-black group-hover/file:shadow-2xl dark:bg-white",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-white dark:text-black font-semibold"
                  >
                    Drop here
                    <IconUpload className="h-5 w-5 text-white dark:text-black" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-5 w-5 text-white dark:text-black" />
                )}
              </motion.div>
            )}

            {!file && (
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 z-30 mx-auto mt-2 flex h-10 w-full max-w-32 items-center justify-center rounded-md border border-dashed border-fuchsia-400 bg-transparent opacity-0"
              ></motion.div>
            )}

            <p className="relative z-20 mt-2 font-sans text-sm text-center font-normal text-neutral-400 dark:text-neutral-400">
              Thả tệp vào đây hoặc nhấp để chọn tệp.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
