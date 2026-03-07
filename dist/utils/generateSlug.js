import { randomBytes } from 'crypto';
export const generateSlug = (length = 6) => {
    return randomBytes(length).toString('base64url').slice(0, length);
};
//# sourceMappingURL=generateSlug.js.map