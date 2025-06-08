import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({ 
    cloud_name: 'dzjiynrzn', 
    api_key: '969884373835776', 
    api_secret: 'rUt8F-RNQF8-qKFMHsoBxVXSfwM' 
});
export default cloudinary;