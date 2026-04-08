import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CloudinaryService } from '@/store/cloudinary/cloudinary.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all_products')
  findAll() {
    return this.productService.findAll();
  }

  @Post('seed')
  @ApiOperation({
    summary:
      'Seed 20 sample products (5 rackets, 5 shoes, 5 shuttles, 5 apparel) with placeholder images',
  })
  @ApiQuery({
    name: 'force',
    required: false,
    description:
      'If true, inserts samples even when products already exist (may duplicate names)',
  })
  @ApiResponse({
    status: 201,
    description:
      'Up to 20 sample rows inserted, or skipped if DB is non-empty (unless force=true)',
  })
  seedSamples(@Query('force') force?: string) {
    const allow = force === 'true' || force === '1';
    return this.productService.seedSampleProducts(allow);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Return a single product' })
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product with images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @UseInterceptors(FilesInterceptor('images')) // Expects form data key "images"
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() productData: CreateProductDto,
  ) {
    const imageURLs = await this.cloudinaryService.uploadImages(files);
    const joinedURLs = imageURLs.join(',');
    return this.productService.create(joinedURLs, productData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (can update images too)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() productData: UpdateProductDto,
  ) {
    let joinedURLs: string | null = null;
    // Check if new files were uploaded
    if (files && files.length > 0) {
      const imageURLs = await this.cloudinaryService.uploadImages(files);
      joinedURLs = imageURLs.join(',');
    }
    return this.productService.update(id, joinedURLs, productData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
