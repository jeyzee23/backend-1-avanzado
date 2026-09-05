export const SORT_FIELDS = ["price", "duration", "name"];
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const applySortCompatibility = (query = {}) => {
  const next = { ...query };

  if (next.sort && !next.sortBy) {
    next.sortBy = "price";
    next.order = next.sort;
  }

  return next;
};

export const buildServiceFilter = ({ category, available } = {}) => {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (available !== undefined) {
    filter.available = available;
  }

  return filter;
};

export const buildSort = ({ sortBy = "price", order = "asc" } = {}) => {
  const field = SORT_FIELDS.includes(sortBy) ? sortBy : "price";
  const direction = order === "desc" ? -1 : 1;
  return { [field]: direction };
};

export const buildPagination = ({ page = 1, limit = DEFAULT_LIMIT } = {}) => ({
  page,
  limit,
  skip: (page - 1) * limit,
});

export const buildPageLinks = ({ path, query = {}, page, limit, prevPage, nextPage }) => {
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
  const totalPages = totalDocs === 0 ? 0 : Math.ceil(totalDocs / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = totalPages > 0 && page < totalPages;
  const prevPage = hasPrevPage ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;
  const links = buildPageLinks({ path, query, page, limit, prevPage, nextPage });

  return {
    totalDocs,
    page,
    limit,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    prevLink: links.prevLink,
    nextLink: links.nextLink,
  };
};
