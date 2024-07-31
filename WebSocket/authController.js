import User from "./models/User.js";
import jwt from "jsonwebtoken";
import authService from "./services/authService.js";
class AuthController {
    async login(req, res) {
        const tokenJWT = await authService.login(req.user);

        res.redirect(`http://localhost:3001?token=${tokenJWT}`);
    }

    reg(req,res) {
        return res.json("Hello");
    }
}

export default new AuthController();
