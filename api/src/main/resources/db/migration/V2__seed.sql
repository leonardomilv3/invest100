-- Categorias do sistema (espelho de CATEGORY_META em design/components/finance/CategoryIcon.jsx)
insert into app.categories (user_id, slug, label, kind, icon, color_token, bg_hex, fg_hex, sort_order) values
(null,'alimentacao','Alimentação','expense','utensils','--cat-amber','#FDF3DC','#A87406',10),
(null,'moradia','Moradia','expense','house','--cat-blue','#E7EDFE','#3D6BF5',20),
(null,'transporte','Transporte','expense','car','--cat-violet','#EEEBFE','#6F5DE8',30),
(null,'lazer','Lazer','expense','gamepad-2','--cat-coral','#FDE9E3','#D9431E',40),
(null,'saude','Saúde','expense','heart-pulse','--cat-pink','#FCE8F1','#C8457F',50),
(null,'educacao','Educação','expense','graduation-cap','--cat-sky','#E3F5FD','#0E7FB0',60),
(null,'assinaturas','Assinaturas','expense','repeat','--cat-ink','#ECECEB','#141414',70),
(null,'compras','Compras','expense','shopping-bag','--cat-teal','#E2F7EE','#16924A',80),
(null,'contas','Contas da casa','expense','zap','--cat-lime','#EDFCD3','#4D7A10',90),
(null,'viagem','Viagem','expense','plane','--cat-sky','#E3F5FD','#0E7FB0',100),
(null,'pets','Pets','expense','paw-print','--cat-stone','#F0F0EF','#6B6B6B',110),
(null,'outros','Outros','expense','tag','--cat-stone','#F0F0EF','#6B6B6B',999),
(null,'salario','Salário','income','banknote','--cat-teal','#E2F7EE','#16924A',10),
(null,'proventos','Proventos','income','coins','--cat-lime','#EDFCD3','#4D7A10',20),
(null,'outras_receitas','Outros','income','tag','--cat-stone','#F0F0EF','#6B6B6B',999),
(null,'investimentos','Investimentos','system','piggy-bank','--cat-lime','#EDFCD3','#4D7A10',0);

-- Catálogo inicial B3 (o job de cotações completa preço; usuário pode buscar outros símbolos via brapi)
insert into app.assets (user_id, asset_class, symbol, name, sector) values
(null,'acoes','PETR4','Petrobras','Energia'),(null,'acoes','VALE3','Vale','Mineração'),
(null,'acoes','ITUB4','Itaú Unibanco','Financeiro'),(null,'acoes','BBDC4','Bradesco','Financeiro'),
(null,'acoes','BBAS3','Banco do Brasil','Financeiro'),(null,'acoes','WEGE3','WEG','Industrial'),
(null,'acoes','ABEV3','Ambev','Consumo'),(null,'acoes','MGLU3','Magazine Luiza','Varejo'),
(null,'acoes','B3SA3','B3','Financeiro'),(null,'acoes','RENT3','Localiza','Consumo'),
(null,'acoes','SUZB3','Suzano','Materiais'),(null,'acoes','PRIO3','PRIO','Energia'),
(null,'fiis','HGLG11','CSHG Logística','Logística'),(null,'fiis','MXRF11','Maxi Renda','Papel / recebíveis'),
(null,'fiis','XPLG11','XP Log','Logística'),(null,'fiis','KNCR11','Kinea Rendimentos','Papel / CDI'),
(null,'etfs','BOVA11','iShares Ibovespa','Índice'),(null,'etfs','IVVB11','iShares S&P 500','Índice');
