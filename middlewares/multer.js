import multer from 'multer';

const storage = multer.memoryStorage(); // keeps file in memory as a buffer, no disk write needed
const upload = multer({ storage });

export default upload;  