import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./product.model";
import { InjectModel } from "@nestjs/mongoose";
import {v4} from "uuid";
import { Model } from "mongoose";


Injectable()
export class ProductService{
   private products: Product[] = [];

   constructor(@InjectModel('Product') private readonly productModel: Model<Product>){

   }
   async insertProduct(title: string, desc: string, price: number){
       // const prodId = v4();
        const newProduct = new this.productModel({
            title, 
            description: desc, 
            price,
        });
      const result =  await newProduct.save();
      console.log(result);
      return result.id as string;
    }
    async getProducts(){
        const products = await this.productModel.find().exec();
        return products as Product[];
    }
    async getSingleProduct(productId: string){
        const product = await this.findProduct(productId);
        return {id: product.id, title: product.title, description: product.description, price: product.price};
    }
    async updateProduct(productId: string, title: string, desc: string, price: number){

        const updatedproduct =  await this.findProduct(productId);
        if(title){
            updatedproduct.title = title;
        }
        if(desc){
            updatedproduct.description=desc;
        }
        if(price){
            updatedproduct.price=price;
        }
        updatedproduct.save();
    }

    async deleteProduct(productId: string){
        const result = await this.productModel.deleteOne({_id: productId}).exec();
        if(result.deletedCount === 0){
            throw new NotFoundException("Could not find product.");
        }
    }

    private async findProduct(id: string): Promise<Product>{
        let product;
        try{
            product = await this.productModel.findById(id).exec();
        }catch(error){
            throw new NotFoundException("Could not find product.");
        }
        
        if(!product){
            throw new NotFoundException("Could not find product.");
        }
        return product;
    }
   

}