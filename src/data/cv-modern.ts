/**
 * Résumé content, rewritten for a modern 2-page CV.
 * Every statement is condensed from cv-full-data.json / cv-data.json (v1.2.0) —
 * nothing here should go beyond those facts.
 */
export type Lang = 'fr' | 'en';

export interface Mission {
  client: string;
  logos: string[];
  role: string;
  period: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
}
export interface Employer {
  name: string;
  logo?: string;
  /** true when the logo is a wordmark that already spells the name */
  logoIsName?: boolean;
  kind: string;
  period: string;
  missions: Mission[];
}
export interface CvContent {
  labels: Record<string, string>;
  title: string;
  pitch: string;
  location: string;
  phone: string;
  email: string;
  license: string;
  links: { label: string; href: string; icon: string }[];
  stats: { value: string; label: string }[];
  career: {
    from: number;
    to: number;
    label: string;
    track: 'industry' | 'transition' | 'software';
  }[];
  employers: Employer[];
  internship: Mission & { company: string };
  industry: { company: string; logo?: string; period: string; role: string; text: string }[];
  skills: { group: string; items: string[] }[];
  learning: { label: string; items: string[] };
  projects: { name: string; text: string; tags: string[] }[];
  education: { year: string; title: string; school: string; note?: string }[];
  earlyEducation: string;
  languages: { name: string; level: string }[];
  interests: string[];
}

const L = '/assets/images/logos/';
const links = [
  { label: 'mafalgai.com', href: 'https://mafalgai.com', icon: 'globe' },
  { label: 'github.com/Maf38', href: 'https://github.com/Maf38', icon: 'github' },
  {
    label: 'linkedin.com/in/mafal-gai',
    href: 'https://www.linkedin.com/in/mafal-gai-7a456817a/',
    icon: 'linkedin',
  },
];

