let a = new (require('../Models/CreaturesModel'))();

a.search('Dire')
.then(console.log)
.catch(console.error);