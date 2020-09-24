import { Router, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import passport from 'passport';
import bcrypt from 'bcrypt';
import config from '../config/config';
import { verifyJwt, refreshJwt, LoggedInUser } from '../middleware/auth/jwt-middleware';

import { createUser, UserRequest } from '../services/user-service';

const configureRouter = (router: Router) => {

  router.post('/signup', async (req: Request, res: Response) => {  
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ error: 'Must include email and password in signup request'});
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    var userRequest: UserRequest = { email, password: hashedPassword }
  
    const user = await createUser(userRequest);
    if (!user) {
      return res.status(500).json({ error: 'Unable to create user'});
    }

    const liu: LoggedInUser = { email: user.email, userId: user.id };
    const accessToken = jwt.sign(liu, config.jwt_secret, { expiresIn: '7s' })
    const refreshToken = jwt.sign(liu, config.jwt_refresh_secret, { expiresIn: '30d' })

    return res.json({ accessToken, refreshToken })
  })
  
  router.post('/login', passport.authenticate('local', {
    session: false
  }), async (req: Request, res: Response) => {
    const { user } = req;
  
    if (user === undefined) {
      return res.status(400).json({ error: 'No credentials supplied in login request'});
    }
  
    const liu: LoggedInUser = { email: user.email, userId: user.id };
    const accessToken = jwt.sign(liu, config.jwt_secret, { expiresIn: '7s' })
    const refreshToken = jwt.sign(liu, config.jwt_refresh_secret, { expiresIn: '30d' })

    return res.json({ accessToken, refreshToken })
  })

  router.post('/verify', verifyJwt, async (req: Request, res: Response) => {
    console.log('verified: ', req.user);
    return res.status(200).json({ valid: true });
  })

  router.post('/refresh', refreshJwt, async (req: Request, res: Response) => {
    const { user } = req;
    if (user === undefined) {
      return res.status(500).json({ error: 'Missing user.'});
    }

    const liu: LoggedInUser = { email: user.email, userId: user.id };
    const accessToken = jwt.sign(liu, config.jwt_secret, { expiresIn: '1d' })

    return res.json({ accessToken });
  })

  return router;
}

export default configureRouter