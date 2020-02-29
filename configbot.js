const config = {
        token: "NTQ5NTgwNTg1MjkxNDgxMTA4.D1V8mA.eqaHBZhuddkt_3RIc8baULDpD_Q",
        bm_duration_time: 10000,
        bm_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjNhNWYxMjEwZTU5NTI0YjQiLCJpYXQiOjE1NTQxMDcwNzcsIm5iZiI6MTU1NDEwNzA3NywiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxMTkxOTAifQ.eWMOS_z6AMpZbRfzg2SUDJK6fgOQOSbdaWFw3vysN1M',

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

        postgresql: {
                "host": "176.119.158.179",
                "port": 5432,
                "database": "wikark",
                "password": "Tiger98mehmat",
                "user": "postgres",
                "max": 500,
                //"timeout": 100000,
        },

        steamToken: 'FF6E497FE4E6936D0A7DE373E087C10C',
};

module.exports = config;
