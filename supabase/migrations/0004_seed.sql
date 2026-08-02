-- ============================================================================
-- Dados iniciais — a equipa, os contactos já recolhidos, templates e tarefas
-- ============================================================================
-- Idempotente: pode correr-se mais do que uma vez sem duplicar nada.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Equipa
-- ---------------------------------------------------------------------------

insert into profiles (nome, role) values
  ('Maria Rita',  'lider'),
  ('Tiago',       'lider'),
  ('Ana',         'lider'),
  ('Martim',      'membro'),
  ('Sara',        'membro'),
  ('Jonathan',    'membro'),
  ('Lara Costa',  'membro'),
  ('Lara Leão',   'membro'),
  ('Andreia',     'membro')
on conflict (nome) do nothing;

-- ---------------------------------------------------------------------------
-- Artistas já contactados
-- ---------------------------------------------------------------------------

insert into contacts (tipo, nome, email, telefone, pessoa_contacto, estado, observacoes) values
  ('artista', 'Gisela João', 'pm@match-attack.com', '938 769 898', 'Pedro Mota', 'Pediu mais informações', 'A Gisela está em produção do novo disco. Deverá ser difícil, mas pediu mais informações, inclusive onde vai ser o concerto.'),
  ('artista', 'Pedro Abrunhosa', 'pedro@abrunhosa.com | info@sonsemtransito.com', '', '', 'A aguardar resposta', ''),
  ('artista', 'Luísa Sobral', 'booking@luisasobral.com', '916 253 708', 'Leonor Castro', 'Positivo / Disponível', 'Para confirmar disponibilidade, precisa de datas, do espaço e a quem seria dirigido.'),
  ('artista', 'Salvador Sobral', 'team.salvadorsobral@gmail.com | bles@produccionesbles.com', '', '', 'Recusado', 'Está a gravar novo projeto.'),
  ('artista', 'Zé Amaro', 'ze.amaro@live.com.pt', '', '', 'A aguardar resposta', ''),
  ('artista', 'Tony Carreira', 'booking@regiconcerto.com', '', '', 'A aguardar resposta', ''),
  ('artista', 'Mariza', 'diogoalves@ruelamusic.com', '', '', 'A aguardar resposta', ''),
  ('artista', 'Carolina Deslandes', 'miguelvilarinho@sonsemtransito.com', '', '', 'A aguardar resposta', ''),
  ('artista', 'Augusto Canário', 'augustocanario@hotmail.com', '', '', 'Positivo / Disponível', 'Está disponível, tem de ser à semana.'),
  ('artista', 'Dino d''Santiago', 'ines.lopes@arruada.com | info@okiolo.com', '', '', 'A aguardar resposta', ''),
  ('artista', 'Rui Veloso', 'parceriasveloso@gmail.com | falabeloso@gmail.com', '', '', 'A aguardar resposta', ''),
  ('artista', 'Sara Correia', 'claudia.santos@gtstalent.com', '', '', 'Recusado', 'Recusaram, sem mais detalhes.'),
  ('artista', 'Fernando Daniel', 'catarina.vilela@umusic.com', '', '', 'Recusado', 'Sem disponibilidade de agenda, esperam colaborar numa próxima.'),
  ('artista', 'Cuca Roseta', 'booking@cucaroseta.com | management@cucaroseta.com', '964 308 911', 'Miguel Capucho', 'Recusado', 'Já preencheu a cota de eventos solidários este ano, disponível para retomar contacto em 2027.')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Artistas da lista de agentes/agências (ainda por contactar)
-- ---------------------------------------------------------------------------

