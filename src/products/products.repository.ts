import { Injectable } from '@nestjs/common';
import {
  ConstraintError,
  EntryExistenceError,
  ForeignKeyExistenceError,
} from '../etc/repositoryErrors';
import {
  ALLOWED_PRODUCT_STATUS_UPDATES,
  ProductDto,
  ProductStatuses,
} from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageProvider } from '../storage/storage.provider';

@Injectable()
export class ProductsRepository {
  // storage not marked private for testing purposes only
  constructor(readonly storage: StorageProvider) {}

  disableForeignKeysExistenceChecks = false;

  async save(createProductDto: CreateProductDto): Promise<ProductDto> {
    /** unique product id generation **/
    let productId;
    do {
      productId = String(Date.now());
    } while (this.storage.products.has(productId));

    if (
      !this.disableForeignKeysExistenceChecks &&
      !this.storage.categoriesList.some(
        (c) => c.categoryName === createProductDto.categoryName,
      )
    ) {
      throw new ForeignKeyExistenceError(`categoryName`);
    }

    this.storage.products.set(productId, {
      ...createProductDto,
      status: ProductStatuses.DRAFT,
      productId,
    });

    return this.storage.products.get(productId);
  }

  async update(
    productId: ProductDto['productId'],
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const { status: newProductStatus } = updateProductDto;

    const product = this.storage.products.get(productId);

    if (!product) {
      throw new EntryExistenceError('productId');
    }

    const { status: currentProductStatus } = product;

    if (
      !ALLOWED_PRODUCT_STATUS_UPDATES[currentProductStatus].includes(
        newProductStatus,
      )
    ) {
      throw new ConstraintError(`status`);
    }

    this.storage.products.set(productId, {
      ...product,
      status: newProductStatus,
    });

    return this.storage.products.get(productId);
  }

  async find(
    equalityFilterExpression: Partial<ProductDto>,
  ): Promise<ProductDto[]> {
    const filteringConditions = Object.entries(equalityFilterExpression);
    return this.storage.productsList.filter((category) => {
      for (const [field, requiredValue] of filteringConditions) {
        if (category[field] !== requiredValue) {
          return false;
        }
      }
      return true;
    });
  }
}
