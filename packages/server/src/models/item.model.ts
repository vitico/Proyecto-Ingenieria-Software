import { Schema, Document, Mongoose, Model, model } from "mongoose";
import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import { ObjectType, Field } from "type-graphql";
export interface IItemModel extends Document {
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    modifiedAt: Date;
}

@ObjectType()
@pre<ItemClass>('save', function() {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.modifiedAt = now;
})
export class ItemClass {

    @Field()
    @prop({ required: true })
    name!: string;

    @Field()
    @prop({ required: true })
    description!: string;

    @Field()
    @prop({ required: true, defaults: false })
    isActive!: boolean;

    @Field()
    @prop({ required: true })
    createdAt!: Date
    
    @Field()
    @prop({ required: true })
    modifiedAt!:Date

}


export const Item = getModelForClass(ItemClass, {
    options: {
        customName:"Item"
    }
})