insert into contacts (tipo, nome, email, telefone, pessoa_contacto, observacoes) values
  ('artista', 'Diogo Piçarra', 'joana.nevesdesousa@gtstalent.com | catarina.vilela@gtstalent.com', '', '', 'Booking: catarina.vilela@gtstalent.com'),
  ('artista', 'Los Romeros', 'geral@homeoutagencia.com', '+351 914 124 534', '', ''),
  ('artista', 'Rita Rocha', 'info@sonsemtransito.com', '', '', ''),
  ('artista', 'Diana Vilarinho', 'marianacouto@sonsemtransito.com', '', '', ''),
  ('artista', 'Bandidos do Cante', '', '', '', ''),
  ('artista', 'Vizinhos', 'osvizinhos.booking@gmail.com', '', '', ''),
  ('artista', 'Syro', 'andreferreira@mundoscruzados.pt', '', '', ''),
  ('artista', 'Mimi Cat', 'info@inarteria.pt', '', '', ''),
  ('artista', 'Nuno Siqueira', 'nunosiqueira@outlook.pt', '', '', ''),
  ('artista', 'Raquel Tavares', 'josemorais@produtoresassociados.com | luispardelha@produtoresassociados.com | taniamonteiro@produtoresassociados.com', '+351 914 764 548 | +351 917 277 790 | +351 918 950 046', 'José Morais / Luís Pardelha / Tânia Monteiro', ''),
  ('artista', 'Cláudia Pascoal', 'claudia.santos@gtstalent.com', '', '', ''),
  ('artista', 'Rita Guerra', 'booking@ruelamusic.com', '963 381 556', '', ''),
  ('artista', 'Lena D''Água', 'josemorais@produtoresassociados.com | luispardelha@produtoresassociados.com | taniamonteiro@produtoresassociados.com | mariatorres@produtoresassociados.com', '+351 914 764 548 | +351 917 277 790 | +351 918 950 046 | +351 913 900 407', 'José Morais / Luís Pardelha / Tânia Monteiro / Maria Torres', ''),
  ('artista', 'Virgul', 'diogoalves@ruelamusic.com', '+351 963 381 556 | +351 219 249 249', '', ''),
  ('artista', 'Miguel Gameiro', 'ospolonorte@gmail.com', '939166161', '', ''),
  ('artista', 'Marco Rodrigues', 'michelle.sancho@gtstalent.com', '', '', ''),
  ('artista', 'Sérgio Godinho', 'ticha@vachier.pt | paulosalgado@vachier.pt', '+351 936 802 002 | +351 214 168 300 | +351 967 018 067', '', ''),
  ('artista', 'André Sardet', 'producao@domingonomundo.pt', '', '', ''),
  ('artista', 'Bianca Barros', '', '', '', ''),
  ('artista', 'Edmundo Inácio', '', '', '', ''),
  ('artista', 'Diogo Clemente', '', '', '', ''),
  ('artista', 'Catarina Filipe', '', '', '', ''),
  ('artista', 'Dulce Pontes', '', '', '', ''),
  ('artista', 'IRMA', '', '', '', ''),
  ('artista', 'João Gil', '', '', '', ''),
  ('artista', 'Mafalda Veiga', '', '', '', ''),
  ('artista', 'Matay', '', '', '', ''),
  ('artista', 'Maria Gil de Azevedo', '', '', '', 'The Voice'),
  ('artista', 'Milhanas', '', '', '', ''),
  ('artista', 'Mimi Froes', '', '', '', ''),
  ('artista', 'João Só e Abandonados', '', '', '', ''),
  ('artista', 'Lúcia Moniz', '', '', '', ''),
  ('artista', 'Deolinda', '', '', '', ''),
  ('artista', 'Descendentes', '', '', '', ''),
  ('artista', 'Rita Redshoes', '', '', '', ''),
  ('artista', 'Soraia Tavares', '', '', '', ''),
  ('artista', 'Toranja', '', '', '', ''),
  ('artista', 'Ala dos Namorados', '', '', '', ''),
  ('artista', 'NAPA', '', '', '', ''),
  ('artista', 'Luís Represas', '', '', '', ''),
  ('artista', 'MadreDeus', '', '', '', ''),
  ('artista', 'Humanos', '', '', '', ''),
  ('artista', 'Para Sempre Marco', '', '', '', ''),
  ('artista', 'Márcia', '', '', '', ''),
  ('artista', 'Maninho', '', '', '', ''),
  ('artista', 'Murta', '', '', '', ''),
  ('artista', 'Noninho', '', '', '', ''),
  ('artista', 'Mariana Pereira', '', '', '', ''),
  ('artista', 'The Black Mamba', '', '', '', ''),
  ('artista', 'Afonso Dubraz', '', '', '', ''),
  ('artista', 'Diana Castro', '', '', '', ''),
  ('artista', 'Joana Oliveira', '', '', '', ''),
  ('artista', 'Tiago Nacarato', '', '', '', ''),
  ('artista', 'Nuno Ribeiro', '', '', '', ''),
  ('artista', 'Carolina de Deus', '', '', '', ''),
  ('artista', 'Nena', '', '', '', ''),
  ('artista', 'Joana Almeirante', '', '', '', ''),
  ('artista', 'Maro', '', '', '', ''),
  ('artista', 'Elisa', '', '', '', ''),
  ('artista', 'Ana Bacalhau', '', '', '', ''),
  ('artista', 'Paulo Gonzo', '', '', '', ''),
  ('artista', 'Tim', '', '', '', ''),
  ('artista', 'João Pedro Pais', '', '', '', ''),
  ('artista', 'David Fonseca', '', '', '', ''),
  ('artista', 'Clã', '', '', '', ''),
  ('artista', 'Capitão Fausto', '', '', '', ''),
  ('artista', 'Delfins', '', '', '', ''),
  ('artista', 'Camané', '', '', '', ''),
  ('artista', 'Carminho', '', '', '', ''),
  ('artista', 'Fingertips', '', '', '', ''),
  ('artista', 'The Gift', '', '', '', ''),
  ('artista', 'Virgem Suta', '', '', '', ''),
  ('artista', 'Blind Zero', '', '', '', ''),
  ('artista', 'Paulo de Carvalho', '', '', '', ''),
  ('artista', 'Pedro Moutinho', '', '', '', ''),
  ('artista', 'Jorge Guerreiro', '', '', '', ''),
  ('artista', 'Matias Damásio', '', '', '', ''),
  ('artista', 'Agir', '', '', '', ''),
  ('artista', 'April Ivy', '', '', '', ''),
  ('artista', 'Berg', '', '', '', ''),
  ('artista', 'Fernando Pereira', '', '', '', ''),
  ('artista', 'Paulo Sousa', '', '', '', ''),
  ('artista', 'Pedro Gonçalves', '', '', '', ''),
  ('artista', 'Richie Campbell', '', '', '', ''),
  ('artista', 'UHF', '', '', '', ''),
  ('artista', 'Wanda Stuart', '', '', '', ''),
  ('artista', 'David Antunes + Jéssica Cipriano + Carolina Ligeiro', '', '', '', ''),
  ('artista', 'Zarko', '', '', '', ''),
  ('artista', 'Ivandro', '', '', '', ''),
  ('artista', 'Bia Caboz', '', '', '', ''),
  ('artista', 'Francisca Borges', '', '', '', ''),
  ('artista', 'Mickael Carreira', '', '', '', ''),
  ('artista', 'David Carreira', '', '', '', ''),
  ('artista', 'Ornatos Violeta', '', '', '', ''),
  ('artista', 'Linda Martini', '', '', '', ''),
  ('artista', 'Marisa Liz', '', '', '', ''),
  ('artista', 'Os Alentons', '', '', '', ''),
  ('artista', 'TT', 'ttconcertos@gmail.com', '', '', '')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Espaços
