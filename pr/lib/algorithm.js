/**
 * Created by gasya on 20.02.16.
 * DigitalOutlooks corporation.
 */
"use strict";
class Statistic {
    constructor() {
        this.steps = [];
        this.addStep = this.addStep.bind(this);
        this.toString = this.toString.bind(this);
        this.result = this.result.bind(this);
    }

    addStep(clasters, nearest) {
        let step = {};
        step.clasters = [];

        if (!!nearest) {
            step.nearest = [];
            step.nearestDistance = nearest.distance;
        }

        let sumDistance = 0;
        clasters.forEach(function (claster) {
            const items = [];
            const marks = [];

            if (!!nearest && !!step.nearest) {
                if (nearest.c1 === claster || nearest.c2 === claster) {
                    step.nearest.push(step.clasters.length);
                }
            }
            claster.items.forEach(function (item) {
                items.push(item.values.join(""));
                if (item.mark) {
                    marks.push(item.mark);
                }
            });
            const result = {
                items,
                innerDistance: claster.innerDistance()
            };
            sumDistance += result.innerDistance;
            if (marks.length == items.length) {
                result.marks = marks;
            }
            step.clasters.push(result);
        });
        step.sumDistance = sumDistance;
        this.steps.push(step);
    }

    toString() {
        return JSON.stringify({steps: this.steps}, null, 4);
    }

    result() {
        return JSON.stringify(this.resultObj(), null, 4);
    }

    resultObj() {
        return this.steps[this.steps.length-1];
    }

}

class Algorithm {

    static clasterize(items, limit) {
        const clasters = new Set();
        const statistic = new Statistic();

        items.forEach(function (item) {
            const claster = new Claster();
            claster.addItem(item);
            clasters.add(claster);
        });

        while (clasters.size > limit && clasters.size > 1) {
            const nearest = Algorithm.nearestClasters(clasters);
            statistic.addStep(clasters, nearest);
            clasters.delete(nearest.c1);
            clasters.delete(nearest.c2);
            clasters.add(Claster.union(nearest.c1, nearest.c2));
        }
        statistic.addStep(clasters);

        return {
            statistic: statistic,
            clasters: clasters
        };
    }

    static nearestClasters(clasters) {

        let minDistance = Infinity;
        let tmpDistance = 0;
        let claster1, claster2;

        clasters.forEach(function (c1) {
            clasters.forEach(function (c2) {
                if (c1 !== c2) {
                    tmpDistance = c1.distanceToClaster(c2);
                    if (tmpDistance < minDistance) {
                        minDistance = tmpDistance;
                        claster1 = c1;
                        claster2 = c2;
                    }
                }
            });
        });


        return {c1: claster1, c2: claster2, distance: minDistance};

    }
}

class Claster {
    constructor() {
        this.items = new Set();
        this.addItem = this.addItem.bind(this);
        this.addItems = this.addItems.bind(this);
        this.distanceToClaster = this.distanceToClaster.bind(this);
    }

    addItems(items) {
        items.forEach((item) => {
            this.addItem(item);
        }, this);
    }

    addItem(item) {
        if (!(item instanceof Item)) throw new TypeError("item have to be instance of Item");

        this.items.add(item);
    }

    innerDistance() {
        let distance = -Infinity;

        this.items.forEach(function (myItem, i, items) {
            items.forEach(function (otherItem, j) {
                distance = Math.max(distance, myItem.distanceToItem(otherItem));
            });
        });

        return distance;
    }

    distanceToClaster(claster) {
        let distance = -Infinity;

        this.items.forEach(function (myItem) {
            claster.items.forEach(function (otherItem) {
                distance = Math.max(distance, myItem.distanceToItem(otherItem));
            });
        });

        return distance;
    }

    static union(c1, c2) {
        const result = new Claster();
        result.addItems(c1.items);
        result.addItems(c2.items);
        return result;
    }
}

class Item {
    constructor(values, mark = "") {
        this.values = values || [];
        this.mark = mark;
        this.distanceToItem = this.distanceToItem.bind(this);
    }

    distanceToItem(item) {
        const minCount = Math.min(this.values.length, item.values.length);
        const maxCount = Math.max(this.values.length, item.values.length);
        let distance = maxCount - minCount;
        for (let i = 0; i < minCount; i++) {
            distance += (this.values[i] != item.values[i]) ? 1 : 0;
        }
        return distance;
    }

}


module.exports = {Claster, Item, Algorithm, Statistic};