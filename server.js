//
//	EVERYTHING SERVER RELATED
//

const app = require('./app');

//LISTEN ON PORT 3000
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
