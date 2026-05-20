// src/lib/rfidData.ts
export const GUIDES_DB = [
    {
        id: 1,
        title: 'Instalação: Portal de Expurgo (Lavanderia Suja)',
        category: 'Infraestrutura (Portais)',
        readTime: '12 min',
        icon: 'scan-line',
        difficulty: 'Intermediário',
        author: 'João Silva',
        updated: '2026-03-15',
        description: 'Montagem do portal reforçado com sensores de direção em ambientes de lavanderia suja.',
        content: {
            intro: 'O Portal de Expurgo opera em ambiente altamente agressivo (umidade >90%, colisão de carrinhos pesados). A instalação exige cuidado especial com vedação e posicionamento das antenas.',
            phases: [
                {
                    title: 'Fase 1: Preparação e Fixação da Estrutura',
                    checks: [
                        'Fixar perfis de alumínio anodizado de 80x80mm no piso e teto (furar com broca copo 10mm no concreto).',
                        'Nivelar montante com nível laser — tolerância máxima de 2mm de desvio vertical.',
                        'Aplicar selante impermeável Sikaflex-221 em todas as junções expostas à água.',
                        'Instalar canaleta metálica galvanizada para passagem dos cabos Cat6A e de alimentação.'
                    ]
                },
                {
                    title: 'Fase 2: Fixação das Antenas (Posicionamento Crítico)',
                    checks: [
                        'Montar antenas Zebra AN480 a 80cm (inferior) e 100cm (superior) do nível do piso.',
                        'Inclinar -15° em direção ao centro do corredor para cobertura convergente.',
                        'Proteger corpo das antenas com capas de borracha sanitária anti-impacto.',
                        'Conectar cabos LMR-400 de baixa perda com conectores N-Type (torque de 15 Nm).'
                    ]
                },
                {
                    title: 'Fase 3: Comissionamento e Testes',
                    checks: [
                        'Ligar leitor FX9600 e acessar painel web em http://169.254.10.10.',
                        'Configurar potência de transmissão: Antena 1 = 28dBm, Antena 2 = 27dBm.',
                        'Realizar leitura de teste com 20 peças RFID passando no portal.',
                        'Taxa de leitura mínima aceitável: 98.5% (protocolo zero-defects Elis).'
                    ]
                }
            ]
        }
    },
    {
        id: 2,
        title: 'Sintonia de Mesa de Leitura (Triagem / Dobragem)',
        category: 'Sistemas (Middleware)',
        readTime: '3 min',
        icon: 'wifi',
        difficulty: 'Básico',
        author: 'Mariana Costa',
        updated: '2026-03-20',
        description: 'Ajustes de baixa potência de RF para não ler enxovais das mesas vizinhas.',
        content: {
            intro: 'A Mesa de Leitura Linear é o principal ponto de contagem no processo de dobragem. A interferência entre mesas é o problema mais comum e é resolvido com ajuste de potência e shielding.',
            phases: [
                {
                    title: 'Fase 1: Diagnóstico de Interferência',
                    checks: [
                        'Acessar painel web do FX9600 (IP configurado pelo TI do cliente — perguntar antes).',
                        'Navegar até Readers > Antennas > RF Parameters.',
                        'Verificar potência atual: se maior que 25dBm, há risco de leitura cruzada.',
                        'Habilitar log de EPC para identificar chipsets indesejados lidos na mesa.'
                    ]
                },
                {
                    title: 'Fase 2: Ajuste e Shielding',
                    checks: [
                        'Reduzir Transmit Power gradualmente: 25dBm → 22dBm → validar.',
                        'Instalar manta de absorção magnética EM (30x30cm) entre as ilhas de dobra.',
                        'Reconfigurar zona de leitura no middleware para filtrar por zone ID.',
                        'Validar isolamento: mover 10 peças entre mesas e confirmar que não há leitura cruzada.'
                    ]
                }
            ]
        }
    },
    {
        id: 3,
        title: 'Instalação de Portal de Expedição (Doca Limpa)',
        category: 'Infraestrutura (Portais)',
        readTime: '8 min',
        icon: 'cpu',
        difficulty: 'Avançado',
        author: 'Ricardo Mendes',
        updated: '2026-02-28',
        description: 'Montagem física do leitor FX9600 na doca limpa, focado em alta potência para gaiolas.',
        content: {
            intro: 'O Portal de Expedição lida com gaiolas metálicas que podem bloquear sinal RF. Por isso, é necessária configuração de alta potência e antenas opostas com polarização circular.',
            phases: [
                {
                    title: 'Fase 1: Estrutura e Hardware',
                    checks: [
                        'Instalar portal com abertura mínima de 2,0m (largura) x 2,5m (altura) para passagem de gaiola.',
                        'Fixar 4 antenas (2 por side) com suportes pivotantes ajustáveis.',
                        'Utilizar antenas Laird S9028PCL (Circular, alto ganho 8.5 dBi) para penetrar gaiolas.',
                        'Passar 4 cabos LMR-400 de no máximo 10m de comprimento até o leitor.'
                    ]
                },
                {
                    title: 'Fase 2: Configuração de RF',
                    checks: [
                        'Configurar FX9600 em modo Dense Reader Mode para reduzir interferência.',
                        'Potência: todas as antenas em 31dBm (máximo permitido pela Anatel).',
                        'Ativar Session 1 + inventário dinâmico para gaiolas em movimento.',
                        'Testar com gaiola cheia (200 peças). Leitura mínima aceita: 99,2%.'
                    ]
                }
            ]
        }
    },
    {
        id: 4,
        title: 'Guia de Atualização de Firmware — Zebra TC26',
        category: 'Coletores Móveis',
        readTime: '5 min',
        icon: 'smartphone',
        difficulty: 'Básico',
        author: 'Ana Rodrigues',
        updated: '2026-04-01',
        description: 'Processo de atualização do sistema operacional e firmware do coletor TC26 e gatilho RFD40.',
        content: {
            intro: 'O Zebra TC26 é o coletor padrão da Elis para inventário móvel. A versão de firmware homologada é a BSP 11.1.0.0_R15 + RFD40 v.A03. Atualizações fora do padrão invalidam a garantia.',
            phases: [
                {
                    title: 'Fase 1: Preparação',
                    checks: [
                        'Carregar bateria do TC26 acima de 50% antes de iniciar a atualização.',
                        'Baixar pacote de atualização (BSP 11.1.0.0_R15) do SharePoint Elis > RFID > Firmware.',
                        'Conectar TC26 ao computador com cabo USB-C e habilitar modo Developed no dispositivo.',
                        'Abrir Zebra Scanner Utility v4.2 no computador (pasta \\\\servidor01\\tools\\Zebra).'
                    ]
                },
                {
                    title: 'Fase 2: Atualização',
                    checks: [
                        'No Zebra Utility: Tools > Flash Device > selecionar arquivo .zip do pacote BSP.',
                        'Aguardar processo de flash (≈8 min). NÃO desconectar durante este processo.',
                        'Após reinicio automático, atualizar firmware do RFD40 via Bluetooth (ZSU > Trigger Update).',
                        'Validar versão em Settings > About > Firmware Version: deve exibir A03-ELIS.'
                    ]
                }
            ]
        }
    },
    {
        id: 5,
        title: 'Configuração de IP Estático no Leitor FX9600',
        category: 'Equipamentos (Leitores/Antenas)',
        readTime: '4 min',
        icon: 'network',
        difficulty: 'Básico',
        author: 'João Silva',
        updated: '2026-03-10',
        description: 'Configurar IP fixo no leitor para integração estável com o middleware Elis.',
        content: {
            intro: 'O FX9600 deve sempre operar com IP estático no ambiente do cliente. DHCP causa falhas de reconexão do middleware Bluetooth após queda de energia.',
            phases: [
                {
                    title: 'Fase 1: Acesso ao Painel',
                    checks: [
                        'Conectar notebook diretamente ao FX9600 com cabo Ethernet crimpado 568B.',
                        'Configurar IP do notebook para 169.254.10.1 (mesma sub-rede do leitor).',
                        'Acessar http://169.254.10.10 no browser (user: admin | senha: change).',
                        'Navegar até: Communications > Network > Wired 802.3.'
                    ]
                },
                {
                    title: 'Fase 2: Configuração',
                    checks: [
                        'Preencher IP estático conforme planilha de endereçamento do cliente (solicitar ao TI).',
                        'Configurar Subnet Mask: 255.255.255.0 e Default Gateway: IP do switch da doca.',
                        'Salvar configuração e reiniciar o leitor (botão Reboot no painel).',
                        'Testar conectividade: ping <IP_configurado> do notebook na rede do cliente.'
                    ]
                }
            ]
        }
    },
    {
        id: 6,
        title: 'Inventário Cíclico com RFD40 — Passo a Passo',
        category: 'Coletores Móveis',
        readTime: '6 min',
        icon: 'clipboard-list',
        difficulty: 'Básico',
        author: 'Carlos Sousa',
        updated: '2026-04-05',
        description: 'Como realizar o inventário cíclico semanal usando o coletor TC26 com gatilho RFD40.',
        content: {
            intro: 'O inventário cíclico é realizado semanalmente pelo técnico de campo para validar a acuracidade do sistema RFID versus estoque físico. O SLA Elis exige acuracidade mínima de 97%.',
            phases: [
                {
                    title: 'Fase 1: Início do Inventário',
                    checks: [
                        'Abrir aplicativo Elis Mobile no TC26 e fazer login com matrícula Elis.',
                        'Selecionar "Inventário Cíclico" > Escolher a área a inventariar (Ex: Lavanderia Limpa).',
                        'Pressionar gatilho do RFD40 para iniciar modo de varredura contínua.',
                        'Caminhar lentamente pelo setor — manter coletor a 30-50cm dos enxovais.'
                    ]
                },
                {
                    title: 'Fase 2: Validação e Fechamento',
                    checks: [
                        'Aguardar contador no app estabilizar (sem novas leituras por 5 segundos).',
                        'Comparar total lido com total esperado no sistema — diferença tolerada: até 3%.',
                        'Em caso de divergência >3%, investigar manualmente os itens não lidos.',
                        'Tocar "Sincronizar" no app para enviar dados ao servidor central Elis.'
                    ]
                }
            ]
        }
    }
];

