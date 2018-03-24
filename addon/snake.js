/* eslint-disable no-invalid-this */
'use strict';

var atoms = require('./atoms').atoms;

exports.addon = function (renderer, rules) {
    rules = rules || {};

    var defaultRules = renderer.assign({}, atoms, {
        bgWhite: function () {
            this.backgroundColor = '#fff';
        },

        bgBlack: function () {
            this.backgroundColor = '#000';
        },

        pointer: function () {
            this.cursor = 'pointer';
        },

        inlineBlock: function () {
            this.display = 'inline-block';
        },

        bold: function () {
            this.fontWeight = 'bold';
        },

        em: function () {
            this.fontStyle = 'italic';
        },

        u: function () {
            this.textDecoration = 'underline';
        },
    });

    rules = renderer.assign(defaultRules, rules);

    var snake = {};

    var start = function () {
        var instance = Object.create(snake);

        instance.obj = {};
        instance.toString = function () {
            if (process.env.NODE_ENV !== 'production') {
                require('./__dev__/warnOnMissingDependencies')('snake', renderer, ['cache']);
            }

            return renderer.cache(instance.obj);
        };
        instance.valueOf = instance.toString;

        return instance;
    };

    var checkStart = function (name, fn) {
        return function () {
            if (!this.obj) {
                var instance = start();

                if (typeof instance[name] === 'function') {
                    return instance[name].apply(instance, arguments);
                }

                return instance[name];
            }

            return fn.apply(this, arguments);
        };
    };

    var onRule = function (name) {
        var rule = rules[name];

        if (typeof rule === 'function') {
            if (!rule.length) {
                Object.defineProperty(snake, name, {
                    get: checkStart(name, function () {
                        rule.call(this.obj);
                        return this;
                    })
                });
            } else {
                snake[name] = checkStart(name, function () {
                    rule.apply(this.obj, arguments);
                    return this;
                });
            }
        } else {
            snake[name] = checkStart(name, function (value) {
                this.obj['' + rule] = value;
                return this;
            });
        }
    };

    for (var name in rules) onRule(name);

    renderer.s = snake;
};