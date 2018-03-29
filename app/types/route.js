// @flow
export type RouteType = {
  collapse: boolean,
  path: string,
  name: string,
  mini: string,
  component: Object,
  icon?: Object,
  views: Array<RouteType>,
  state?: string
};
