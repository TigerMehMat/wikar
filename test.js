const ARK_api = require('./controllers/GlobalControllers/ARK_api');
async function start(){
    let res = await ARK_api.getRates();

    console.log(res);
}

start();
