import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const pathStorage = "uploads/";
        if (req.files.folderId) {
            const destinationPath = pathStorage + req.files.folderId + "/";
            callback(null, destinationPath);
        } else {
            const newFolderId = uuidv4(); // Generar un nuevo ID único
            req.files.folderId = newFolderId;
            const destinationPath = pathStorage + newFolderId + "/";
            fs.mkdirSync(destinationPath, { recursive: true });
            callback(null, destinationPath);
        }
    },
    filename: function (req, file, callback) {
        const ext = file.originalname.split(".").pop();
        const filename = uuidv4() + "." + ext;
        callback(null, filename);
    },
});

export const uploadMiddleware = multer({ storage });
