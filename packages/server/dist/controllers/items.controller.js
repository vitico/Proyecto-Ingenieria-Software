"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsController = void 0;
const item_model_1 = require("../models/item.model");
const express_1 = require("express");
class ItemsController {
    constructor() {
        this.router = express_1.Router();
        this.initRoutes();
    }
    get(req, res, next) {
        item_model_1.Item.findById(req.params.id)
            .then(resolve => {
            res.status(200).json(resolve);
        })
            .catch(err => {
            console.error(err);
        });
    }
    getAll(req, res, next) {
        item_model_1.Item.find({})
            .then(resolve => {
            res.status(200).json(resolve);
        })
            .catch(err => {
            console.error(err);
        });
    }
    post(req, res, next) {
        let item = new item_model_1.Item(req.body);
        item.save()
            .then(resolve => {
            res.status(200).json(resolve);
        })
            .catch(err => {
            res.status(500).json(err);
        });
    }
    initRoutes() {
        this.router
            .get('/', this.getAll.bind(this))
            .get('/:id', this.get.bind(this))
            .post('/', this.post.bind(this));
    }
}
exports.ItemsController = ItemsController;
//# sourceMappingURL=items.controller.js.map