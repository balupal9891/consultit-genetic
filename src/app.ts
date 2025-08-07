import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { route } from './routes/index.route';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use('/api', route);


app.get('/', (req, res)=>{
    res.send('Server is running');
})

app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT || 3000}`);
});