const fr: CvContent = {
  labels: {
    profile: 'Profil',
    experience: 'Expérience',
    industry: 'Parcours industriel',
    skills: 'Compétences',
    learning: 'En cours d’acquisition',
    education: 'Formation',
    languages: 'Langues',
    interests: 'Centres d’intérêt',
    career: 'Trajectoire',
    industryTrack: 'Industrie',
    transitionTrack: 'Reconversion',
    softwareTrack: 'Développement logiciel',
    now: 'auj.',
    current: 'en cours',
    continued: 'suite',
    scan: 'Portfolio',
    intern: 'Stage',
    projects: 'Projets personnels',
    projectsNote: 'sélection — détails sur mafalgai.com',
  },
  title: 'Développeur .NET augmenté par l’IA',
  pitch:
    'Développeur .NET depuis 2019, après 13 ans dans l’industrie microélectronique. GitHub Copilot au quotidien en mission, Claude Code sur mes projets personnels : je travaille de plus en plus en orchestrateur du code généré par l’IA. J’élargis mon profil vers le DevOps avec une formation Expert DevOps (RNCP niveau 7) en cours.',
  location: 'Grenoble',
  phone: '06 XX XX XX X7',
  email: 'gaimafal@gmail.com',
  license: 'Permis B, véhiculé',
  links,
  stats: [
    { value: '7 ans', label: 'en développement logiciel' },
    { value: '13 ans', label: 'chez ST Microelectronics' },
    { value: '70+', label: 'applications maintenues au CEA' },
    { value: 'RNCP 7', label: 'Expert DevOps, en cours' },
  ],
  career: [
    { from: 2001, to: 2002, label: 'Armée', track: 'industry' },
    { from: 2005, to: 2018, label: 'ST Microelectronics', track: 'industry' },
    { from: 2018.6, to: 2019.5, label: 'AFPA', track: 'transition' },
    { from: 2019.25, to: 2019.7, label: 'Cerberis', track: 'software' },
    { from: 2019.83, to: 2023.25, label: 'Capgemini', track: 'software' },
    { from: 2023.25, to: 2026.8, label: 'Inetum', track: 'software' },
  ],
  employers: [
    {
      name: 'Inetum',
      logo: `${L}inetum-logo-mono.svg`,
      kind: 'ESN',
      period: 'avr. 2023 — auj.',
      missions: [
        {
          client: 'ANR — Agence Nationale de la Recherche',
          logos: [`${L}anr-logo-mono.svg`],
          role: 'Développeur .NET',
          period: 'janv. 2026 — auj.',
          current: true,
          bullets: [
            'Maintenance évolutive et corrective de la plateforme SIM, qui gère les appels à projets de recherche nationaux (application legacy ASP.NET WebForms).',
            'GitHub Copilot et assistants IA intégrés au quotidien : cadrage, relecture et pilotage du code généré.',
          ],
          tags: [
            'ASP.NET WebForms',
            '.NET Framework',
            'SQL Server',
            'Dapper',
            'SharePoint',
            'GitHub Copilot',
            'Jira',
          ],
        },
        {
          client: 'Commissariat à l’énergie atomique',
          logos: [`${L}cea-logo-mono.svg`],
          role: 'Développeur .NET',
          period: 'avr. 2023 — déc. 2025',
          bullets: [
            'Portefeuille de maintenance de 70+ applications web, en build comme en run.',
            'CI/CD Azure DevOps, quality gates SonarQube et tests unitaires.',
            'Stacks legacy (.NET 4.8, Razor, Kendo UI) et modernes (.NET 8).',
            'Modernisation du SI : migration SQL Server 2014 → 2019 Cluster, logs Serilog / ELK.',
          ],
          tags: [
            'C#',
            '.NET 8',
            'Entity Framework',
            'Azure DevOps',
            'SonarQube',
            'SQL Server',
            'IIS',
            'Keycloak',
            'ELK',
          ],
        },
      ],
    },
    {
      name: 'Capgemini',
      logo: `${L}capgemini-logo-mono.svg`,
      logoIsName: true,
      kind: 'ESN',
      period: 'nov. 2019 — mars 2023',
      missions: [
        {
          client: 'EDF — projet GEMODO',
          logos: [`${L}edf-logo-mono.svg`],
          role: 'Développeur backend & PL/SQL',
          period: 'juin 2021 — mars 2023',
          bullets: [
            'Développement backend Java / KornShell sur RedHat Linux et workflows ETL Informatica.',
            'Procédures PL/SQL de validation syntaxique et sémantique des données selon les règles métier.',
            'Automatisation de l’injection de données avec UFT (VBScript).',
          ],
          tags: [
            'Java',
            'PL/SQL',
            'Oracle',
            'Informatica',
            'Control-M',
            'Jenkins',
            'RedHat Linux',
            'SAFe',
          ],
        },
        {
          client: 'EDF — application DPA (MES)',
          logos: [`${L}edf-logo-mono.svg`],
          role: 'Migration d’architecture & tests de performance',
          period: 'juin 2020 — juin 2021',
          bullets: [
            'Pilotage de la mise à niveau de DPA, un MES de prévention des dérives SPC : passage de 4 à 5 serveurs.',
            'Bascule des sources de données ODBC legacy vers un MES moderne (Hadoop Espadon).',
            'Tests de charge pour valider les performances en mode Near Real-Time.',
          ],
          tags: ['Hadoop', 'SQL Server', 'PowerShell', 'Windows Server', 'HP ALM', 'Aspentech'],
        },
        {
          client: 'EDF & Rio Tinto — équipe MES',
          logos: [`${L}edf-logo-mono.svg`, `${L}rio-tinto-logo-mono.svg`],
          role: 'Développeur logiciel',
          period: 'nov. 2019 — mai 2020',
          bullets: [
            'Preuves de concept MES et refonte de l’interface mobile Rio Tinto.',
            'Pipelines CI/CD d’automatisation de tests sur environnements hybrides Linux / Windows.',
          ],
          tags: ['Angular 6', 'Ionic 3', 'GitLab', 'Jenkins', 'Selenium'],
        },
      ],
    },
  ],
  internship: {
    company: 'Cerberis',
    client: 'Cerberis',
    logos: [],
    role: 'Développeur logiciel (stage)',
    period: 'avr. — sept. 2019',
    bullets: [
      'Daemon SaaS d’intégration Microsoft Exchange en .NET (API Office 365, OAuth 2.0 / OpenID Connect), déployé sur Azure.',
    ],
    tags: ['.NET', 'Azure', 'Cosmos DB', 'Office 365 API'],
  },
  industry: [
    {
      company: 'ST Microelectronics',
      logo: `${L}st-microelectronics-mono.svg`,
      period: '2005 — 2018',
      role: 'Technicien process, puis technicien de maintenance',
      text: 'Gravure sèche (LAM Research, TEL) sur wafers 200 mm, démarche TPM et culture Lean. Contribution aux gains de productivité pendant la crise de 2008.',
    },
    {
      company: 'Canalog',
      logo: `${L}becton-dickinson-mono.svg`,
      period: '2005',
      role: 'Monteur câbleur',
      text: 'Machines de fabrication de seringues en verre pour l’industrie pharmaceutique.',
    },
    {
      company: '68e Régiment d’Artillerie d’Afrique',
      logo: `${L}armee-de-terre-mono.svg`,
      period: '2001',
      role: 'Assistant informatique (service militaire)',
      text: 'Numérisation des carnets de maintenance des véhicules et macros VBA.',
    },
  ],
  skills: [
    {
      group: '.NET & backend',
      items: ['C#', '.NET 8 / 4.8', 'ASP.NET', 'Entity Framework', 'Dapper', 'Java'],
    },
    { group: 'Données', items: ['SQL Server', 'Oracle', 'PL/SQL', 'Informatica', 'Cosmos DB'] },
    {
      group: 'DevOps & qualité',
      items: ['Azure DevOps', 'GitLab CI', 'Jenkins', 'SonarQube', 'Selenium', 'ELK'],
    },
    { group: 'Front', items: ['Angular', 'TypeScript', 'JavaScript', 'Kendo UI'] },
    { group: 'Systèmes', items: ['Windows Server', 'IIS', 'RedHat Linux'] },
    { group: 'IA', items: ['GitHub Copilot', 'Claude Code'] },
  ],
  learning: {
    label: 'Formation Expert DevOps',
    items: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'AWS / Azure'],
  },
  projects: [
    {
      name: 'IFTTT-Trading',
      text: 'Automatisation de swaps sur Solana par règles conditionnelles (non-custodial). MVP consolidé avec un écosystème DevOps complet : provisioning Ansible, CI/CD GitLab, monitoring Prometheus / Grafana, secrets Vault, sauvegardes S3.',
      tags: [
        'Angular 18',
        'NestJS',
        'PostgreSQL',
        'Docker Compose',
        'Ansible',
        'GitLab CI',
        'Prometheus',
        'Vault',
      ],
    },
    {
      name: 'Dictée universelle',
      text: 'Dictée vocale système pour Windows : raccourci global, transcription via l’API OpenAI, collage automatique dans le champ actif. Open source (MIT), releases signées.',
      tags: ['.NET 10', 'WPF', 'NAudio', 'OpenAI API', 'GitHub Actions'],
    },
    {
      name: 'BioRoutine',
      text: 'Tableau de bord santé utilisé au quotidien (Huawei Health, Strava, nutrition) avec assistant vocal IA (Claude) et app Android compagnon publiée sur Google Play.',
      tags: ['Next.js', 'Fastify', 'React Native', 'Kotlin', 'n8n', 'Claude API'],
    },
    {
      name: 'Claude Visual Code',
      text: 'Client mobile voice-first pour Claude Code : dicter son intention depuis Android, suivre le travail en temps réel, fichiers et terminal.',
      tags: ['Flutter', 'Dart', 'code-server', 'VS Code API', 'SSH'],
    },
  ],
  education: [
    {
      year: '2026',
      title: 'Expert DevOps — RNCP niveau 7',
      school: 'OpenClassrooms',
      note: 'en cours',
    },
    {
      year: '2019',
      title: 'Titre pro Concepteur Développeur Informatique',
      school: 'AFPA, Grenoble',
    },
    { year: '2003', title: 'DUT GEII', school: 'Université Joseph Fourier, Grenoble' },
  ],
  earlyEducation: '1996 — 1999 · Bac S mention bien, Math Sup PCSI, DEUG SMb, IUP MAI',
  languages: [
    { name: 'Français', level: 'natif' },
    { name: 'Anglais', level: 'B2' },
  ],
  interests: ['Ski', 'VTT descente & enduro', 'Randonnée', 'Jeux vidéo FPS'],
};

