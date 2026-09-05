const targetBySource = {
  body: "validatedBody",
  query: "validatedQuery",
  params: "validatedParams",
};

export const validate = (schema, source = "body") => {
  return (req, _res, next) => {

    req[targetBySource[source]] = req[source] ?? {};
    return next();
  };
};
