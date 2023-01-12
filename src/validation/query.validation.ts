class QueryValidationResult {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchNameTerm: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
  banStatus: banStatusEnum;
}

const defaultPageSize = 10;
const defaultPageNumber = 1;

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export enum banStatusEnum {
  all = 'NOT NULL',
  banned = 'true',
  notBanned = 'false',
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
  console.log('query.banStatus', query.banStatus);
  const result = query.banStatus;
  console.log('result', result);
  let banStatus =
    typeof query.banStatus === 'string'
      ? (query.banStatus = 'banned'
          ? banStatusEnum.banned
          : banStatusEnum.notBanned)
      : banStatusEnum.all;
  if (result == 'notBanned') {
    banStatus = banStatusEnum.notBanned;
    console.log('if banStatus', banStatus);
  } else if (result == 'banned') {
    banStatus = banStatusEnum.banned;
    console.log('else if banStatus', banStatus);
  } else {
    banStatus = banStatusEnum.all;
  }
  console.log('banStatus query', banStatus);
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
  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
    searchLoginTerm,
    searchEmailTerm,
    banStatus,
  };
};
