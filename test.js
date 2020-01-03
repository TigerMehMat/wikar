let a = function () {
        return new Promise((resolve, reject) => {
                resolve();
        });
};

let b = function () {
        return new Promise((resolve, reject) => {
                resolve();
        })
};

let c = function () {
        return new Promise((resolve, reject) => {
                reject();
        })
};

a()
        .then(() => {
            console.log(1);
            return b();
        })
        .then(() => {
            console.log(123);
            return c();
        })
        .catch(() => {
            console.log(2);
        })
        .then(() => {
            console.log(3);
        });