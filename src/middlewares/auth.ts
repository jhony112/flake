import httpStatus from "http-status";
import ApiError from "../utils/request/ApiError";

// const setCredentials = (req, user, requiredRights) => (resolve, reject) => {
//   req.user = user;
//   return generateUserAuthToken(
//     { id: user.account_id, first_name: 'Developer API' },
//     { [user.account_id]: 'admin' }
//   ).then((token) => {
//     global.token = token;

//     if (requiredRights.length) {
//       const userRights = roleRights.get(user.role);
//       const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
//       if (!hasRequiredRights && req.params.userId !== user.id) {
//         return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
//       }
//     }

//     return resolve();
//   });
// };

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      try {
        // Resolve for Lambda
        // if (req.app.locals.principalId) {
        //   const user = req.app.locals.principalId;
        //   if (!user) {
        //     return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Merchant not authorized'));
        //   }
        //   return setCredentials(req, user, requiredRights)(resolve, reject);
        // }
        // // Resolve for Test environment
        // const token = req.header('Authorization').replace(/^Bearer\s+/, '');
        // if (!token) {
        //   return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Merchant not authorized'));
        // }
        // // the account id is same as token (for test purposes)
        // return setCredentials(req, testMerchant(token), requiredRights)(resolve, reject);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return reject(new ApiError(httpStatus.UNAUTHORIZED, "Merchant authorization failed"));
      }
    })
      .then(() => next())
      .catch((err) => next(err));
  };
export default auth;
