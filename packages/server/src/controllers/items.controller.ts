import { Item } from '@/models/item.model';
import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res } from 'routing-controllers';
import Youch from "youch";

@Controller("/items")
export class ItemsController {

    @Get('/:id')
    private get(@Req() req: Request, @Res() res: Response) {

        return Item.findOne(req.params.id)
    }

    @Get('/')
    private getAll(@Req() req: Request, @Res() res: Response) {
        return Item.find()
    }

    @Post('/')
    private post(@Req() req: Request, @Res() res: Response) {
        let item = new Item(req.body);

        return item.save()
    }
}