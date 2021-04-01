import { NextFunction, Request, Response, Router } from "express";
import { checkTokenApp } from "$middlewares/app";
import log from "$helpers/log";
import { done, HttpErrorController } from "./response";
import { Permissions } from "$enums";

/**
 * Decorator route for express
 */

export const RootRoute = Router();

enum RequestMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  OPTIONS = "options",
  HEAD = "head",
}

interface RouteInterface {
  path: string;
  method: RequestMethod;
  middlewares: Function[];
  propertyKey: string;
}

/**
 * Descriptions
 */
interface PermissionsInterface {
  propertyKey: string;
  permissions: Permissions[];
}

interface MiddlewareCallback {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const APP = (
  routePrefix: string,
  version: string = ""
): ClassDecorator => {
  return (targetClass: any) => {
    handleClassDecorator(targetClass, routePrefix, version, checkTokenApp);
  };
};

export const Method = (
  path: string,
  middlewares: Function[],
  method: RequestMethod
): MethodDecorator => {
  return (
    target: ClassDecorator,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    if (!Reflect.hasOwnMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes: RouteInterface[] = Reflect.getMetadata(
      "routes",
      target.constructor
    );
    routes.push({
      path,
      method,
      middlewares,
      propertyKey,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Get = (
  path: string,
  middlewares?: Function[]
): MethodDecorator => {
  return Method(path, middlewares, RequestMethod.GET);
};

export const Post = (
  path: string,
  middlewares?: Function[]
): MethodDecorator => {
  return Method(path, middlewares, RequestMethod.POST);
};

export const Put = (
  path: string,
  middlewares?: Function[]
): MethodDecorator => {
  return Method(path, middlewares, RequestMethod.PUT);
};

export const Delete = (
  path: string,
  middlewares?: Function[]
): MethodDecorator => {
  return Method(path, middlewares, RequestMethod.DELETE);
};

export const Options = (
  path: string,
  middlewares?: Function[]
): MethodDecorator => {
  return Method(path, middlewares, RequestMethod.OPTIONS);
};

export const Head = (
  path: string,
  middlewares?: Function[]
): MethodDecorator => {
  return Method(path, middlewares, RequestMethod.HEAD);
};

function catchError(callback: MiddlewareCallback, className: String) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await callback(req, res, next);
      return done(res, result);
    } catch (error) {
      const logger = log(className);
      next(new HttpErrorController(error, logger));
    }
  };
}

function handleClassDecorator(
  targetClass: any,
  routePrefix: string,
  version: string,
  defaultMiddleware: Function
) {
  if (!Reflect.hasOwnMetadata("routes", targetClass)) {
    Reflect.defineMetadata("routes", [], targetClass);
  }

  const rootPath = version + routePrefix;
  const instance = new targetClass();

  const routes = Reflect.getMetadata("routes", targetClass) as RouteInterface[];

  routes.forEach((route: RouteInterface) => {
    route.middlewares = route.middlewares
      ? route.middlewares
      : [defaultMiddleware];

    (RootRoute as any)[route.method](
      rootPath + route.path,
      route.middlewares,
      catchError(instance[route.propertyKey], targetClass.name)
    );
  });
}
