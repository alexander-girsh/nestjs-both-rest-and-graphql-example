export abstract class RepositoryError extends Error {
  readonly cause: string | string[];
}

export class EntryExistenceError extends RepositoryError {
  constructor(readonly cause: string | [string]) {
    super('EntryExistence error');
  }
}

export class UniquenessError extends RepositoryError {
  constructor(readonly cause: string | [string]) {
    super('Uniqueness error');
  }
}

export class ForeignKeyExistenceError extends RepositoryError {
  constructor(readonly cause: string | string[]) {
    super('ForeignKeyExistence error');
  }
}

export class ConstraintError extends RepositoryError {
  constructor(readonly cause: string | string[]) {
    super('Constraint error');
  }
}
