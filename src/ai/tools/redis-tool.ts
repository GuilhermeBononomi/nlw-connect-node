import { z } from "zod"
import { tool } from "ai"
import { redis } from "../../redis/client"

export const redisTool = tool({
    description: `
      Realiza um comando no redis para buscar informações sobre o sistema de indicações como o número de cliques no link, número de indicações (convites).

      Só pode ser utilizada para buscar dados do Redis, não pode executar nenhum comando de escrita.

      Você pode buscar dados de:

      - Um hash chamado "referral:acess-count" que guarda o número de cliques/acessos no link de convite/indicação de cada usuário no formato { "SUBSCRIBER_ID": NUMERO_DE_CLIQUES } onde o SUBSCRIBER_ID vem do Postgres.
      - Um zset chamado "referral:ranking" que guarda o total de convites/indicações feitos por cada usuário onde o score é a quantidade de convites e o conteúdo é o SUBSCRIBER_ID que vem do Postgres.
    `.trim(),
    parameters: z.object({
      command: z.string().describe("O comando a ser executado no redis como GET, HGET ZREVRANGE."),
      args: z
      .array(z.string())
      .describe("Argumentos que vem logo após o comando do Redis.")
    }),
    execute: async ({ command, args }) => {
      const result = await redis.call(command,args)
      
      return JSON.stringify(result)
    }
  })