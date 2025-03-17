import { z } from "zod"
import { pg } from "../../drizzle/client"
import { tool } from "ai"

export const postgresTool = tool({
    description: `
      Realiza um query no Postgres para buscar informações sobre as tabelas no banco de dados
    
      Só pode realizar operações de busca (SELECT), não é permitida a geração de qualquer operação escrita.

      Tables:
      """
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          email text NOT NULL UNIQUE,
          create_at timestamp NOT NULL DEFAULT now()
      """

      Todas operações devem retornar um máximo de 50 itens.
    `.trim(),
    parameters: z.object({
      query: z.string().describe("A query do PostgreSQL para ser executada."),
      params: z.array(z.string()).describe("Parâmetros da query a ser executada.")
    }),
    execute: async ({ query, params }) => {
      const result = await pg.unsafe(query,params)
      
      return JSON.stringify(result)
    }
  })