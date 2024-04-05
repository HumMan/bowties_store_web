export * from './image.service';
import { ImageService } from './image.service';
export * from './login.service';
import { LoginService } from './login.service';
export * from './product.service';
import { ProductService } from './product.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [ImageService, LoginService, ProductService, UserService];
