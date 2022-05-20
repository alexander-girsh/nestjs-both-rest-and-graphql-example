import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { CategoryDto } from '../categories/dto/category.dto';

@Resolver(() => ProductDto)
export class ProductsResolver {
  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
  ) {}

  @Query(() => [ProductDto])
  async listProducts(
    @Args('findProductDto', { type: () => FindProductDto })
    findProductDto: FindProductDto,
  ): Promise<ProductDto[]> {
    return this.productsService.find(findProductDto);
  }

  @Mutation(() => ProductDto)
  async createProduct(
    @Args('createProductDto', { type: () => CreateProductDto })
    createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return await this.productsService.create(createProductDto);
  }

  @Mutation(() => ProductDto)
  async updateProduct(
    @Args('productId', { type: () => String })
    productId: ProductDto['productId'],
    @Args('updateProductDto', { type: () => UpdateProductDto })
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return await this.productsService.update(productId, updateProductDto);
  }

  @ResolveField(() => CategoryDto)
  async category(@Parent() { categoryName }: ProductDto): Promise<CategoryDto> {
    return await this.categoriesService
      .find({ categoryName })
      .then((r) => r[0]);
  }
}
