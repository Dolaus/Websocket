import passport from "passport";
import authController from "../authController.js";
import Router from 'express'
const authRoute = new Router();

authRoute.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}))

authRoute.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure'
    }),
    (req, res) => authController.login(req, res)
)

authRoute.get('auth/failure', (req, res) => res.status(500))

export default authRoute