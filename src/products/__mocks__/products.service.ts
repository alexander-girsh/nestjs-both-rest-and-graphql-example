export const ProductsService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  update: jest.fn().mockReturnValue({}),
});
