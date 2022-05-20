import { CategoriesRepository } from './categories.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConstraintError,
  EntryExistenceError,
  ForeignKeyExistenceError,
  UniquenessError,
} from '../etc/repositoryErrors';
import { StorageProvider } from '../storage/storage.provider';

describe('CategoriesRepository', () => {
  let repository: CategoriesRepository;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [CategoriesRepository, StorageProvider],
    }).compile();

    repository = moduleRef.get<CategoriesRepository>(CategoriesRepository);
  });

  const dtos = {
    PARENT_CATEGORY: {
      categoryName: 'parent',
      parentCategoryName: null,
    },
    CHILD_CATEGORY: {
      categoryName: 'child',
      parentCategoryName: 'parent',
    },
    STUB_CATEGORY_1: {
      categoryName: 'stub 1',
      parentCategoryName: null,
    },
    STUB_CATEGORY_2: {
      categoryName: 'stub 2',
      parentCategoryName: null,
    },
    NON_EXISTENT_CATEGORY: {
      categoryName: 'non existent',
      parentCategoryName: null,
    },
    SELF_REFERENCED_CATEGORY: {
      categoryName: 'self',
      parentCategoryName: 'self',
    },
  };

  describe('CategoriesRepository.save()', () => {
    it('saves the provided category and returns it', async () => {
      expect(repository.storage.categoriesList).toHaveLength(0);
      const savedCategory = await repository.save(dtos.PARENT_CATEGORY);
      expect(savedCategory).toEqual(dtos.PARENT_CATEGORY);
      expect(repository.storage.categoriesList).toHaveLength(1);
    });

    it('allows to save parent & child categories in series', async () => {
      const savedParentCategory = await repository.save(dtos.PARENT_CATEGORY);
      const savedChildCategory = await repository.save(dtos.CHILD_CATEGORY);

      expect(savedParentCategory).toEqual(dtos.PARENT_CATEGORY);
      expect(savedChildCategory).toEqual(dtos.CHILD_CATEGORY);
    });

    it('throws an error if .categoryName of non-existent category is provided as .parentCategoryName', async () => {
      await expect(() =>
        repository.save(dtos.CHILD_CATEGORY),
      ).rejects.toThrowError(ForeignKeyExistenceError);
    });

    it('throws an error if existent .categoryName has been provided', async () => {
      await repository.save(dtos.PARENT_CATEGORY);

      await expect(() =>
        repository.save(dtos.PARENT_CATEGORY),
      ).rejects.toThrowError(UniquenessError);
    });

    it('throws an error if the category references itself', async () => {
      await expect(() =>
        repository.save(dtos.SELF_REFERENCED_CATEGORY),
      ).rejects.toThrowError(ConstraintError);
    });
  });

  describe('CategoriesRepository.update()', () => {
    it('updates the provided category and returns it', async () => {
      await repository.save(dtos.STUB_CATEGORY_1);
      const updatedCategory = await repository.update(
        dtos.STUB_CATEGORY_1.categoryName,
        dtos.STUB_CATEGORY_2,
      );
      expect(updatedCategory).toEqual(dtos.STUB_CATEGORY_2);
    });

    it('throws an error if not existent .categoryName has been provided', async () => {
      await expect(() =>
        repository.update(
          dtos.STUB_CATEGORY_1.categoryName,
          dtos.STUB_CATEGORY_1,
        ),
      ).rejects.toThrowError(EntryExistenceError);
    });

    it('throws an error if existent .categoryName has been provided as new .categoryName', async () => {
      await repository.save(dtos.STUB_CATEGORY_1);
      await repository.save(dtos.STUB_CATEGORY_2);

      await expect(() =>
        repository.update(
          dtos.STUB_CATEGORY_1.categoryName,
          dtos.STUB_CATEGORY_2,
        ),
      ).rejects.toThrowError(UniquenessError);
    });

    it('throws an error if .categoryName of non-existent category is provided as .parentCategoryName', async () => {
      await repository.save(dtos.STUB_CATEGORY_1);

      await expect(() =>
        repository.update(
          dtos.STUB_CATEGORY_1.categoryName,
          dtos.CHILD_CATEGORY,
        ),
      ).rejects.toThrowError(ForeignKeyExistenceError);
    });

    it('throws an error if new category state references itself as parent category', async () => {
      await repository.save(dtos.STUB_CATEGORY_1),
        await expect(() =>
          repository.update(
            dtos.STUB_CATEGORY_1.categoryName,
            dtos.SELF_REFERENCED_CATEGORY,
          ),
        ).rejects.toThrowError(ConstraintError);
    });
  });

  describe('CategoriesRepository.delete()', () => {
    it('removes the existent category by its .categoryName and returns it', async () => {
      await repository.save(dtos.STUB_CATEGORY_1);
      expect(repository.storage.categoriesList).toContainEqual(
        dtos.STUB_CATEGORY_1,
      );
      expect(repository.storage.categoriesList).toHaveLength(1);
      expect(
        await repository.remove(dtos.STUB_CATEGORY_1.categoryName),
      ).toEqual(dtos.STUB_CATEGORY_1);
      expect(repository.storage.categoriesList).toHaveLength(0);
    });

    it('throws an error if not existent .categoryName has been provided', async () => {
      await expect(() =>
        repository.remove(dtos.STUB_CATEGORY_1.categoryName),
      ).rejects.toThrowError(EntryExistenceError);
    });
  });

  describe('CategoriesRepository.find()', () => {
    it('returns an empty array when repository is empty', async () => {
      expect(await repository.find({})).toHaveLength(0);
    });

    it('returns the array of all categories if no filters provided', async () => {
      await repository.save(dtos.PARENT_CATEGORY);
      await repository.save(dtos.CHILD_CATEGORY);
      expect(await repository.find({})).toHaveLength(2);
      expect(await repository.find({})).toContainEqual(dtos.PARENT_CATEGORY);
      expect(await repository.find({})).toContainEqual(dtos.CHILD_CATEGORY);
    });

    it('allows to filter the categories list by equality', async () => {
      await repository.save(dtos.PARENT_CATEGORY);
      await repository.save(dtos.CHILD_CATEGORY);
      expect(
        await repository.find({
          categoryName: dtos.PARENT_CATEGORY.categoryName,
        }),
      ).toHaveLength(1);

      expect(
        await repository.find({
          categoryName: dtos.PARENT_CATEGORY.categoryName,
        }),
      ).toContainEqual(dtos.PARENT_CATEGORY);

      expect(
        await repository.find({
          parentCategoryName: dtos.CHILD_CATEGORY.parentCategoryName,
        }),
      ).toHaveLength(1);
      expect(
        await repository.find({
          parentCategoryName: dtos.CHILD_CATEGORY.parentCategoryName,
        }),
      ).toContainEqual(dtos.CHILD_CATEGORY);
    });
  });
});
