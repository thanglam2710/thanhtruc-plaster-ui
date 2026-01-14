export function customBuildRoute(
  routeTemplate: string,
  params: Record<string, string | number>
) {
  let route = routeTemplate;
  for (const key in params) {
    route = route.replace(`:${key}`, String(params[key]));
  }
  return route;
}