import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

// Define file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb means callback
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") +
                "-" +
                file.originalname,
        ); // 23/08/2023
    },
});

// Specify file format that can be saved
function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage, fileFilter });

// File Size Formatter
const fileSizeFormatter = (bytes: number, decimal?: number): string => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) +
        " " +
        sizes[index]
    );
};

export { upload, fileSizeFormatter };