export const TROUBLESHOOTING_DB = [
    {
        id: 't1',
        severity: 'CRÍTICO',
        title: 'Leitor FX9600 não liga ou perde conexão IP na Expedição',
        solution: 'O PoE (Power over Ethernet) do Switch pode ter desarmado por sobrecarga. Acione o TI do cliente para reiniciar a porta do switch (não o switch inteiro). Verifique o cabo com testador de rede — crimpagem deve seguir padrão EIA/TIA 568B. Se o leitor ligar mas o IP sumir, confirme que o IP estático está correto e que não há conflito de endereço na rede.',
        tags: ['FX9600', 'PoE', 'Rede', 'Conexão']
    },
    {
        id: 't2',
        severity: 'MÉDIO',
        title: 'Mesa de Leitura lendo chips da mesa ao lado (Interferência)',
        solution: 'Reduza o Transmit Power da antena instalada debaixo da mesa de 31dBm para 22dBm via painel web do leitor (Communications > Antennas). Instale manta de absorção magnética EM entre as ilhas de dobra. Se persistir, configure filtro de zone ID no middleware para aceitar apenas EPC prefixados com o código do setor correto.',
        tags: ['Interferência', 'RF', 'Mesa', 'Potência']
    },
    {
        id: 't3',
        severity: 'MÉDIO',
        title: 'Gatilho Vermelho / Pisca Duplo no RFD40',
        solution: 'Este padrão de LED indica firmware desatualizado ou incompatível. Conecte o TC26 ao computador com cabo USB-C. Abra o Zebra Scanner Utility e execute: Trigger > Check for Updates. Selecione o firmware v.A03-ELIS da pasta homologada. O processo leva aproximadamente 4 minutos. Após concluir, teste disparando 5 leituras.',
        tags: ['RFD40', 'Firmware', 'LED', 'TC26']
    },
    {
        id: 't4',
        severity: 'BAIXO',
        title: 'Middleware não recebe dados após reboot do leitor',
        solution: 'O middleware Elis perde a sessão TCP quando o leitor reinicia. Para reconectar: acesse o dashboard do middleware (http://middleware-elis:8080/reconnect) e clique em "Rediscover Readers". Alternativamente, reinicie o serviço ElisRFIDSvc no servidor Windows do cliente (services.msc > ElisRFIDSvc > Restart). Aguarde 60 segundos para a reconexão automática.',
        tags: ['Middleware', 'TCP', 'Reconexão', 'Servidor']
    },
    {
        id: 't5',
        severity: 'CRÍTICO',
        title: 'Taxa de leitura abaixo de 95% no portal de expedição',
        solution: 'Taxa abaixo de 95% indica problema grave que deve ser escalado imediatamente. Verificar: (1) Inclinação das antenas — verificar ângulo com inclinômetro (deve ser -15° em relação à vertical). (2) Conferir cabo LMR-400 por danos físicos — substituir se houver kink ou curvatura brusca. (3) Verificar se gaiolas são do modelo padrão — gaiolas de plástico têm leitura diferente das metálicas. (4) Escalar para engenharia Elis se persistir após ajustes.',
        tags: ['Leitura', 'Antena', 'Gaiola', 'Escalação']
    },
    {
        id: 't6',
        severity: 'BAIXO',
        title: 'App Elis Mobile trava na tela de sincronização',
        solution: 'Limpe o cache do app: Configurações > Apps > Elis Mobile > Armazenamento > Limpar Cache. Se não resolver, verifique a conectividade Wi-Fi do TC26 (o app requer sinal Wi-Fi para sincronizar — não funciona apenas com dados móveis). Confirme que o servidor Elis está acessível: ping elis-server.local no terminal do TC26.',
        tags: ['App', 'Sincronização', 'Wi-Fi', 'Cache']
    }
];

