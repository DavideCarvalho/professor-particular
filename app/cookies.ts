import type { CookieOptions } from "@remix-run/node";
import { createCookie } from "@remix-run/node";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 604_800,
};

export let supabaseToken = createCookie('sb:token', {
  ...cookieOptions,
});
