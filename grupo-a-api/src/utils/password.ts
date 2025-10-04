import { hash as h, verify } from 'argon2';
export const hash = (s: string) => h(s);
export const check = (hash: string, plain: string) => verify(hash, plain);