export const CHAT_KB = {
    'expurgo': 'Segundo o **Manual do Portal de Expurgo v2**, as antenas devem ser fixadas a **80cm e 100cm** do solo, inclinadas **-15°** em direção ao centro do corredor. Em lavanderia suja, todas as junções devem ser vedadas com Sikaflex-221 impermeável.',
    'potencia': 'A potência padrão Elis para portais é **28–31dBm**. Para mesas de leitura lineares, reduzir para **22–25dBm** para evitar interferência entre mesas vizinhas. Nunca exceder 31dBm (limite Anatel).',
    'fx9600': 'O **Zebra FX9600** é o leitor fixo padrão Elis. Acesso ao painel: `http://169.254.10.10` (IP padrão de fábrica). Usuário: `admin`, Senha: `change`. Deve operar sempre com **IP estático** — DHCP causa instabilidade no middleware.',
    'interferencia': 'Interferência entre mesas é resolvida com: (1) reduzir potência para 22dBm, (2) instalar manta de absorção magnética EM entre as ilhas, (3) configurar filtro de zone ID no middleware Elis.',
    'tc26': 'O **Zebra TC26** com gatilho **RFD40** é o coletor móvel padrão. Firmware homologado: **BSP 11.1.0.0_R15 + RFD40 v.A03-ELIS**. Em caso de gatilho vermelho piscando 2x, atualizar firmware via Zebra Scanner Utility.',
    'antena': 'As antenas homologadas Elis são: **Laird S9028PCL** (circular, 8.5dBi, portais de expedição) e **Zebra AN480** (portais de expurgo). Usar cabo **LMR-400** de no máximo 10m de comprimento.',
    'taxa': 'As taxas mínimas aceitas pelo protocolo **Zero-Defects Elis**: Portal de Expurgo: **98.5%**, Portal de Expedição: **99.2%**, Inventário Cíclico: **97%**. Taxas abaixo devem ser escaladas para engenharia.',
    'middleware': 'Após reboot do leitor, o middleware perde a sessão TCP. Para reconectar: acesse `http://middleware-elis:8080/reconnect` e clique em "Rediscover Readers", ou reinicie o serviço **ElisRFIDSvc** no Windows.',
    'firmware': 'O firmware homologado para RFD40 é **v.A03-ELIS**. Atualização via Zebra Scanner Utility > Trigger Update. O processo leva ≈4 minutos. Não desconectar durante a atualização.',
    'ip': 'O FX9600 sai de fábrica com IP `169.254.10.10`. Para configurar IP estático: acessar painel web > Communications > Network > Wired 802.3. Solicitar ao TI do cliente a faixa de IP disponível.',
    'inventario': 'O inventário cíclico é realizado semanalmente com o **TC26 + RFD40**. Manter coletor a **30–50cm** dos enxovais. SLA Elis: acuracidade mínima de **97%**. Divergências acima de 3% devem ser investigadas manualmente.',
    'poe': 'O FX9600 é alimentado por **PoE (Power over Ethernet)** padrão IEEE 802.3at (PoE+, 30W). O switch do cliente deve suportar PoE+. Se o leitor não ligar, acionar TI para verificar a porta do switch.',
};

