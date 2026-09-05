import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applySortCompatibility,
  buildPageMetadata,
  buildPagination,
  buildServiceFilter,
  buildSort,
} from "../src/utils/service-query.js";

test("buildServiceFilter no mete available si no vino", () => {
  assert.deepEqual(buildServiceFilter({}), {});
  assert.deepEqual(buildServiceFilter({ category: "salud" }), { category: "salud" });
});

test("buildServiceFilter respeta available=false", () => {
  assert.deepEqual(buildServiceFilter({ available: false }), { available: false });
  assert.deepEqual(buildServiceFilter({ category: "estetica", available: false }), {
    category: "estetica",
    available: false,
  });
});

test("buildSort usa sortBy/order y cae a price asc", () => {
  assert.deepEqual(buildSort({ sortBy: "duration", order: "desc" }), { duration: -1 });
  assert.deepEqual(buildSort({}), { price: 1 });
});

test("sort de compatibilidad se traduce a price", () => {
  const compatible = applySortCompatibility({ sort: "desc" });
  assert.equal(compatible.sortBy, "price");
  assert.equal(compatible.order, "desc");
  assert.deepEqual(buildSort(compatible), { price: -1 });
});

test("skip = (page - 1) * limit", () => {
  assert.deepEqual(buildPagination({ page: 3, limit: 20 }), {
    page: 3,
    limit: 20,
    skip: 40,
  });
});

test("metadata usa el total filtrado, no el total de la colección", () => {
  const meta = buildPageMetadata({
    totalDocs: 7,
    page: 2,
    limit: 3,
    query: { category: "salud", available: true, sortBy: "price", order: "asc" },
  });

  assert.equal(meta.totalDocs, 7);
  assert.equal(meta.totalPages, 3);
  assert.equal(meta.hasPrevPage, true);
  assert.equal(meta.hasNextPage, true);
  assert.equal(meta.prevPage, 1);
  assert.equal(meta.nextPage, 3);
  assert.equal(meta.prevLink.includes("category=salud"), true);
  assert.equal(meta.prevLink.includes("available=true"), true);
  assert.equal(meta.nextLink.includes("page=3"), true);
});

test("sin resultados la metadata no inventa páginas", () => {
  const meta = buildPageMetadata({ totalDocs: 0, page: 1, limit: 10, query: {} });
  assert.equal(meta.totalPages, 0);
  assert.equal(meta.hasNextPage, false);
  assert.equal(meta.nextLink, null);
});
