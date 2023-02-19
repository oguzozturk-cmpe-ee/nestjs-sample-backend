import { Controller,Post,Body,Get,Param, Patch } from "@nestjs/common";
import { ProductService } from "./products.service";
import { Delete } from "@nestjs/common/decorators";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductService){}
    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number 
    ) {
        const generatedId = await this.productsService.insertProduct(prodTitle,prodDesc,prodPrice);
        return {id: generatedId}
    }

    @Get()
    async getAllProducts(){
        const products = await this.productsService.getProducts();
        return products.map((prod) => ({id: prod.id, title: prod.title,description: prod.description, price: prod.price}));
    }
    @Get(':id')
    async getProduct(@Param('id') prodId: string){
        return await this.productsService.getSingleProduct(prodId);
    }
    @Patch(':id')
    async updateProduct(@Param('id') prodId: string, 
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number ){
        await this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }
    @Delete(':id')
    async removeProduct(@Param('id') prodId: string){
        await this.productsService.deleteProduct(prodId);
        return null; 
    }

}