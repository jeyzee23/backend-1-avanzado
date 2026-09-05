export const SORT_FIELDS = ["price", "duration", "name"];
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const applySortCompatibility = (query = {}) => {
  const next = { ...query };

  return next;
};

export const buildServiceFilter = ({ category, available } = {}) => {
  const filter = {};


  return filter;
};

export const buildSort = ({ sortBy = "price", order = "asc" } = {}) => {
  return { price: 1 };
};

export const buildPagination = ({ page = 1, limit = DEFAULT_LIMIT } = {}) => ({
  page,
  limit,
  skip: (page - 1) * limit,
});

export const buildPageLinks = ({ path, query = {}, limit, prevPage, nextPage }) => {
  const toLink = (targetPage) => {
    if (targetPage == null) return null;

    const params = new URLSearchParams();
    if (query.category) params.set("category", query.category);
    if (query.available !== undefined) params.set("available", String(query.available));
    params.set("page", String(targetPage));
    params.set("limit", String(limit));
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.order) params.set("order", query.order);
    if (query.sort) params.set("sort", query.sort);
    return `${path}?${params.toString()}`;
  };

  return {
    prevLink: toLink(prevPage),
    nextLink: toLink(nextPage),
  };
};

export const buildPageMetadata = ({
  totalDocs,
  page,
  limit,
  query = {},
  path = "/api/services",
}) => {

  return {
    totalDocs,
    page,
    limit,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    prevLink: null,
    nextLink: null,
  };
};
