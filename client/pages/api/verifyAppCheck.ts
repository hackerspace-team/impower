import { VercelRequest, VercelResponse } from "@vercel/node";
import { initAdminApp } from "../../lib/initAdminApp";

export const verifyAppCheck = async (
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> => {
  const { body, method } = req;

  // Extract the token and captcha code from the request body
  const { token } = body;

  if (method === "POST") {
    // If token is missing return an error
    if (!token) {
      const message = "please provide token";
      console.error(message);
      return res.status(422).json({
        message,
      });
    }

    let uid: string;

    try {
      const adminApp = await initAdminApp();
      const decodedToken = await adminApp.auth().verifyIdToken(token, true);
      uid = decodedToken?.uid;

      const userRecord = await adminApp.auth().getUser(uid);
      const auth_time =
        new Date(userRecord.metadata.lastSignInTime).getTime() / 1000;
      const customClaims = userRecord?.customClaims;
      const captcha_time = customClaims?.captcha_time;
      const isCaptchaStillValid =
        auth_time && captcha_time && auth_time <= captcha_time;

      if (!isCaptchaStillValid) {
        const message = "captcha no longer valid";
        console.error(message);
        return res.status(403).json({ message });
      }

      // User has already solved a captcha puzzle since their last login on this device.
      // Mint a new app check token
      const tokenResult = await adminApp
        .appCheck()
        .createToken(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
      if (!tokenResult) {
        return undefined;
      }
      const expireTimeSeconds = Math.trunc(Date.now() / 1000) + 60 * 60 * 24; // App Check tokens should expire after 1 day
      const appCheckToken = {
        token: tokenResult.token,
        expireTimeMillis: expireTimeSeconds * 1000,
      };
      if (!appCheckToken) {
        const message = "app check token generation failed";
        console.error(message);
        return res.status(403).json({ message });
      }

      return res.status(200).json(appCheckToken);
    } catch (error) {
      console.error(error);
      const message = JSON.stringify(error);
      return res.status(403).json({ message });
    }
  }
  const message = `${method} not found`;
  console.error(message);
  // Return 404 if someone pings the API with a method other than POST
  return res.status(404).json({ message });
};

export default verifyAppCheck;