-- ---------------------------------------------------------------------------

insert into contacts (tipo, nome, cidade, capacidade, email, telefone, estado, data_ultimo_contacto, observacoes) values
  ('espaco', 'Teatro Jordão (Câmara de Guimarães)', 'Guimarães', '400', 'geral@aoficina.pt', '253 421 200', 'A aguardar resposta', '2026-04-20', ''),
  ('espaco', 'Centro Cultural Vila Flor', 'Guimarães', 'Pequeno Auditório: 200; Grande Auditório: 800', 'geral@ccvf.pt', '253 424 700', 'A aguardar resposta', '2026-04-21', 'Site: https://www.ccvf.pt/espacos/'),
  ('espaco', 'Forum Braga', 'Braga', '', 'sandra.vaz@investbraga.com', '914 328 872', 'Por contactar', null, 'Em novembro disseram que teríamos 30% de desconto - vamos ver pelo município se nos arranjam algum desconto melhor.'),
  ('espaco', 'Espaço Vita', 'Braga', '491', 'info@espacovita.pt', '253 203 180', 'Por contactar', null, 'Tinham dado resposta negativa, agora vamos esperar pelo município se conseguem. Site: https://www.espacovita.pt/espaco/auditorio/'),
  ('espaco', 'Casa das Artes', 'Vila Nova de Famalicão', 'Grande Auditório: 500', 'casadasartes@famalicao.pt', '252 371 297', 'Recusado', '2026-04-21', 'Disseram que já tinham tido propostas deste género, iam avaliar internamente mas disseram logo que para já não. Site: https://www.famalicao.pt/visitar-casa-dasartes'),
  ('espaco', 'Pousada da Juventude', 'Braga', '226', 'pousadadejuventude@investbraga.com', '253 148 682', 'Positivo / Disponível', '2026-11-24', 'Muito poucos lugares mas o senhor mostrou-se disponível para nos ajudar e aconselhar. Site: https://www.centrojuventudebraga.pt/Detail/Index/f3620fc3-7052-11ea-8600-025041000001'),
  ('espaco', 'Município de Braga', 'Braga', '', 'info@cm-braga.pt', '253 616 060', 'A aguardar resposta', '2026-02-26', 'Já tivemos uma reunião com eles, agora estamos à espera de ter os documentos prontos para restabelecer contacto. Site: https://braga.balcaoeletronico.pt/catalog/t/3bdc95b5-b1a2-483c-b22db7a4ac11c795'),
  ('espaco', 'Auditório Nobre (UM - Azurém)', 'Guimarães', '482', 'ccultural@reitoria.uminho.pt', '253 601 067', 'Positivo / Disponível', '2026-04-22', 'Já contactámos por muitos emails e chamadas e ninguém nos soube dar uma resposta; de qualquer forma vamos deixar para se for preciso algo mais pequeno, e vamos até à reitoria se for preciso.'),
  ('espaco', 'Auditório A1 (UM - Gualtar)', 'Braga', '380', 'ccultural@reitoria.uminho.pt', '', 'Positivo / Disponível', '2026-04-22', '')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Templates de email
