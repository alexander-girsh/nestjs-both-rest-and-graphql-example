import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { CategoriesRepository } from './categories.repository';
import {
  ConstraintError,
  EntryExistenceError,
  ForeignKeyExistenceError,
  RepositoryError,
  UniquenessError,
} from '../etc/repositoryErrors';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions/circular-dependency.exception';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoriesRepository
      .save(createCategoryDto)
      .catch((e: RepositoryError) => {
        if (
          e instanceof ForeignKeyExistenceError &&
          e.cause === 'parentCategoryName'
        ) {
          throw new NotFoundException(
            `Parent category with .categoryName = ${createCategoryDto.parentCategoryName} does not exist `,
          );
        } else if (e instanceof UniquenessError && e.cause === 'categoryName') {
          throw new ConflictException(
            `Category with .categoryName = ${createCategoryDto.categoryName} already exist`,
          );
        } else if (
          e instanceof ConstraintError &&
          e.cause.includes('categoryName') &&
          e.cause.includes('parentCategoryName')
        ) {
          throw new CircularDependencyException(
            `Category can not be a parent of itself`,
          );
        }
        throw e;
      });
  }

  async find(findCategoryDto: FindCategoryDto): Promise<CategoryDto[]> {
    return this.categoriesRepository.find(findCategoryDto);
  }

  async update(
    categoryName: CategoryDto['categoryName'],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesRepository
      .update(categoryName, updateCategoryDto)
      .catch((e: RepositoryError) => {
        if (e instanceof EntryExistenceError && e.cause === 'categoryName') {
          throw new NotFoundException(
            `Category with .categoryName = ${updateCategoryDto.parentCategoryName} does not exist `,
          );
        } else if (
          e instanceof ForeignKeyExistenceError &&
          e.cause === 'parentCategoryName'
        ) {
          throw new NotFoundException(
            `Parent category with .categoryName = ${updateCategoryDto.parentCategoryName} does not exist `,
          );
        } else if (e instanceof UniquenessError && e.cause === 'categoryName') {
          throw new ConflictException(
            `Category with .categoryName = ${updateCategoryDto.categoryName} already exist`,
          );
        } else if (
          e instanceof ConstraintError &&
          Array.isArray(e.cause) &&
          e.cause.includes('categoryName') &&
          e.cause.includes('parentCategoryName')
        ) {
          throw new UnprocessableEntityException(
            `Category can not be a parent of itself`,
          );
        }
        throw e;
      });
  }

  async remove(
    categoryName: CategoryDto['categoryName'],
  ): Promise<CategoryDto> {
    return this.categoriesRepository
      .remove(categoryName)
      .catch((e: RepositoryError) => {
        if (e instanceof EntryExistenceError && e.cause === 'categoryName') {
          throw new NotFoundException(
            `Category with .categoryName = ${categoryName} does not exist `,
          );
        }
        throw e;
      });
  }
}
