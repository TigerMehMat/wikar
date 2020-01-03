const config = {
        token: "NTQ5NTgwNTg1MjkxNDgxMTA4.D1V8mA.eqaHBZhuddkt_3RIc8baULDpD_Q",
        //test - NTQ5NTgwNTg1MjkxNDgxMTA4.D1V8mA.eqaHBZhuddkt_3RIc8baULDpD_Q
        //release - NTQ3Mzk3NzI0NjAyMTA1ODY2.D02NPw.iSqtyrCJBbPQP-uEjCSj-wjo-KE
        // access: {
        //     'guilds': {
        //         '412361421335298048': { //DeMonbrey
        //             'options': {
        //                 'timeTo': Infinity,
        //                 'tribeFunctions': true,
        //             },
        //             'default': true,
        //         },
        //         '547378841606160404': { //Wikark-Bot
        //             'options': {
        //                 'timeTo':           Infinity,
        //                 'tribeFunctions':   true,
        //                 'specialMessages':  {
        //                     'channel': '565133533245472774',
        //                     'messages': {
        //                         'currentMultipliers': '565185263072968727',
        //                     }
        //                 }
        //             },
        //             'default': true,
        //             '557823771642429440': false,
        //         },
        //         '304855554705063936': { //ARK: Survival Evolved
        //             'options': {
        //                 'timeTo': Infinity,
        //                 'tribeFunctions': false,
        //             },
        //             'default': false,
        //             '549500117154267149': true, //wiki-bot
        //         },
        //         '300225382588874753': { //Survival Games
        //             'options': {
        //                 'timeTo': 10,
        //                 'tribeFunctions': false,
        //                 'specialMessages':  {
        //                     'channel': '565193792890732544',
        //                     'messages': {
        //                         'currentMultipliers': '565195765148942346',
        //                     }
        //                 }
        //             },
        //             'default': false,
        //             '550253170312609792': true, //wikark-bot
        //         },
        //     },
        // },
        // accessFotTribe: {
        //     'guilds': {
        //         'default': false,
        //         '412361421335298048': { //DeMonbrey
        //             'default': true,
        //         },
        //         '547378841606160404': { //Wikark-Bot
        //             'default': true,
        //             '557823771642429440': false,
        //         },
        //     },
        // },
        // ark_guild: ['547378841606160404'],
        // ark_channel: ['565133533245472774'],
        // ark_message: ['565185263072968727'],


        //currentOficialMaps: ['The Island', 'The Center', 'Scorched Earth', 'Ragnarok', 'Aberration', 'Extinction', 'Valguero'],
        bm_duration_time: 10000,
        bm_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjNhNWYxMjEwZTU5NTI0YjQiLCJpYXQiOjE1NTQxMDcwNzcsIm5iZiI6MTU1NDEwNzA3NywiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxMTkxOTAifQ.eWMOS_z6AMpZbRfzg2SUDJK6fgOQOSbdaWFw3vysN1M',
        // bm: [
        //     {
        //         info: [
        //             {
        //                 name: 'Тестовый сервер (рабочий)',
        //                 id: 'vivihilio',
        // 				timeTo: +new Date(2019,11,31,23,59,59),
        //                 guild: '547378841606160404',
        //                 channel: '559689029252153364',
        //                 statusMessage: '559756712257650718',
        //                 logMessages: {
        //                     'The Island': '559691304481587203',
        //                     'The Center': '559691305601597461',
        //                     'Scorched Earth': '559691306947837952',
        //                     'Ragnarok': '559691308357386240',
        //                     'Aberration': '559691309473071105',
        //                     'Extinction': '559691333611028491',
        //                     'Valguero': '559756711087570945',
        //                 },
        //             },
        //         ],
        //         servers: { // Crossark11
        //             'The Island': '2384486',
        //             'The Center': '73216',
        //             'Scorched Earth': '2384459',
        //             'Ragnarok': '73166',
        //             'Aberration': '2384456',
        //             'Extinction': '2808747',
        //             'Valguero': '73077',
        //         }
        //     },
        //     {
        //         info: [
        //             {
        //                 name: 'Тестовый сервер (рабочий2)',
        //                 id: 'karhut',
        // 				timeTo: Infinity,
        //                 guild: "547378841606160404",
        //                 statusMessage: '596654738724880425',
        //                 channel: "596631182935064589",
        //                 logMessages: {
        //                     "The Island": "596654653874372608",
        //                     "The Center": "596654659612180481",
        //                     "Scorched Earth": "596654665010118656",
        //                     "Ragnarok": "596654670127169537",
        //                     "Aberration": "596654675584090113",
        //                     "Extinction": "596654680688427008",
        //                     "Valguero": "596654686728093696",
        //                 }
        //             }
        //         ],
        //         servers: { // Crossark13
        //             'The Island': '490725',
        //             'The Center': '2072655',
        //             'Scorched Earth': '2072664',
        //             'Ragnarok': '73146',
        //             'Aberration': '1559101',
        //             'Extinction': '2808756',
        //             'Valguero': '73078',
        //         }
        //     },
        // ],

        /* Paths and filenames */

        path: {
                bm_directory: 'bm_test',
        },

        /* MySQL DataBase */

        mysql: {
                "host": "sql34.main-hosting.eu",
                "database": "u116167615_wikte",
                "password": "123456",
                "user": "u116167615_wikte",
                "timeout": 100000,
        },

        steamToken: 'FF6E497FE4E6936D0A7DE373E087C10C',
};

module.exports = config;
