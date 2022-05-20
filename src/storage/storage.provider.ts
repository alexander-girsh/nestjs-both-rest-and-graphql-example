import { Injectable } from '@nestjs/common';
import { ProductDto } from '../products/dto/product.dto';
import { CategoryDto } from '../categories/dto/category.dto';

@Injectable()
export class StorageProvider {
  readonly products = new Map<ProductDto['productId'], ProductDto>();
  readonly categories = new Map<CategoryDto['categoryName'], CategoryDto>();

  get productsList(): ProductDto[] {
    return Array.from(this.products.values());
  }

  get categoriesList(): CategoryDto[] {
    return Array.from(this.categories.values());
  }
}
