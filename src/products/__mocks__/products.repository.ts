export const ProductsRepository = jest.fn().mockReturnValue({
  save: jest.fn().mockResolvedValue({}),
  find: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockResolvedValue({}),
});
