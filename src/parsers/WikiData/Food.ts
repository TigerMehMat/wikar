import path = require("path");
import wiki = require('../../wikibot');
import fs = require('fs');
import env = require('../../env.js');
import {getObjectFromLuaString} from "./common.js";


wiki.getFood()
    .then((res: string) => {
        fs.writeFileSync(path.resolve(env.PATH_DATA, 'wiki/food.json'), JSON.stringify(getObjectFromLuaString(res)), {encoding: "utf8"});
    });
