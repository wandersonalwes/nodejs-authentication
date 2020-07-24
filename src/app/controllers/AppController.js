import User from '../models/User';

class AppController {
  async index(req, res) {
    const { name } = await User.findByPk(req.userId);
    return res.json({ name });
  }
}

export default new AppController();
