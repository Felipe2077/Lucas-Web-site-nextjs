### Processo de Atualização (Update) do Site

1.  **Conecte-se ao seu VPS via SSH** com o usuário `lucasadmin` (o usuário não-root que você usa para gerenciar o site).

    ```bash
    ssh -p 22022 lucasadmin@162.240.167.170 # Use a porta e o IP corretos
    ```

2.  **Navegue até o diretório do seu projeto** no VPS:

    ```bash
    cd /var/www/lucasforesti.com.br
    ```

3.  **Puxe as últimas alterações do GitHub:**
    Este comando baixará todas as novas commits do seu repositório no GitHub para o diretório do seu projeto no VPS.

    ```bash
    git pull
    ```

    _Se você estiver usando HTTPS para autenticação (com Personal Access Token), ele pode pedir seu nome de usuário do GitHub e o PAT novamente._

4.  **Instale ou atualize as dependências:**
    Sempre que o código muda, é uma boa prática rodar `pnpm install`. Isso garantirá que quaisquer novas dependências adicionadas ou versões de dependências atualizadas no seu `package.json` e `pnpm-lock.yaml` sejam instaladas.

    ```bash
    pnpm install
    ```

5.  **Refaça o build da aplicação:**
    Com o código atualizado e as dependências em dia, você precisa recompilar a aplicação para gerar a nova versão otimizada para produção.

    ```bash
    pnpm build
    ```

6.  **Reinicie a aplicação com PM2:**
    Para que as alterações do novo build entrem em vigor, você precisa reiniciar o processo do PM2 que está servindo sua aplicação.

    ```bash
    sudo pm2 restart lucas-foresti-site
    ```

    _Usamos `sudo` aqui porque o serviço de auto-inicialização do PM2 (`pm2-root.service`) foi configurado para rodar como `root`, então você precisa de privilégios `sudo` para controlá-lo._

7.  **Verifique o status da aplicação (opcional):**

    ```bash
    pm2 status
    ```

    Confirme se `lucas-foresti-site` ainda está `online` e se o `uptime` (tempo de atividade) foi resetado.
