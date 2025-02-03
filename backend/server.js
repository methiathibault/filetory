const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const factureRoute = require('./routes/factureRoute');
const fileRoute = require('./routes/fileRoute');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', userRoute);
app.use('/factures', factureRoute);
app.use('/files', fileRoute);

app.listen(3001, () => {
    console.log('Server is running on port: 3001');
});