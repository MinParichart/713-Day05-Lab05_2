
import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import multer from 'multer';
import eventRoute from './routes/eventRoute';
dotenv.config();

import { uploadFile } from './services/uploadFileService';
const app = express();
const allowedOrigins = ['http://localhost:5173', 'https://713-2024-frontend.vercel.app'];
const options: cors.CorsOptions = {
    origin: allowedOrigins
  };
  
  // Then pass these options to cors:
  app.use(cors(options));
  
app.use(express.json());
app.use('/events',eventRoute);
// const port = 3000;
const port = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const bucket = process.env.SUPABASE_BUCKET_NAME;
    const filePath = process.env.UPLOAD_DIR;

    if (!bucket || !filePath) {
      return res.status(500).send('Bucket name or file path not configured.');
    }
    const ouputUrl = await uploadFile(bucket, filePath, file);

    res.status(200).send(ouputUrl);
  } catch (error) {
    res.status(500).send('Error uploading file.');
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
