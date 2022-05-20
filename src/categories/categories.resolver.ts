import { CategoriesService } from './categories.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryDto } from './dto/category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductDto } from '../products/dto/product.dto';
import { ProductsService } from '../products/products.service';

@Resolver(() => CategoryDto)
export class CategoriesResolver {
  constructor(
    private categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Query(() => [CategoryDto])
  async listCategories(
    @Args('findCategoryDto', { type: () => FindCategoryDto })
    findCategoryDto: FindCategoryDto,
  ): Promise<CategoryDto[]> {
    return this.categoriesService.find(findCategoryDto);
  }

  @Mutation(() => CategoryDto)
  async createCategory(
    @Args('createCategoryDto', { type: () => CreateCategoryDto })
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Mutation(() => CategoryDto)
  async updateCategory(
    @Args('categoryName', { type: () => String })
    categoryName: CategoryDto['categoryName'],
    @Args('updateCategoryDto', { type: () => UpdateCategoryDto })
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoriesService.update(categoryName, updateCategoryDto);
  }

  @Mutation(() => CategoryDto)
  async removeCategory(
    @Args('categoryName', { type: () => String })
    categoryName: CategoryDto['categoryName'],
  ): Promise<CategoryDto> {
    return await this.categoriesService.remove(categoryName);
  }

  @ResolveField(() => [ProductDto])
  async products(
    @Parent() { categoryName }: CategoryDto,
  ): Promise<ProductDto[]> {
    return await this.productsService.find({ categoryName });
  }
}
