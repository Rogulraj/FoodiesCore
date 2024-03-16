import { App } from '@/app';
// import { ValidateEnv } from '@utils/validateEnv';
// ValidateEnv();
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();
