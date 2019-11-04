const axios     = require('axios');
const cheerio   = require('cheerio');

const wikiLink  = 'https://ark-ru.gamepedia.com/';

class Wiki {
    static getPage(pageName){
        return new Promise((resolve, reject) => {
            axios.get(wikiLink + pageName)
                .then((response) => {
                    resolve(response.data);
                })
                .catch(reject);
        })
    }

    static getCraft(page) {
        let $           = cheerio.load(page);
        let arr_craft   = [];
        let $firstCraft  = $($('[data-wikark=craft]')[0]).parent();
        $firstCraft.find('[data-wikark=craft]>b').each((i, elem) => {
            $(elem).find('div').remove();
            let text = $(elem).text();
            let res = text.split('×');
            arr_craft.push({'name': res[1].trim(), 'quantity': res[0].trim()});
        });
        return arr_craft;
    }

    static getTitle(page) {
        let $ = cheerio.load(page);
        return $('#firstHeading').text();
    }

    static getCraftIn(page) {
        let $ = cheerio.load(page);
        let $craftIn = $($(".infobox-row:contains('Создается в')")[0]).find(".infobox-row-value a:not(.image)");
        let arr_craft_in = [];
        $craftIn.each((i, elem) => {
            let text1 = $(elem).text().trim();
            if(text1 !== '')
                arr_craft_in.push(text1)
        });
        return arr_craft_in;
    }

    static getLevel(page) {
        let $ = cheerio.load(page);
        let $lvl = $(".infobox-row:contains('Требуемый Уровень'),.infobox-row:contains('Требуемый уровень')").find(".infobox-row-value");
        if($lvl.length === 0) return false;
        $lvl.find("a").remove();
        return $lvl.text().trim();
    }
}

module.exports = Wiki;