-- ---------------------------------------------------------------------------

insert into templates (nome, categoria, fase, assunto, corpo) values
  (
    '1ª fase – Convite inicial',
    'Artistas',
    1,
    'Querem participar no concerto solidário da YME?',
    'Bom dia {{nome}},<br><br>' ||
    'O meu nome é [Teu Nome] e sou [teu cargo] no departamento de [departamento] da Young Minho Enterprise (YME), a Júnior Empresa da Escola de Economia, Gestão e Ciência Política da Universidade do Minho, que atua nas áreas de Design, Web Development e Corporate Consulting.<br><br>' ||
    'Na YME, acreditamos que o impacto social faz parte integrante do nosso percurso enquanto jovens profissionais. Por isso, estamos a organizar um Concerto Solidário que se irá realizar em Braga, com o objetivo de reverter todos os ganhos a favor do IPO e assim ajudar aqueles que mais precisam.<br><br>' ||
    'Neste momento, estamos a planear o evento para o período compreendido entre (datas).<br><br>' ||
    'Desta forma, e porque admiramos o vosso trabalho, gostaríamos muito de contar com a vossa participação nesta causa. Teriam disponibilidade de agenda dentro desta janela temporal?<br><br>' ||
    'Caso tenham interesse, estaríamos totalmente disponíveis para uma breve reunião para discutirmos datas específicas e os detalhes do evento.<br><br>' ||
    'Fico inteiramente ao dispor para agendar ou esclarecer qualquer questão.<br><br>' ||
    'Cumprimentos,<br>#ASSINATURA'
  )
on conflict (categoria, fase) do nothing;

-- ---------------------------------------------------------------------------
-- Tarefas definidas em reunião de equipa
-- ---------------------------------------------------------------------------

insert into tasks (titulo, responsavel) values
  ('Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los', 'Jonathan'),
  ('Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los', 'Martim'),
  ('Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los', 'Sara'),
  ('Renovar a lista de contactos de artistas e preencher tudo corretamente no Excel com base nessa lista, e voltar a contactá-los', 'Lara Leão'),
  ('Renovar a lista de contactos dos espaços e voltar a contactá-los', 'Lara Costa'),
  ('Renovar a lista de contactos dos espaços e voltar a contactá-los', 'Andreia'),
  ('Responder ao Vita', 'Maria Rita'),
  ('Perceber quais os parceiros que é importante contactar nesta fase', 'Maria Rita'),
  ('Perceber quais os parceiros que é importante contactar nesta fase', 'Tiago'),
  ('Perceber quais os parceiros que é importante contactar nesta fase', 'Ana'),
  ('Definir uma proposta de valor para esses parceiros', 'Maria Rita'),
  ('Definir uma proposta de valor para esses parceiros', 'Tiago'),
  ('Definir uma proposta de valor para esses parceiros', 'Ana')
on conflict do nothing;
