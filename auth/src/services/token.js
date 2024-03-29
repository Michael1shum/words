const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const bcrypt = require('bcrypt');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return tokenData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return tokenData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });

    return token;
  }

  async removeToken(refreshToken) {
    await tokenModel.deleteOne({ refreshToken });
  }

  async findToken(refreshToken) {
    const token = await tokenModel.findOne({ refreshToken });
    return token;
  }

  async setTokensInCookies(userData, res) {
    const hashedRole = await bcrypt.hash(userData?.user?.role, 3);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
    res.cookie('role', hashedRole, { maxAge: 15 * 60 * 1000, httpOnly: true });
  }
}

module.exports = new TokenService();
