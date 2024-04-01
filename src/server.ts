import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
ValidateEnv();
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { RestaurantRoute } from './routes/resturant.route';
import { PersonalUserDetailRoute } from './routes/personalUserDetails.route';

const app = new App([new AuthRoute(), new UserRoute(), new RestaurantRoute(), new PersonalUserDetailRoute()]);

app.listen();
