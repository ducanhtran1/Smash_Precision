import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async findAll() {
        return this.productRepository.find();
    }

    async findById(id: string) {
        return this.productRepository.findOne({ where: { id } });
    }

    async findByIds(ids: string[]) {
        return this.productRepository.findByIds(ids);
    }

    async create(imageURL: string, productData: any) {
        const newProduct = this.productRepository.create({
            ...productData,
            imageUrl: imageURL,
        });
        return this.productRepository.save(newProduct);
    }

    async update(id: string, imageURL: string | null, productData: any) {
        const product = await this.findById(id);
        if (!product) throw new NotFoundException('Product not found');
        
        if (productData.name) product.name = productData.name;
        if (productData.price) product.price = productData.price;
        if (productData.stock) product.stock = productData.stock;
        if (imageURL) product.imageUrl = imageURL;
        
        return this.productRepository.save(product);
    }

    async updateStock(productId: string, quantity: number) {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new Error('Product not found');
        }
        product.stock -= quantity;
        return this.productRepository.save(product);
    }

    async remove(id: string) {
        const product = await this.findById(id);
        if (!product) throw new NotFoundException('Product not found');
        return this.productRepository.remove(product);
    }
}

