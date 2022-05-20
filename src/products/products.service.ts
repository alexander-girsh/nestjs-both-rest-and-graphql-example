import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import {
  ConstraintError,
  EntryExistenceError,
  ForeignKeyExistenceError,
  RepositoryError,
} from '../etc/repositoryErrors';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(forwardRef(() => ProductsRepository))
    private readonly productsRepository: ProductsRepository,
  ) {}
  create(createProductDto: CreateProductDto) {
    return this.productsRepository
      .save(createProductDto)
      .catch((e: RepositoryError) => {
        if (
          e instanceof ForeignKeyExistenceError &&
          e.cause === 'categoryName'
        ) {
          throw new NotFoundException(
            `Category with .categoryName = ${createProductDto.categoryName} does not exist `,
          );
        }
        throw e;
      });
  }
  update(
    productId: ProductDto['productId'],
    updateProductDto: UpdateProductDto,
  ) {
    return this.productsRepository
      .update(productId, updateProductDto)
      .catch((e: RepositoryError) => {
        if (e instanceof EntryExistenceError && e.cause === 'productId') {
          throw new NotFoundException(
            `product with .productId = ${productId} does not exist`,
          );
        } else if (e instanceof ConstraintError && e.cause === 'status') {
          throw new UnprocessableEntityException(
            `Unable to set status "${updateProductDto.status} to product with .productId = ${productId}" `,
          );
        }
        throw e;
      });
  }
  find(filterExpression: Partial<ProductDto>) {
    return this.productsRepository.find(filterExpression);
  }
}
