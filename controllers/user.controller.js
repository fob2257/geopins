const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');

const client = new OAuth2Client({ clientId: process.env.OAUTH_CLIENT_ID });

exports.findOrCreateUser = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    const googleUser = ticket.getPayload();

    let user = await User.findOne({ email: googleUser.email }).exec();

    if (!user) {
      const {
        name,
        given_name: givenName,
        family_name: familyName,
        email,
        picture,
      } = googleUser;

      user = await User.create({
        name,
        givenName,
        familyName,
        email,
        picture,
      });
    }

    return user;
  } catch (error) {
    console.error(error);
  }
};