const en: CvContent = {
  labels: {
    profile: 'Profile',
    experience: 'Experience',
    industry: 'Industrial background',
    skills: 'Skills',
    learning: 'Currently learning',
    education: 'Education',
    languages: 'Languages',
    interests: 'Interests',
    career: 'Career path',
    industryTrack: 'Industry',
    transitionTrack: 'Career change',
    softwareTrack: 'Software development',
    now: 'now',
    current: 'current',
    continued: 'continued',
    scan: 'Portfolio',
    intern: 'Internship',
    projects: 'Side projects',
    projectsNote: 'selection — more on mafalgai.com',
  },
  title: 'AI-Augmented .NET Developer',
  pitch:
    '.NET developer since 2019, after 13 years in the semiconductor industry. GitHub Copilot daily on assignments, Claude Code on personal projects: I increasingly work as an orchestrator of AI-generated code. I am broadening my profile towards DevOps through an Expert DevOps program (RNCP level 7) in progress.',
  location: 'Grenoble, France',
  phone: '06 XX XX XX X7',
  email: 'gaimafal@gmail.com',
  license: 'Driving licence B',
  links,
  stats: [
    { value: '7 yrs', label: 'in software development' },
    { value: '13 yrs', label: 'at ST Microelectronics' },
    { value: '70+', label: 'applications maintained at CEA' },
    { value: 'RNCP 7', label: 'Expert DevOps, in progress' },
  ],
  career: fr.career.map((c) => (c.label === 'Armée' ? { ...c, label: 'Army' } : c)),
  employers: [
    {
      name: 'Inetum',
      logo: `${L}inetum-logo-mono.svg`,
      kind: 'IT services',
      period: 'Apr 2023 — now',
      missions: [
        {
          client: 'ANR — French National Research Agency',
          logos: [`${L}anr-logo-mono.svg`],
          role: '.NET Developer',
          period: 'Jan 2026 — now',
          current: true,
          bullets: [
            'Evolutive and corrective maintenance of the SIM platform, which manages national research grant calls (legacy ASP.NET WebForms application).',
            'GitHub Copilot and AI assistants used daily: framing, reviewing and steering generated code.',
          ],
          tags: [
            'ASP.NET WebForms',
            '.NET Framework',
            'SQL Server',
            'Dapper',
            'SharePoint',
            'GitHub Copilot',
            'Jira',
          ],
        },
        {
          client: 'French Alternative Energies and Atomic Energy Commission',
          logos: [`${L}cea-logo-mono.svg`],
          role: '.NET Developer',
          period: 'Apr 2023 — Dec 2025',
          bullets: [
            'Maintenance portfolio of 70+ web applications, across build and run.',
            'CI/CD with Azure DevOps, SonarQube quality gates and unit testing.',
            'Legacy (.NET 4.8, Razor, Kendo UI) and modern (.NET 8) stacks.',
            'IS modernization: SQL Server 2014 → 2019 Cluster migration, Serilog / ELK logging.',
          ],
          tags: [
            'C#',
            '.NET 8',
            'Entity Framework',
            'Azure DevOps',
            'SonarQube',
            'SQL Server',
            'IIS',
            'Keycloak',
            'ELK',
          ],
        },
      ],
    },
    {
      name: 'Capgemini',
      logo: `${L}capgemini-logo-mono.svg`,
      logoIsName: true,
      kind: 'IT services',
      period: 'Nov 2019 — Mar 2023',
      missions: [
        {
          client: 'EDF — GEMODO project',
          logos: [`${L}edf-logo-mono.svg`],
          role: 'Backend & PL/SQL Developer',
          period: 'Jun 2021 — Mar 2023',
          bullets: [
            'Java / KornShell backend development on RedHat Linux and Informatica ETL workflows.',
            'PL/SQL procedures validating data syntax and semantics against business rules.',
            'Automated data injection with UFT (VBScript).',
          ],
          tags: [
            'Java',
            'PL/SQL',
            'Oracle',
            'Informatica',
            'Control-M',
            'Jenkins',
            'RedHat Linux',
            'SAFe',
          ],
        },
        {
          client: 'EDF — DPA application (MES)',
          logos: [`${L}edf-logo-mono.svg`],
          role: 'Architecture Migration & Performance Testing',
          period: 'Jun 2020 — Jun 2021',
          bullets: [
            'Led the upgrade of DPA, an MES preventing SPC drifts: migration from 4 to 5 servers.',
            'Switched data sources from legacy ODBC connections to a modern MES (Hadoop Espadon).',
            'Load testing to validate performance in Near Real-Time mode.',
          ],
          tags: ['Hadoop', 'SQL Server', 'PowerShell', 'Windows Server', 'HP ALM', 'Aspentech'],
        },
        {
          client: 'EDF & Rio Tinto — MES team',
          logos: [`${L}edf-logo-mono.svg`, `${L}rio-tinto-logo-mono.svg`],
          role: 'Software Developer',
          period: 'Nov 2019 — May 2020',
          bullets: [
            'MES proofs of concept and redesign of the Rio Tinto mobile interface.',
            'CI/CD test automation pipelines on hybrid Linux / Windows environments.',
          ],
          tags: ['Angular 6', 'Ionic 3', 'GitLab', 'Jenkins', 'Selenium'],
        },
      ],
    },
  ],
  internship: {
    company: 'Cerberis',
    client: 'Cerberis',
    logos: [],
    role: 'Software Developer (internship)',
    period: 'Apr — Sep 2019',
    bullets: [
      'SaaS daemon integrating Microsoft Exchange in .NET (Office 365 APIs, OAuth 2.0 / OpenID Connect), deployed on Azure.',
    ],
    tags: ['.NET', 'Azure', 'Cosmos DB', 'Office 365 API'],
  },
  industry: [
    {
      company: 'ST Microelectronics',
      logo: `${L}st-microelectronics-mono.svg`,
      period: '2005 — 2018',
      role: 'Process technician, then maintenance technician',
      text: 'Dry etching (LAM Research, TEL) on 200 mm wafers, TPM approach and Lean culture. Contributed to productivity gains during the 2008 crisis.',
    },
    {
      company: 'Canalog',
      logo: `${L}becton-dickinson-mono.svg`,
      period: '2005',
      role: 'Wiring assembler',
      text: 'Glass syringe manufacturing machines for the pharmaceutical industry.',
    },
    {
      company: '68th African Artillery Regiment',
      logo: `${L}armee-de-terre-mono.svg`,
      period: '2001',
      role: 'IT assistant (military service)',
      text: 'Digitized vehicle maintenance logs and built VBA macros.',
    },
  ],
  skills: [
    {
      group: '.NET & backend',
      items: ['C#', '.NET 8 / 4.8', 'ASP.NET', 'Entity Framework', 'Dapper', 'Java'],
    },
    { group: 'Data', items: ['SQL Server', 'Oracle', 'PL/SQL', 'Informatica', 'Cosmos DB'] },
    {
      group: 'DevOps & quality',
      items: ['Azure DevOps', 'GitLab CI', 'Jenkins', 'SonarQube', 'Selenium', 'ELK'],
    },
    { group: 'Front', items: ['Angular', 'TypeScript', 'JavaScript', 'Kendo UI'] },
    { group: 'Systems', items: ['Windows Server', 'IIS', 'RedHat Linux'] },
    { group: 'AI', items: ['GitHub Copilot', 'Claude Code'] },
  ],
  learning: {
    label: 'Expert DevOps program',
    items: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'AWS / Azure'],
  },
  projects: [
    {
      name: 'IFTTT-Trading',
      text: 'Non-custodial Solana swap automation driven by conditional rules. MVP consolidated with a full DevOps ecosystem: Ansible provisioning, GitLab CI/CD, Prometheus / Grafana monitoring, Vault secrets, S3 backups.',
      tags: [
        'Angular 18',
        'NestJS',
        'PostgreSQL',
        'Docker Compose',
        'Ansible',
        'GitLab CI',
        'Prometheus',
        'Vault',
      ],
    },
    {
      name: 'Dictée universelle',
      text: 'System-wide voice dictation for Windows: global hotkey, transcription via the OpenAI API, auto-paste into the focused field. Open source (MIT), signed releases.',
      tags: ['.NET 10', 'WPF', 'NAudio', 'OpenAI API', 'GitHub Actions'],
    },
    {
      name: 'BioRoutine',
      text: 'Health dashboard used daily (Huawei Health, Strava, nutrition) with a voice-driven AI assistant (Claude) and a companion Android app published on Google Play.',
      tags: ['Next.js', 'Fastify', 'React Native', 'Kotlin', 'n8n', 'Claude API'],
    },
    {
      name: 'Claude Visual Code',
      text: 'Voice-first mobile client for Claude Code: dictate intent from Android, watch the work in real time, browse files and use the terminal.',
      tags: ['Flutter', 'Dart', 'code-server', 'VS Code API', 'SSH'],
    },
  ],
  education: [
    {
      year: '2026',
      title: 'Expert DevOps — RNCP level 7',
      school: 'OpenClassrooms',
      note: 'in progress',
    },
    {
      year: '2019',
      title: 'Software Designer & Developer (French professional title)',
      school: 'AFPA, Grenoble',
    },
    {
      year: '2003',
      title: 'DUT GEII — Electrical Eng. & Industrial Computing',
      school: 'Université Joseph Fourier, Grenoble',
    },
  ],
  earlyEducation:
    '1996 — 1999 · Scientific Baccalaureate (with honours), preparatory class PCSI, DEUG, IUP MAI',
  languages: [
    { name: 'French', level: 'native' },
    { name: 'English', level: 'B2' },
  ],
  interests: ['Skiing', 'Downhill & enduro MTB', 'Hiking', 'FPS video games'],
};

export const CV: Record<Lang, CvContent> = { fr, en };
