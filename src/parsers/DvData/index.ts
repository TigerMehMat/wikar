import path = require("path");
import wiki = require('../../wikibot');
import fs = require('fs');
import env = require('../../env.js');


wiki.getDvData()
    .then((res: string) => {
        let result = res.replace(/(--.*|return )/gi, '');
        result = result.replace(/\["(.*?)"]\s*=/gi, '"$1": ');
        result = result.replace(/,\s*}/gi, '}');
        fs.writeFileSync(path.resolve(env.PATH_DATA, 'wiki/dvdata.json'), JSON.stringify(JSON.parse(result)), {encoding: "utf8"});
    });
