const CreatureExtractor = require('./Extractors/CreatureExtractor.js');

let creature_ext = (new CreatureExtractor())
        .firstExtract()
        .preParse()
        .extracting();
creature_ext.save()
        .then(() => {
                console.log('Данные заполнены');
        })
        .catch(console.error);
