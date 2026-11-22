# Landing page · 1º Eusébio Cup de Handebol

Arquivos:
- `index.html` — a página completa (textos, formulário e fichas)
- `assets/` — logo, fotos e vídeos usados na página
- `apps-script/Code.gs` — script que recebe as inscrições numa Planilha Google
- `servidor.ps1` — servidor local só para testar no computador

## 1. Ligar o formulário a uma Planilha Google (gratuito)

Sem esse passo, a página funciona em **modo de teste**: nada é gravado, e no final a equipe é orientada a mandar o resumo e o comprovante pelo WhatsApp.

1. Crie uma planilha nova no Google Drive (ex.: "Inscrições Eusébio Cup 2027").
2. Na planilha, abra **Extensões > Apps Script**.
3. Apague o conteúdo e cole todo o arquivo `apps-script/Code.gs`. Salve.
4. (Opcional) Em `EMAIL_AVISO`, coloque um e-mail para ser avisado a cada nova inscrição.
5. Clique em **Implantar > Nova implantação** → tipo **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize o acesso quando o Google pedir e copie a **URL do app da Web** (termina em `/exec`).
7. No `index.html`, procure `ENDPOINT: ''` e cole a URL entre as aspas:
   `ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec',`

Resultado: a planilha ganha as abas **Equipes**, **Atletas**, **Dirigentes** e **Fichas**, e os comprovantes Pix e as fichas assinadas ficam na pasta "Eusébio Cup 2027 - Comprovantes e Fichas" do seu Drive (o link fica na planilha).

## 2. Publicar a página

Suba a pasta inteira (`index.html` + `assets/`) em qualquer hospedagem estática gratuita, por exemplo:
- **Netlify Drop** (app.netlify.com/drop): arraste a pasta `landing` e pronto.
- **GitHub Pages** ou **Vercel**.

Depois é só colocar o link na bio do Instagram.

## 3. Ajustes rápidos no `index.html`

No bloco `CONFIG`, perto do fim do arquivo:
- `WHATSAPP` — número de contato no formato `55 + DDD + número`, só dígitos.
- `LOTES` — valores e datas de fim de cada lote (o lote atual e a contagem regressiva mudam sozinhos; depois de 07/01/2027 o formulário fecha).

## Testar no computador

Num terminal, dentro da pasta `landing`, rode:
`powershell -ExecutionPolicy Bypass -File servidor.ps1` e abra http://localhost:8780
