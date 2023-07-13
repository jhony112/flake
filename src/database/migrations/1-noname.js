'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "FooBar", deps: []
 * addIndex "foo_bar_slug" to table "FooBar"
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2023-06-26T15:52:44.022Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "FooBar",
            {
                "id": {
                    "type": Sequelize.BIGINT,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name",
                    "allowNull": false
                },
                "slug": {
                    "type": Sequelize.STRING,
                    "field": "slug",
                    "unique": true,
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.STRING,
                    "field": "description"
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updated_at": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "FooBar",
            ["slug"],
            {
                "indexName": "foo_bar_slug",
                "name": "foo_bar_slug"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
