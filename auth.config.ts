import { defineConfig } from 'auth-astro';
export const prerender = false;
export default defineConfig({
  prefix: '/docs-next/api/auth',
  providers: [
    {
        id: "superoffice",
        name: "Super Office",
        type: "oauth",
        issuer: "https://online.superoffice.com",
        clientId: import.meta.env.AUTH_CLIENT_ID,
        clientSecret: import.meta.env.AUTH_CLIENT_SECRET,
        authorization: {
          url: 'https://online.superoffice.com/login/common/oauth/authorize',
          params: { 
            response_type: "code", 
            scope: 'openid' 
          },
        },
        token: {
          url: 'https://online.superoffice.com/login/common/oauth/tokens',
          async request(context : any) {
            const res = await fetch('https://online.superoffice.com/login/common/oauth/tokens', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: context.clientId,
                client_secret: context.clientSecret,
                grant_type: 'authorization_code',
                code: context.params.code,
                redirect_uri: context.provider.callbackUrl,
              }),
            })
  
            const tokens = await res.json()
            return {
              tokens,
              idToken: tokens.id_token,
              accessToken: tokens.access_token,
            }
          },
        },
        userinfo: {
          // In here we simulate the userInfo using the data in the tokens
          async request(context : any) {
            if (!context.tokens.id_token) {
              throw new Error('Missing ID token')
            }
            
            const payload = JSON.parse(
              Buffer.from(context.tokens.id_token.split('.')[1], 'base64').toString()
            )

            return payload
          }
        },
        profile(profile) {
          return {
            id: profile.sub,
            customerID : profile["http://schemes.superoffice.net/identity/ctx"] || null,
            email: profile.sub ?? null,
          }
        },
        checks: ['state']
    },
  ]
});