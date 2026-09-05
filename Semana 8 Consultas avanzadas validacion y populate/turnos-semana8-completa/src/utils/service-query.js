export const SORT_FIELDS = ["price", "duration", "name"];
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

// Atajo viejo: ?sort=desc significa "ordená por price".
// Si ya viene sortBy, no lo pisamos.
export const applySortCompatibility = (query = {}) => {
  const next = { ...query };

  if (next.sort && !next.sortBy) {
    next.sortBy = "price";
    next.order = next.sort;
  }

  return next;
};

// Arma el objeto que Mongo usa en find(filter).
// {} = sin filtro (trae todo). { category: "salud" } = solo esa categoría.
export const buildServiceFilter = ({ category, available } = {}) => {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  // Tiene que ser !== undefined. Si usás if (available), el false se pierde
  // porque en JS false es falsy y nunca entra al if.
  if (available !== undefined) {
    filter.available = available;
  }

  return filter;
};

// Mongo espera { campo: 1 } o { campo: -1 }, no "asc"/"desc".
export const buildSort = ({ sortBy = "price", order = "asc" } = {}) => {
  const field = SORT_FIELDS.includes(sortBy) ? sortBy : "price";
  const direction = order === "desc" ? -1 : 1;
  return { [field]: direction };
};

// page = qué hoja pide el cliente (1, 2, 3…).
// limit = cuántos docs van en cada hoja.
// skip  = cuántos docs hay que SALTEAR para llegar a esa hoja.
//
// Los paréntesis importan: (page - 1) * limit
//   1 - 1 * 5  →  1 - 5  →  -4   (mal: * se resuelve antes)
//   (1 - 1) * 5 →  0 * 5  →   0   (bien)
//
// ¿Por qué 0 en la página 1? Porque no hay que saltear nada:
//   página 1, limit 5 → skip 0  → docs 0,1,2,3,4
//   página 2, limit 5 → skip 5  → docs 5,6,7,8,9
//   página 3, limit 5 → skip 10 → docs 10,11,12...
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

// Números y links que viajan en el JSON (totalDocs, page, nextLink…).
// totalDocs tiene que ser el count YA FILTRADO, no el de toda la colección.
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
