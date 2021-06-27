"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = exports.ItemClass = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
let ItemClass = class ItemClass {
};
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], ItemClass.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], ItemClass.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ required: true, defaults: false }),
    __metadata("design:type", Boolean)
], ItemClass.prototype, "isActive", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Date)
], ItemClass.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Date)
], ItemClass.prototype, "modifiedAt", void 0);
ItemClass = __decorate([
    type_graphql_1.ObjectType(),
    typegoose_1.pre('save', function () {
        let now = new Date();
        if (!this.createdAt) {
            this.createdAt = now;
        }
        this.modifiedAt = now;
    })
], ItemClass);
exports.ItemClass = ItemClass;
exports.Item = typegoose_1.getModelForClass(ItemClass, {
    options: {
        customName: "Item"
    }
});
//# sourceMappingURL=item.model.js.map