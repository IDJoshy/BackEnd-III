import mongoose from 'mongoose';

const connection = async(url, dbName) => 
{
    try
    {
        await mongoose.connect(url, {dbName:dbName});
        console.log("Connected to Cluster in: " + url + " database: " + dbName);
    }
    catch(error)
    {
        console.log(`Error connecting to Cluster: ${error.message}`);
        process.exit(1);
    }   
}

export default connection;