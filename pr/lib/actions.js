/**
 * Created by gasya on 20.02.16.
 * DigitalOutlooks corporation.
 */
"use strict";

const fs = require("fs");
const color = require("colors");
const lib = require("./algorithm");


const config = {
    itemsPath: "./items"
};

class App {
    static getListOfItems() {
        let files = [];
        try {
            files = fs.readdirSync(config.itemsPath);
        } catch (e) {
            throw e;
        }

        return files;
    }

    static getItems() {
        let files = App.getListOfItems();

        let items = [];
        files.forEach(function (fileName) {
            items.push(fs.readFileSync(config.itemsPath + "/" + fileName, 'utf8'));
        });
        return items;
    }

    static parseItems(items) {
        return items.map(function (item) {
            return new lib.Item(item.split(""));
        });
    }
}

class Commands {
    static execute(cmd, args) {
        if (cmd == 'execute') {
            console.warn("Command execute is not permitted".red);
        } else {
            if (typeof Commands[cmd] === 'function') {
                //console.log("Executing", cmd);
                try {
                    Commands[cmd](args);
                } catch (e) {
                    console.warn(e.message.red);
                }

            } else {
                console.warn("Command".red, cmd, "not found".red);
            }
        }

    }

    static separate(args) {
        var text = fs.readFileSync("./tmp/_item_jeka", 'utf8');
        var items = text.split("\n");
        items.forEach(function (item, i) {
            fs.writeFileSync("./tmp/item" + i, item.replace(/\s/g, ""));
        })

    }

    static test(args) {
        const statisticFile = args[0];

        let items = App.parseItems(App.getItems());

        const result = lib.Algorithm.clasterize(items);
        const statistic = result.statistic;
        if (!!statisticFile) {
            fs.writeFileSync(statisticFile, statistic.toString());
        }

    }

    static run(args) {
        const statisticFile = args[0];
        const resultFile = args[1];
        const limit = args[2];

        let items = App.parseItems(App.getItems());

        const result = lib.Algorithm.clasterize(items, limit);
        const statistic = result.statistic;

        statistic.steps.forEach(function (step, i) {
            console.log("Step".yellow, i.toString().green);
            console.log("Claster count:".yellow, step.clasters.length.toString().green);
            if (!!step.nearest) {
                console.log("Union".yellow,
                    step.nearest[0].toString().green,
                    "with".yellow,
                    step.nearest[1].toString().green,
                    "by distance".yellow, step.nearestDistance.toString().green);
            }
        });

        if (!!statisticFile) {
            fs.writeFileSync(statisticFile, statistic.toString());
        }
        if (!!resultFile) {
            fs.writeFileSync(resultFile, statistic.result());
        }
    }

    static init(args) {
        console.log("Init PR project".green);
        try {
            fs.mkdirSync(config.itemsPath);
        } catch (e) {
        }
    }

    static delete(args) {
        console.log("Delete PR project".green);
        try {
            fs.unlinkSync(config.itemsPath);
        } catch (e) {
        }
    }
    static items(args) {
        let files = App.getListOfItems();

        console.log("List of items:");
        if (files.length === 0) console.log("\<Empty\>".yellow);
        files.forEach(function (fileName) {
            console.log("-", fileName.green);
        });
    }

    static additem(args) {
        const sourceFile = args[0];
        const destFile = config.itemsPath + "/" + args[1];
        Helpers.copyFile(sourceFile, destFile, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Done".green);
            }
        });
    }

    static additems(args) {
        const sourceDir = args[0];
        const destDir = config.itemsPath;

        let files = [];
        try {
            files = fs.readdirSync(sourceDir);
        } catch (e) {
            throw e;
        }


        console.log("Items to add count:", files.length.toString().green);
        files.forEach(function (fileName, i) {
            console.log(i, fileName);
            const sourceFile = sourceDir + "/" + fileName;
            const destFile = destDir + "/" + fileName;
            Helpers.copyFile(sourceFile, destFile, function (err) {
                if (err) {
                    console.log(fileName, "adding error. Try to init PR");
                }
            });
        })

    }

    static deleteitem(args) {
        const itemName = args[0];
        if (typeof itemName !== "string") throw new TypeError("Specify item name");
        try {
            fs.unlinkSync(config.itemsPath + "/" + itemName);
        } catch (e) {
            console.warn("Item".yellow, itemName.toString().red, "not found".yellow);
        }

    }
}


class Helpers {
    static copyFile(source, target, cb) {
        var cbCalled = false;

        var rd = fs.createReadStream(source);
        rd.on("error", function (err) {
            done(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on("error", function (err) {
            done(err);
        });
        wr.on("close", function (ex) {
            done();
        });
        rd.pipe(wr);

        function done(err) {
            if (!cbCalled) {
                cb(err);
                cbCalled = true;
            }
        }
    }
}

module.exports = Commands;