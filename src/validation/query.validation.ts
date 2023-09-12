class QueryValidationResult {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
  banStatus: banStatusEnum;
  publishedStatus: publishedStatusEnum;
  bodySearchTerm: string;
}

const defaultPageSize = 10;
const defaultPageNumber = 1;

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export enum SortOrmDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export enum banStatusEnum {
  all = 'NOT NULL',
  banned = 'true',
  notBanned = 'false',
}

export enum publishedStatusEnum {
  all = 'NOT NULL',
  published = 'true',
  notPublished = 'false',
}

export const pagination = (query: any): QueryValidationResult => {
  let pageNumber = query.pageNumber;
  const parsedPageNumber = parseInt(pageNumber, 10);
  if (!pageNumber || !parsedPageNumber || parsedPageNumber <= 0)
    pageNumber = defaultPageNumber;
  pageNumber = parseInt(pageNumber, 10);

  let pageSize = query.pageSize;
  const parsedPageSize = parseInt(pageSize, 10);
  if (!pageSize || !parsedPageSize || parsedPageSize <= 0)
    pageSize = defaultPageSize;
  pageSize = parseInt(pageSize, 10);

  let banStatus = query.banStatus;
  if (banStatus == 'notBanned') {
    banStatus = banStatusEnum.notBanned;
  } else if (banStatus == 'banned') {
    banStatus = banStatusEnum.banned;
  } else {
    banStatus = banStatusEnum.all;
  }
  const sortBy = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt';
  const sortDirection =
    typeof query.sortDirection === 'string' ? query.sortDirection : 'desc';
  const searchNameTerm =
    typeof query.searchNameTerm === 'string'
      ? query.searchNameTerm?.toString()
      : '';
  const searchLoginTerm =
    typeof query.searchLoginTerm === 'string'
      ? query.searchLoginTerm?.toString()
      : '';
  const searchEmailTerm =
    typeof query.searchEmailTerm === 'string'
      ? query.searchEmailTerm?.toString()
      : '';

  const publishedStatus = query.banStatus;
  if (banStatus == 'notPublished') {
    banStatus = publishedStatusEnum.notPublished;
  } else if (banStatus == 'published') {
    banStatus = publishedStatusEnum.published;
  } else {
    banStatus = publishedStatusEnum.all;
  }
  const bodySearchTerm =
    typeof query.bodySearchTerm === 'string'
      ? query.bodySearchTerm?.toString()
      : '';

  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
    searchLoginTerm,
    searchEmailTerm,
    banStatus,
    publishedStatus,
    bodySearchTerm,
  };
};
