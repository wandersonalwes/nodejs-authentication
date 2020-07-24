import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import crypto from 'crypto';
import Mail from '../../lib/Mail';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.checkPassword(password)) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).send({ error: 'User not found' });
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await user.update(
        {
          password_reset_token: token,
          password_reset_expires: now,
        },
        {
          where: { email },
          returning: true,
        }
      );

      Mail.sendMail({
        to: email,
        template: 'auth/forgot_password',
        context: { token },
      })
        .then(() => res.send())
        .catch((error) => res.status(400).json({ error }));
    } catch (error) {
      res.status(400).send({ error: 'Erro on forgot password' });
    }
  }

  async resetPassword(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(400).send({ error: 'User not found' });
      }

      if (token !== user.password_reset_token) {
        return res.status(400).json({ error: 'Token invalid' });
      }

      const now = new Date();

      if (now > user.password_reset_expires) {
        return res
          .status(400)
          .json({ error: 'Token expired, generate a new one' });
      }

      user.password = password;
      await user.save();

      return res.send();
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Cannot reset password, try again' });
    }
  }
}

export default new SessionController();
