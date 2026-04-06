import {
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { Product } from './entities/product.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { SAMPLE_PRODUCTS } from './sample-products.seed';

@Injectable()
export class ProductsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly redisService: RedisService,
  ) {}

  async onApplicationBootstrap() {
    const products = await this.productRepository.find();
    for (const p of products) {
      await this.redisService.syncInventory(p.id, p.stock);
    }
  }

  async findAll() {
    const cachedProducts = await this.cacheManager.get<Product[]>('all_products');
    if (cachedProducts) {
      return cachedProducts;
    }
    
    // Explicitly select columns to reduce DB to memory bandwidth overhead
    const products = await this.productRepository.find({
      select: ['id', 'name', 'category', 'price', 'imageUrl', 'description', 'subCategory', 'stock', 'isLimited', 'createdAt', 'updatedAt']
      // Left out `specs` which is a heavy JSON object usually only needed on the Product Detail Page
    });
    
    await this.cacheManager.set('all_products', products, 600000); // Cache for 10 minutes (TTL)
    return products;
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
    const saved = await this.productRepository.save(newProduct);
    await this.redisService.syncInventory(saved.id, saved.stock);
    await this.cacheManager.del('all_products');
    return saved;
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

    const saved = await this.productRepository.save(product);
    await this.redisService.syncInventory(saved.id, saved.stock);
    await this.cacheManager.del('all_products');
    return saved;
  }

  async remove(id: string) {
    const product = await this.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    const removed = await this.productRepository.remove(product);
    await this.cacheManager.del('all_products');
    return removed;
  }
}
