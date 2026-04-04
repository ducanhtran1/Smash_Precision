/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { SAMPLE_PRODUCTS } from './sample-products.seed';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    return this.productRepository.find();
  }

  async findById(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async findByIds(ids: string[]) {
    if (ids.length === 0) return [];
    return this.productRepository.find({ where: { id: In(ids) } });
  }

  async create(imageURL: string, productData: DeepPartial<Product>) {
    const newProduct = this.productRepository.create({
      ...productData,
      imageUrl: imageURL,
    });
    return this.productRepository.save(newProduct);
  }

  /**
   * Inserts 20 sample products (5 rackets, 5 shoes, 5 shuttles, 5 apparel) via the same
   * create path as multipart uploads. Skips if the DB already has rows unless force=true.
   */
  async seedSampleProducts(force: boolean) {
    const existingCount = await this.productRepository.count();
    if (existingCount > 0 && !force) {
      return {
        skipped: true as const,
        existingCount,
        message:
          'Database already has products. Pass query ?force=true to add samples anyway.',
      };
    }

    const products: Product[] = [];
    for (const row of SAMPLE_PRODUCTS) {
      const { imageUrl, ...rest } = row;
      const p = await this.create(imageUrl, rest);
      products.push(p);
    }
    return {
      skipped: false as const,
      created: products.length,
      products,
    };
  }

  async update(
    id: string,
    imageURL: string | null,
    productData: DeepPartial<Product>,
  ) {
    const product = await this.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    if (productData.name !== undefined) product.name = productData.name;
    if (productData.price !== undefined) product.price = productData.price;
    if (productData.stock !== undefined) product.stock = productData.stock;
    if (imageURL) product.imageUrl = imageURL;

    return this.productRepository.save(product);
  }

  async updateStock(productId: string, quantity: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
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
