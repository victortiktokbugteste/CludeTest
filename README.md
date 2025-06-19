# CLUDE TESTE TÉCNICO - FRONTEND

https://cludetestfront.azurewebsites.net/

Essa é toda a parte visual da nossa aplicação.
Ela possui:

1 TELA PRA FAZER O LOGIN (essa chama o endpoint /login que retorna o Bearer Token) /n
1 TELA PRA CRIAR, EXCLUIR, ALTERAR PACIENTES
1 TELA PRA CRIAR, EXCLUIR, ALTERAR PROFISSIONAIS DE SAÚDE (Nessa tela tem um Plus que é poder ver os agendamentos do profissional, fica no segundo icone antes do excluir)
1 TELA PRA CRIAR, EXCLUIR, ALTERAR OS AGENDAMENTOS

## ⚙️ Como rodar localmente

1. Clone o repositório: git clone https://github.com/victortiktokbugteste/CludeTest.git
2. Tenha o node LTS 22 instalado em sua máquina
3. Execute o seguinte comando dentro do diretório do projeto: npm install
4. Execute o comando: npm start (ele vai rodar localmente)



# Senha que é solicitada quando executa o projeto - TELA DE LOGIN

Ele vai pedir pra fazer login, o usuário é:admin, a senha é:123


# Decisões técnicas tomadas no FRONTEND

1 - O login é o mesmo do endpoint api/Auth/login do nosso backend, é o JWT (JSON Web Token). 
Uma vez logado ele guarda o token no storage para usar nos próximos endpoints que forem chamados durante o teste da aplicação.
o tempo de expiração do token é de 15 minutos para ele pedir um novo. Vai redirecionar o usuário pra tela de login novamente.

2 - Decidi criar uma tela para o crud completo de pacientes, uma outra tela para o crud completo de profissionais de saúde, uma outra tela para o crud completo de agendamentos.

3 - Todas as validações ele faz no backend, no frontend ele apenas extoura as excessões marcando o erro e impedindo de continuar a ação.

4 - Se deletar um profissional de saúde, ou paciente, ele pergunta se realmente quer fazer isso, pois ele vai apagar os agendamentos da pessoa relacionada também.


