# https://tools-mkt-data.herokuapp.com/v1

API para dados e análise de dados no mercado financeiro.

## Endpoints (testados)

### nlp
- **POST**: /nlp/atomizadorFrase
  - param: *frase* (string), return: array
- **POST**: /nlp/bowDeFrases
  - param: *frases* (array), return: object
### indfut
- **GET**: /indfut/coletar (apenas para coletar e persistir no BD)
- **GET**: /indfut/mostrar/:data?
  - return: array

### dolfut (formato data MM-DD-AAAA)
- **GET**: /dolfut/painel => retorna painel d-1 e pontos baseados no d-1.
- **GET**: /dolfut/tudo => retorna todos os docs 'Dolfut' do bd (sem paginação).
- **GET**: /dolfut/:data => retorna doc 'Dolfut' do bd, pela data.
- **POST**: /dolfut => cria novo doc 'Dolfut'.

- **GET**: /ptax/tudo => retorna todos os docs 'Ptax' do bd (sem paginação).
- **GET**: /ptax/:data => retorna doc 'Ptax' do bd, pela data.
- **POST**: /ptax => coleta ptax do Bacen e persite no bd, pela data.
- **GET**: /ptax/media/:dias => retorna um painel de médias (de acordo com a quantidade de dias requisitados) das ptaxs do bd.

- **GET**: /ajuste/tudo => retorna todos os docs 'Ajuste' do bd (sem paginação).
- **GET**: /ajuste/:data => retorna docs 'Ajuste' do bd, pela data.
- **POST**: /ajuste => coleta ajute da B3 e persite no bd, pela data.

### twitter 
- **GET**: /twitter/coletar/:perfil? => coleta de todos os perfis pre-setados ou o passado, e persite no BD.
- **GET**: /twitter/mostrar/:perfil? => retorna todos os tweets do BD ou do perfil passado.
  - return: array
- **GET**: /twitter/perfil/:perfil?ult_type=mixed|popular|recent => retorna os últimos 200 tweets do perfil, diretamente do twitter (não paginado).
  - return: array
- **GET**: /twitter/pordata/tweets => retorna todos os tweets do BD, agrupado por data (não paginado).
  - return: array
- **GET**: /twitter/pordata/itweets => retorna a quantidade de tweets do BD, agrupado por data (não paginado).
  - return: array
