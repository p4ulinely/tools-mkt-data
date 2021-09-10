# https://tools-mkt-data.herokuapp.com/

### API para dados e análise de dados no mercado financeiro.

### Endpoints (testados)
- **POST**: /nlp/atomizadorFrase
  - param: *frase* (string), return: array
- **POST**: /nlp/bowDeFrases
  - param: *frases* (array), return: array

- **GET**: /indfut/coletar (apenas para coletar e persistir no BD)
- **GET**: /indfut/mostrar/:data?
  - return: array

- **GET**: /twitter/coletar/:perfil? => coleta de todos os perfis pre-setados ou o passado, e persite no BD.
- **GET**: /twitter/mostrar/:perfil? => retorna todos os tweets do BD ou do perfil passado.
  - return: array
- **GET**: /twitter/perfil/:perfil&ult_type=mixed|popular|recent => retorna os últimos 200 tweets do perfil, diretamente do twitter (não paginado).
  - return: array
- **GET**: /twitter/pordata/tweets => retorna todos os tweets do BD, agrupado por data (não paginado).
  - return: array
- **GET**: /twitter/pordata/itweets => retorna a quantidade de tweets do BD, agrupado por data (não paginado).
  - return: array
