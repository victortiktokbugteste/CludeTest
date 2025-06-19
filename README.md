# CLUDE TESTE TÉCNICO - FRONTEND

Essa é a parte frontend do projeto. Foi feito em react, fui pesquisando e criando de acordo o que foi pedido no escopo do teste.
Não sou fera em react e confesso que utilizei os conhecimentos do poderoso chat gpt para me auxiliar, escolhi react porque era um dos requisitos da vaga no programathor se não estou enganado.
Mas claro que eu encaro o react se assim for necessário!

## ⚙️ Como rodar localmente

1. Clone o repositório: git clone https://github.com/victortiktokbugteste/CludeTest.git
2. Tenha o node LTS 22 instalado em sua máquina
3. Execute o seguinte comando dentro do diretório do projeto: npm install
4. Execute o comando: npm start (ele vai rodar localmente)
5. Hoje ele aponta todas as rotas para https://cludetesteapi.azurewebsites.net que é o backend que já publiquei. 

!!! Caso queira fazer debug para rodar o Azure Service Bus ou entender o funcionamento do projeto, pode trocar "https://cludetesteapi.azurewebsites.net" por "https://localhost:7068"


# Senha que é solicitada quando executa o projeto - TELA DE LOGIN

Ele vai pedir pra fazer login, o usuário é:admin, a senha é:123


# Decisões técnicas tomadas no FRONTEND

1 - O login é o mesmo do endpoint api/Auth/login do nosso backend, é o JWT (JSON Web Token). 
Uma vez logado ele guarda o token no storage para usar nos próximos endpoints que forem chamados durante o teste da aplicação.
o tempo de expiração do token é de 15 minutos para ele pedir um novo. Vai redirecionar o usuário pra tela de login novamente.

2 - Decidi criar uma tela para o crud completo de pacientes, uma outra tela para o crud completo de profissionais de saúde, uma outra tela para o crud completo de agendamentos.

3 - Todas as validações ele faz no backend, no frontend ele apenas extoura as excessões marcando o erro e impedindo de continuar a ação.

4 - Se deletar um profissional de saúde, ou paciente, ele pergunta se realmente quer fazer isso, pois ele vai apagar os agendamentos da pessoa relacionada também.


