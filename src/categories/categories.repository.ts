import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ConstraintError,
  EntryExistenceError,
  ForeignKeyExistenceError,
  UniquenessError,
} from '../etc/repositoryErrors';
import { StorageProvider } from '../storage/storage.provider';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  // storage not marked private for testing purposes only
  constructor(
    @Inject(forwardRef(() => StorageProvider))
    readonly storage: StorageProvider,
  ) {}

  async save(category: CreateCategoryDto): Promise<CategoryDto> {
    const { categoryName, parentCategoryName } = category;

    if (categoryName === parentCategoryName) {
      throw new ConstraintError(['categoryName', 'parentCategoryName']);
    }

    if (this.storage.categories.has(categoryName)) {
      throw new UniquenessError('categoryName');
    }

    if (parentCategoryName) {
      if (!this.storage.categories.has(parentCategoryName)) {
        throw new ForeignKeyExistenceError('parentCategoryName');
      }
    }

    this.storage.categories.set(categoryName, {
      ...category,
      parentCategoryName: category.parentCategoryName || null,
    });

    return this.storage.categories.get(categoryName);
  }

  async find(filterExpression: FindCategoryDto): Promise<CategoryDto[]> {
    const filteringConditions = Object.entries(filterExpression);
    return this.storage.categoriesList.filter((category) => {
      for (const [field, requiredValue] of filteringConditions) {
        if (category[field] !== requiredValue) {
          return false;
        }
      }
      return true;
    });
  }

  async update(
    categoryName: CategoryDto['categoryName'],
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const {
      categoryName: newCategoryName,
      parentCategoryName: newParentCategoryName,
    } = updateCategoryDto;

    if (!this.storage.categories.has(categoryName)) {
      throw new EntryExistenceError('categoryName');
    }

    if (newCategoryName === newParentCategoryName) {
      throw new ConstraintError(['categoryName', 'parentCategoryName']);
    }

    if (
      newCategoryName !== categoryName &&
      this.storage.categories.has(newCategoryName)
    ) {
      throw new UniquenessError('newCategoryState.categoryName');
    }

    if (newParentCategoryName) {
      if (!this.storage.categories.has(newParentCategoryName)) {
        throw new ForeignKeyExistenceError('newCategoryState.categoryName');
      }

      if (
        newCategoryName !== categoryName &&
        newParentCategoryName === categoryName
      ) {
        throw new ForeignKeyExistenceError(
          'newCategoryState.parentCategoryName',
        );
      }
    }

    this.storage.categories.set(newCategoryName, updateCategoryDto);

    if (newCategoryName !== categoryName) {
      // IMITATION of ... FOREIGN KEY (categoryName) ON UPDATE CASCADE ...
      this.storage.productsList
        .filter((p) => p.categoryName === categoryName)
        .forEach((product) => {
          this.storage.products.set(product.productId, {
            ...product,
            categoryName: newCategoryName,
          });
        });

      // removing category with old .categoryName
      this.storage.categories.delete(categoryName);
    }

    return updateCategoryDto;
  }

  async remove(
    categoryName: CategoryDto['categoryName'],
  ): Promise<CategoryDto> {
    const category = this.storage.categories.get(categoryName);

    if (!category) {
      throw new EntryExistenceError('categoryName');
    }

    if (
      // IMITATION of ... FOREIGN KEY (categoryName) ON DELETE RESTRICT ...
      this.storage.productsList.some(
        (p) => p.categoryName === category.categoryName,
      )
    ) {
      throw new ConstraintError(['products', 'categoryName']);
    }

    this.storage.categories.delete(categoryName);
    return category;
  }
}
