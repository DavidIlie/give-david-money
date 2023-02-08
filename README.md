# Give David Money

Joke website to learn about Stripe Integration and to be able to use this code in the future. You can donate if you'd like.

[Demo](https://donate.davidilie.com)

This is a modified version of [`with-stripe-typescript`](https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript) example on the NextJS website as I couldn't really understand their example and wanted to add Tailwind CSS.

## Get it running yourself

You need two ENV variables which you can find from Stripe's website once you crate an account. You can then copy the `env.example` file to `.env` and populate it with your values:

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Then you can run it with PNPM or any other package manager

```bash
pnpm i

pnpm run dev
```
