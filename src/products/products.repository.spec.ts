import { Test, TestingModule } from '@nestjs/testing';
import {
  ConstraintError,
  EntryExistenceError,
  ForeignKeyExistenceError,
} from '../etc/repositoryErrors';
import { StorageProvider } from '../storage/storage.provider';
import { ProductsRepository } from './products.repository';
import {
  ALLOWED_PRODUCT_STATUS_UPDATES,
  ProductStatuses,
} from './dto/product.dto';

const dtos = {
  EXAMPLE_PRODUCT: {
    categoryName: 'books',
    title: 'Some poetry book for sale',
    price: 100,
    imageLinks: ['https://s3.xxx.com/1.png'],
  },
  NON_EXISTENT_PRODUCT_FIND_DTO: {
    productId: '12345',
    title: 'non existent',
  },
};

describe('ProductsRepository', () => {
  let repository: ProductsRepository;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ProductsRepository, StorageProvider],
    }).compile();

    repository = moduleRef.get<ProductsRepository>(ProductsRepository);

    repository.disableForeignKeysExistenceChecks = true;
  });

  describe('ProductsRepository.save()', () => {
    it('saves provided product and returns it', async () => {
      repository.disableForeignKeysExistenceChecks = true;

      const product = await repository.save(dtos.EXAMPLE_PRODUCT);

      for (const key of Object.keys(dtos.EXAMPLE_PRODUCT)) {
        expect(product[key]).toEqual(dtos.EXAMPLE_PRODUCT[key]);
      }

      expect(repository.storage.productsList).toHaveLength(1);
    });

    it(`Sets ${ProductStatuses.DRAFT} status saving new product`, async () => {
      const product = await repository.save(dtos.EXAMPLE_PRODUCT);
      expect(product.status).toEqual(ProductStatuses.DRAFT);
    });

    it('Generates .productId saving new product', async () => {
      const product = await repository.save(dtos.EXAMPLE_PRODUCT);
      expect(product.productId).toBeDefined();
    });

    it('Checks existence of provided .categoryName', async () => {
      repository.disableForeignKeysExistenceChecks = false;
      expect(repository.save(dtos.EXAMPLE_PRODUCT)).rejects.toThrowError(
        ForeignKeyExistenceError,
      );
    });
  });

  describe('ProductRepository.update()', () => {
    it('updates existent product by its .productId', async () => {
      const { productId, status } = await repository.save(dtos.EXAMPLE_PRODUCT);

      expect(status).toEqual(ProductStatuses.DRAFT);

      const { status: newStatus } = await repository.update(productId, {
        status: ProductStatuses.DELETED_DRAFT,
      });

      expect(newStatus).toEqual(ProductStatuses.DELETED_DRAFT);
    });

    it('throws error if product not found', async () => {
      await expect(
        async () =>
          await repository.update(
            dtos.NON_EXISTENT_PRODUCT_FIND_DTO.productId,
            { status: ProductStatuses.AVAILABLE },
          ),
      ).rejects.toThrowError(EntryExistenceError);
    });

    it('does not accept to set not whitelisted statuses', async () => {
      for (const [status, allowedStatuses] of Object.entries(
        ALLOWED_PRODUCT_STATUS_UPDATES,
      )) {
        const notAllowedStatuses = Object.values(ProductStatuses).filter(
          (s) => !allowedStatuses.includes(s),
        );

        for (const allowedStatus of allowedStatuses) {
          const { productId } = await repository.save(dtos.EXAMPLE_PRODUCT);
          // setting product status explicitly with our dirty hands
          repository.storage.products.set(productId, {
            ...repository.storage.products.get(productId),
            status: status as ProductStatuses,
          });

          expect(
            await repository.update(productId, {
              status: allowedStatus as ProductStatuses,
            }),
          ).toHaveProperty('status', allowedStatus);
        }

        for (const notAllowedStatus of notAllowedStatuses) {
          const { productId } = await repository.save(dtos.EXAMPLE_PRODUCT);
          // setting product status explicitly with our dirty hands
          repository.storage.products.set(productId, {
            ...repository.storage.products.get(productId),
            status: status as ProductStatuses,
          });

          await expect(
            async () =>
              await repository.update(productId, {
                status: notAllowedStatus as ProductStatuses,
              }),
          ).rejects.toThrowError(ConstraintError);
        }
      }
    });
  });

  describe('ProductsRepository.find()', () => {
    it('returns array of items', async () => {
      expect(await repository.find({})).toBeInstanceOf(Array);
    });

    it('returns saved items', async () => {
      await repository.save(dtos.EXAMPLE_PRODUCT);
      expect(await repository.find({})).toHaveLength(1);
    });

    it('receives filter expressions', async () => {
      await repository.save(dtos.EXAMPLE_PRODUCT);
      expect(await repository.find(dtos.EXAMPLE_PRODUCT)).toHaveLength(1);
      expect(
        await repository.find(dtos.NON_EXISTENT_PRODUCT_FIND_DTO),
      ).toHaveLength(0);
    });
  });
});
