const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const bcrypt = require('bcrypt');

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(
      payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'}
    );
    const refreshToken = jwt.sign(
      payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'}
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const data = await tokenModel.findOne({user: tokenData.id});
      if (data.accessToken === token) {
        return tokenData;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const data = await tokenModel.findOne({user: tokenData.id});
      if (data.refreshToken === token) {
        return tokenData;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async saveTokens(userId, refreshToken, accessToken) {
    const tokenData = await tokenModel.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      tokenData.accessToken = accessToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({user: userId, refreshToken, accessToken});

    return token;
  }

  async removeTokens(refreshToken, accessToken) {
    await tokenModel.deleteOne({refreshToken});
    await tokenModel.deleteOne({accessToken});
  }

  async findToken(refreshToken) {
    const token = await tokenModel.findOne({refreshToken});
    return token;
  }

  async setTokensInCookies(userData, res) {
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('accessToken', userData.accessToken, {maxAge: 15 * 60 * 1000, httpOnly: true});
    res.cookie('role', userData?.user?.role ?? 'user', {maxAge: 15 * 60 * 1000});
  }
}

module.exports = new TokenService();