export const HARDWARE_DB = [
    {
        icon: 'Server',
        name: 'Leitor Fixo Zebra FX9600',
        desc: 'Coração dos portais. 8 portas ativas, 33dBm máx, suporte a 4 protocolos RFID.',
        specs: [
            { label: 'Frequência', value: '902–928 MHz (UHF)' },
            { label: 'Potência Máx.', value: '33 dBm' },
            { label: 'Portas de Antena', value: '8 (4 pares)' },
            { label: 'Conectividade', value: 'Ethernet + PoE+' },
        ]
    },
    {
        icon: 'Radio',
        name: 'Antena Laird S9028PCL',
        desc: 'Antena circular de alto ganho. Ideal para portais de expedição com gaiolas metálicas.',
        specs: [
            { label: 'Ganho', value: '8.5 dBi' },
            { label: 'Polarização', value: 'Circular (RHCP)' },
            { label: 'Abertura', value: '70° (H/V)' },
            { label: 'Conector', value: 'N-Type Fêmea' },
        ]
    },
    {
        icon: 'Radio',
        name: 'Antena Zebra AN480',
        desc: 'Antena para portais de expurgo. Design robusto com IP67 para ambientes úmidos.',
        specs: [
            { label: 'Ganho', value: '6 dBi' },
            { label: 'Proteção', value: 'IP67' },
            { label: 'Montagem', value: 'Parede / Poste' },
            { label: 'Frequência', value: '865–928 MHz' },
        ]
    },
    {
        icon: 'Smartphone',
        name: 'Zebra TC26 + Gatilho RFD40',
        desc: 'Coletor mobile padrão Elis para inventário cíclico. Firmware v.A03-ELIS obrigatório.',
        specs: [
            { label: 'OS', value: 'Android 10' },
            { label: 'Alcance RF', value: 'Até 3m (RFD40)' },
            { label: 'Bateria', value: '4,000 mAh' },
            { label: 'Proteção', value: 'IP65 / MIL-STD-810G' },
        ]
    },
    {
        icon: 'Cable',
        name: 'Cabo LMR-400',
        desc: 'Cabo coaxial de baixa perda para conexão antena-leitor. Máximo 10m por trecho.',
        specs: [
            { label: 'Atenuação', value: '0.22 dB/m @ 930MHz' },
            { label: 'Impedância', value: '50 Ω' },
            { label: 'Comprimento Máx.', value: '10 m' },
            { label: 'Conector', value: 'N-Type' },
        ]
    }
];
