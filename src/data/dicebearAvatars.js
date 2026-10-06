/**
 * 60 Avatars Cartoon & Tech officiels générés via l'API DiceBear 7.x
 * Couvrant 6 collections thématiques (Aventuriers, Robots/IA, Portraits Lorelei, Cartoons Avataaars, Art Vectoriel Micah, Emojis Fun)
 */

export const DICEBEAR_CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'shadows', label: '🛡️ Hackers & Shadows' },
  { id: 'adventurer', label: 'Aventuriers' },
  { id: 'bottts', label: 'Robots & IA' },
  { id: 'lorelei', label: 'Portraits Lorelei' },
  { id: 'avataaars', label: 'Cartoons' },
  { id: 'micah', label: 'Art Vectoriel' },
  { id: 'fun-emoji', label: 'Emojis & Fun' }
];

export const DICEBEAR_AVATARS = [
  // 1. Collection Adventurer (Aventuriers)
  {
    id: 'adv-koffi',
    name: 'Koffi',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Koffi&backgroundColor=b6e3f4,c0aede,d1d4f9'
  },
  {
    id: 'adv-amina',
    name: 'Amina',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Amina&backgroundColor=ffd5dc,ffdfbf,d1d4f9'
  },
  {
    id: 'adv-malik',
    name: 'Malik',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Malik&backgroundColor=b6e3f4,ffd5dc'
  },
  {
    id: 'adv-zola',
    name: 'Zola',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zola&backgroundColor=c0aede,ffdfbf'
  },
  {
    id: 'adv-kwame',
    name: 'Kwame',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kwame&backgroundColor=d1d4f9,b6e3f4'
  },
  {
    id: 'adv-fatou',
    name: 'Fatou',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Fatou&backgroundColor=ffd5dc,c0aede'
  },
  {
    id: 'adv-tariq',
    name: 'Tariq',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tariq&backgroundColor=ffdfbf,b6e3f4'
  },
  {
    id: 'adv-nia',
    name: 'Nia',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nia&backgroundColor=ffd5dc,d1d4f9'
  },
  {
    id: 'adv-idrissa',
    name: 'Idrissa',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Idrissa&backgroundColor=c0aede,b6e3f4'
  },
  {
    id: 'adv-chimamanda',
    name: 'Chimamanda',
    category: 'adventurer',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chimamanda&backgroundColor=ffdfbf,ffd5dc'
  },

  // 2. Collection Bottts (Robots & IA)
  {
    id: 'bot-cyberdev',
    name: 'CyberDev',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberDev&backgroundColor=b6e3f4,c0aede'
  },
  {
    id: 'bot-bitbot',
    name: 'BitBot',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=BitBot&backgroundColor=d1d4f9,ffd5dc'
  },
  {
    id: 'bot-afrobot',
    name: 'AfroBot',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AfroBot&backgroundColor=b6e3f4,ffdfbf'
  },
  {
    id: 'bot-neural',
    name: 'Neural',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neural&backgroundColor=c0aede,d1d4f9'
  },
  {
    id: 'bot-quantum',
    name: 'Quantum',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum&backgroundColor=ffd5dc,b6e3f4'
  },
  {
    id: 'bot-rustacean',
    name: 'Rustacean',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rustacean&backgroundColor=ffdfbf,c0aede'
  },
  {
    id: 'bot-sparky',
    name: 'Sparky',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sparky&backgroundColor=b6e3f4,d1d4f9'
  },
  {
    id: 'bot-neo',
    name: 'Neo',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neo&backgroundColor=c0aede,ffd5dc'
  },
  {
    id: 'bot-nexus',
    name: 'Nexus',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus&backgroundColor=d1d4f9,ffdfbf'
  },
  {
    id: 'bot-pixel',
    name: 'Pixel',
    category: 'bottts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=ffd5dc,b6e3f4'
  },

  // 3. Collection Lorelei (Portraits modernes & élégants)
  {
    id: 'lor-nala',
    name: 'Nala',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Nala&backgroundColor=ffd5dc,d1d4f9'
  },
  {
    id: 'lor-tendai',
    name: 'Tendai',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Tendai&backgroundColor=b6e3f4,ffdfbf'
  },
  {
    id: 'lor-aissa',
    name: 'Aïssa',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Aissa&backgroundColor=c0aede,ffd5dc'
  },
  {
    id: 'lor-chidi',
    name: 'Chidi',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Chidi&backgroundColor=d1d4f9,b6e3f4'
  },
  {
    id: 'lor-ousmane',
    name: 'Ousmane',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Ousmane&backgroundColor=ffdfbf,c0aede'
  },
  {
    id: 'lor-mariam',
    name: 'Mariam',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Mariam&backgroundColor=ffd5dc,b6e3f4'
  },
  {
    id: 'lor-kenzo',
    name: 'Kenzo',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Kenzo&backgroundColor=b6e3f4,c0aede'
  },
  {
    id: 'lor-thabo',
    name: 'Thabo',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Thabo&backgroundColor=c0aede,d1d4f9'
  },
  {
    id: 'lor-diallo',
    name: 'Diallo',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Diallo&backgroundColor=ffdfbf,ffd5dc'
  },
  {
    id: 'lor-esi',
    name: 'Esi',
    category: 'lorelei',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Esi&backgroundColor=d1d4f9,b6e3f4'
  },

  // 4. Collection Avataaars (Cartoons avec accessoires)
  {
    id: 'ava-jeanluc',
    name: 'Jean-Luc',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JeanLuc&backgroundColor=b6e3f4,c0aede'
  },
  {
    id: 'ava-bintou',
    name: 'Bintou',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bintou&backgroundColor=ffd5dc,ffdfbf'
  },
  {
    id: 'ava-samuel',
    name: 'Samuel',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel&backgroundColor=d1d4f9,b6e3f4'
  },
  {
    id: 'ava-aisha',
    name: 'Aïsha',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha&backgroundColor=c0aede,ffd5dc'
  },
  {
    id: 'ava-femi',
    name: 'Femi',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Femi&backgroundColor=ffdfbf,b6e3f4'
  },
  {
    id: 'ava-sekou',
    name: 'Sékou',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sekou&backgroundColor=b6e3f4,d1d4f9'
  },
  {
    id: 'ava-keisha',
    name: 'Keisha',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Keisha&backgroundColor=ffd5dc,c0aede'
  },
  {
    id: 'ava-youssef',
    name: 'Youssef',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef&backgroundColor=c0aede,ffdfbf'
  },
  {
    id: 'ava-nana',
    name: 'Nana',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nana&backgroundColor=d1d4f9,ffd5dc'
  },
  {
    id: 'ava-bakary',
    name: 'Bakary',
    category: 'avataaars',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bakary&backgroundColor=ffdfbf,b6e3f4'
  },

  // 5. Collection Micah (Art Vectoriel épuré)
  {
    id: 'mic-kimi',
    name: 'Kimi',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Kimi&backgroundColor=c0aede,b6e3f4'
  },
  {
    id: 'mic-senam',
    name: 'Senam',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Senam&backgroundColor=d1d4f9,ffd5dc'
  },
  {
    id: 'mic-yara',
    name: 'Yara',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Yara&backgroundColor=b6e3f4,ffdfbf'
  },
  {
    id: 'mic-ade',
    name: 'Ade',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Ade&backgroundColor=ffd5dc,c0aede'
  },
  {
    id: 'mic-salim',
    name: 'Salim',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Salim&backgroundColor=ffdfbf,d1d4f9'
  },
  {
    id: 'mic-maya',
    name: 'Maya',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Maya&backgroundColor=c0aede,b6e3f4'
  },
  {
    id: 'mic-tunde',
    name: 'Tunde',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Tunde&backgroundColor=d1d4f9,ffdfbf'
  },
  {
    id: 'mic-alika',
    name: 'Alika',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Alika&backgroundColor=ffd5dc,b6e3f4'
  },
  {
    id: 'mic-juma',
    name: 'Juma',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Juma&backgroundColor=b6e3f4,c0aede'
  },
  {
    id: 'mic-desta',
    name: 'Desta',
    category: 'micah',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=Desta&backgroundColor=ffdfbf,ffd5dc'
  },

  // 6. Collection Fun Emoji (Personnages & Emojis Développeurs)
  {
    id: 'fun-happy',
    name: 'Happy Coder',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappyCoder&backgroundColor=ffdfbf,ffd5dc'
  },
  {
    id: 'fun-cloud',
    name: 'Cloud Genius',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CloudGenius&backgroundColor=b6e3f4,c0aede'
  },
  {
    id: 'fun-term',
    name: 'Terminal Guru',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=TerminalGuru&backgroundColor=d1d4f9,b6e3f4'
  },
  {
    id: 'fun-hack',
    name: 'Hack Master',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HackMaster&backgroundColor=ffd5dc,ffdfbf'
  },
  {
    id: 'fun-bug',
    name: 'Bug Hunter',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=BugHunter&backgroundColor=c0aede,ffd5dc'
  },
  {
    id: 'fun-coffee',
    name: 'Coffee Dev',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CoffeeDev&backgroundColor=ffdfbf,b6e3f4'
  },
  {
    id: 'fun-algo',
    name: 'Algo Pro',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=AlgoPro&backgroundColor=b6e3f4,d1d4f9'
  },
  {
    id: 'fun-data',
    name: 'Data Wizard',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=DataWizard&backgroundColor=c0aede,b6e3f4'
  },
  {
    id: 'fun-byte',
    name: 'Byte Boss',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=ByteBoss&backgroundColor=d1d4f9,ffdfbf'
  },
  {
    id: 'fun-stack',
    name: 'Stack Over',
    category: 'fun-emoji',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=StackOver&backgroundColor=ffd5dc,c0aede'
  },

  // 7. Collection Shadows (Hackers & Cybersécurité DiceBear 10.x)
  {
    id: 'shadow-felix',
    name: 'Felix Cyber',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=Felix'
  },
  {
    id: 'shadow-hacker',
    name: 'Hacker Pro',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=Hacker'
  },
  {
    id: 'shadow-cipher',
    name: 'Cipher',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=Cipher'
  },
  {
    id: 'shadow-phantom',
    name: 'Phantom',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=Phantom'
  },
  {
    id: 'shadow-zeroday',
    name: 'ZeroDay',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=ZeroDay'
  },
  {
    id: 'shadow-root',
    name: 'Root / Admin',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=Root'
  },
  {
    id: 'shadow-ghost',
    name: 'GhostSec',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=Ghost'
  },
  {
    id: 'shadow-cybersec',
    name: 'CyberSec',
    category: 'shadows',
    url: 'https://api.dicebear.com/10.x/shadows/svg?seed=CyberSec'
  }
];

export const AVATAR_PRESETS = DICEBEAR_AVATARS.map(a => a.url);
