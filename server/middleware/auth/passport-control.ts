import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import { findUserByEmail } from '../../services/user-service'


export interface UserI {
  email: string,
  password: string,
}

passport.use(new Strategy({ usernameField: 'email' },
  async (email, password, done) => {
    if (!email && !password) {
      done(null, false)
      return;
    }

    try {
      const user = await findUserByEmail(email);
      if (user === null) {
        done(null, false);
        return;
      }
      
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        done(null, user)
        return;
      }
    } catch (e) {
      done(e);
    }

    done(null, false)
  }));

  export default passport;