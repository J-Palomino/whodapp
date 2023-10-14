# WhoDapp



- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)


## Tableland

### Create Table MUMBAI:
``` tableland create "id int primary key, val text" --prefix "whodapp" --chain "maticmum" --privateKey [PRIVATE_KEY]```

{"meta":{"duration":11711.684078037739,"txn":{"tableIds":["7732"],"transactionHash":"0x1f89ffcc77d1a0c27a04f4c6b5b5eda308de88c3bd576bd4842c0b3fa521c6ec","blockNumber":41203393,"chainId":80001,"tableId":"7732","name":"whodapp_80001_7732","prefix":"whodapp","prefixes":["whodapp"],"names":["whodapp_80001_7732"]}},"success":true,"results":[],"link":"","ensNameRegistered":false}


### Writes:

WARNING NO WAY TO CURRENTLY AUTH READS ALL DATA WILL BE OPEN SOURCE UNTIL GAURDED.

```tableland write "INSERT INTO whodapp_80001_7732 VALUES (0, 'Johnny Five')" --chain "maticmum" --privateKey [PRIVATE_KEY]```

returns:

{"meta":{"duration":12779.596346020699,"txn":{"tableIds":["7732"],"transactionHash":"0x3767dc748b6f0ebb9929859610e286531c05269f467acb7ffeba837c0ae4e504","blockNumber":41205065,"chainId":80001,"tableId":"7732","name":"whodapp_80001_7732","prefix":"whodapp","prefixes":["whodapp"],"names":["whodapp_80001_7732"]}},"success":true,"results":[],"link":""}

### Reads:

log into expplorer with wallet: https://console.tableland.xyz/

OR 

from terminal: 

``tableland read "SELECT * FROM whodapp_80001_7732;" --chain "maticmum"``

returns:

[{"id":0,"val":"Johnny Five"}]

## How do I deploy this?

`bun install`

`bun run dev`