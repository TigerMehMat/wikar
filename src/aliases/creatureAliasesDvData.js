let aliases = {
	'snail': 'achatina',
	'allo': 'allosaurus',
	'allosaur': 'allosaurus',
	'alphacarno': 'alphacarnotaurus',
	'alphacarnotaur': 'alphacarnotaurus',
	'alphaleeds': 'alphaleedsichthys',
	'alphamega': 'alphamegalodon',
	'alphamosa': 'alphamosasaurus',
	'alphamosasaur': 'alphamosasaurus',
	'alpharex': 'alphatrex',
	'alphawyvern': 'alphafirewyvern',
	'alphatuso': 'alphatusoteuthis',
	'anglerfish': 'angler',
	'anky': 'ankylosaurus',
	'ankylo': 'ankylosaurus',
	'ankylosaur': 'ankylosaurus',
	'araneo': 'araneomorphus',
	'spider': 'araneomorphus',
	'archa': 'archaeopteryx',
	'argent': 'argentavis',
	'arthropleura': 'arthropluera',
	'basil': 'basilosaurus',
	'basilosaur': 'basilosaurus',
	'whale': 'basilosaurus',
	'beelze': 'beelzebufo',
	'frog': 'beelzebufo',
	'toad': 'beelzebufo',
	'bonewyvern': 'bonefirewyvern',
	'skeletalwyvern': 'bonefirewyvern',
	'skeletaljerboa': 'bonejerboa',
	'bronto': 'brontosaurus',
	'brontosaur': 'brontosaurus',
	'sauropod': 'brontosaurus',
	'broodmotherlysrix': 'broodmotherlysrix',
	'broodmothereasy': 'broodmotherlysrixgamma',
	'broodmothergamma': 'broodmotherlysrixgamma',
	'broodmotherlysrixeasy': 'broodmotherlysrixgamma',
	'broodmothermedium': 'broodmotherlysrixbeta',
	'broodmotherlysrixmedium': 'broodmotherlysrixbeta',
	'broodmotherhard': 'broodmotherlysrixalpha',
	'broodmotheralpha': 'broodmotherlysrixalpha',
	'bunnyovi': 'bunnyoviraptor',
	'turtle': 'carbonemys',
	'carno': 'carnotaurus',
	'carnotaur': 'carnotaurus',
	'beaver': 'castoroides',
	'chalico': 'chalicotherium',
	'jelly': 'cnidaria',
	'jellyfish': 'cnidaria',
	'coel': 'coelacanth',
	'compy': 'compsognathus',
	'defenseunitgammaoverseerarena': 'defenseunit',
	'dilo': 'dilophosaurus',
	'dilophosaur': 'dilophosaurus',
	'dimorph': 'dimorphodon',
	'bear': 'direbear',
	'wolf': 'direwolf',
	'doed': 'doedicurus',
	'thedragon': 'dragon',
	'dragoneasy': 'dragon',
	'dragonmedium': 'dragonbeta',
	'dragonhard': 'dragonalpha',
	'beetle': 'dungbeetle',
	'dunkle': 'dunkleosteus',
	'eel': 'electrophorus',
	'electro': 'electrophorus',
	'horse': 'equus',
	'euryp': 'eurypterid',
	'galli': 'gallimimus',
	'kingtitan': 'gammakingtitan',
	'bee': 'giantbee',
	'giga': 'giganotosaurus',
	'giganotosaur': 'giganotosaurus',
	'gigantosaur': 'giganotosaurus',
	'gigantosaurus': 'giganotosaurus',
	'bigfoot': 'gigantopithecus',
	'hesper': 'hesperornis',
	'duck': 'hesperornis',
	'hyena': 'hyaenodon',
	'seagull': 'ichthyornis',
	'ichthy': 'ichthyosaurus',
	'ichthyosaur': 'ichthyosaurus',
	'dolphin': 'ichthyosaurus',
	'penguin': 'kairuku',
	'kapro': 'kaprosuchus',
	'kentro': 'kentrosaurus',
	'kentrosaur': 'kentrosaurus',
	'moth': 'lymantria',
	'leeds': 'leedsichthys',
	'lystro': 'lystrosaurus',
	'lystrosaur': 'lystrosaurus',
	'manticoreeasy': 'manticoregamma',
	'manticoremedium': 'manticorebeta',
	'manticorehard': 'manticorealpha',
	'mantaray': 'manta',
	'stag': 'megaloceros',
	'shark': 'megalodon',
	'megalosaur': 'megalosaurus',
	'dragonfly': 'meganeura',
	'piranha': 'megapiranha',
	'megapithecuseasy': 'megapithecusgamma',
	'megapithecusmedium': 'megapithecusbeta',
	'megapithecushard': 'megapithecusalpha',
	'monkey': 'mesopithecus',
	'micro': 'microraptor',
	'camelsaurus': 'morellatops',
	'mosa': 'mosasaurus',
	'mosasaur': 'mosasaurus',
	'onyc': 'onychonycteris',
	'bat': 'onychonycteris',
	'overseereasy': 'overseergamma',
	'overseermedium': 'overseerbeta',
	'overseerhard': 'overseeralpha',
	'ovi': 'oviraptor',
	'ovisaries': 'ovis',
	'sheep': 'ovis',
	'pachy': 'pachycephalosaurus',
	'pachycephalosaur': 'pachycephalosaurus',
	'pachyrhino': 'pachyrhinosaurus',
	'pachyrhinosaur': 'pachyrhinosaurus',
	'paracer': 'paraceratherium',
	'parasaur': 'parasaurolophus',
	'bionicparasaur': 'tekparasaur',
	'bionicparasaurolophus': 'tekparasaur',
	'tekparasaurolophus': 'tekparasaur',
	'pego': 'pegomastax',
	'pela': 'pelagornis',
	'plesio': 'plesiosaur',
	'plesiosaurus': 'plesiosaur',
	'kangaroo': 'procoptodon',
	'ptera': 'pteranodon',
	'ptero': 'pteranodon',
	'pterosaur': 'pteranodon',
	'pulminoscorpius': 'pulmonoscorpius',
	'scorpion': 'pulmonoscorpius',
	'quetz': 'quetzalcoatlus',
	'quetzal': 'quetzalcoatlus',
	'quetzalcoatl': 'quetzalcoatlus',
	'bionicquetzal': 'tekquetzal',
	'bionicquetzalcoatlus': 'tekquetzal',
	'tekquetzalcoatlus': 'tekquetzal',
	'utahraptor': 'raptor',
	'bionicraptor': 'tekraptor',
	'bionicutahraptor': 'tekraptor',
	'tekutahraptor': 'tekraptor',
	'trex': 'rex',
	'tyrannosaur': 'rex',
	'tyrannosaurus': 'rex',
	'tyrannosaurusrex': 'rex',
	'bionicrex': 'tekrex',
	'bionictrex': 'tekrex',
	'rockgolem': 'rockelemental',
	'rockwelleasy': 'rockwellgamma',
	'rockwellmedium': 'rockwellbeta',
	'rockwellhard': 'rockwellalpha',
	'saber': 'sabertooth',
	'sabre': 'sabertooth',
	'sabretooth': 'sabertooth',
	'sabretoothsalmon': 'sabertoothsalmon',
	'salmon': 'sabertoothsalmon',
	'sarco': 'sarcosuchus',
	'skeletalbronto': 'skeletalbrontosaurus',
	'skeletalcarno': 'skeletalcarnotaurus',
	'skeletalgiga': 'skeletalgiganotosaurus',
	'skeletalquetzal': 'skeletalquetzalcoatlus',
	'skeletalstego': 'skeletalstegosaurus',
	'skeletaltrike': 'skeletaltriceratops',
	'spino': 'spinosaurus',
	'spinosaur': 'spinosaurus',
	'stego': 'stegosaurus',
	'stegosaur': 'stegosaurus',
	'bionicstego': 'tekstegosaurus',
	'bionicstegosaur': 'tekstegosaurus',
	'tekstego': 'tekstegosaurus',
	'tekstegosaur': 'tekstegosaurus',
	'turkey': 'superturkey',
	'tape': 'tapejara',
	'therizino': 'therizinosaurus',
	'therizinosaur': 'therizinosaurus',
	'spinylizard': 'thornydragon',
	'spineylizard': 'thornydragon',
	'titanboa': 'titanoboa',
	'snake': 'titanoboa',
	'titanomyrma': 'titanomyrmadrone',
	'ant': 'titanomyrmadrone',
	'flyingant': 'titanomyrmasoldier',
	'titanosaurus': 'titanosaur',
	'trike': 'triceratops',
	'tuso': 'tusoteuthis',
	'squid': 'tusoteuthis',
	'mammoth': 'woollymammoth',
	'rhino': 'woollyrhinoceros',
	'rhinoceros': 'woollyrhinoceros',
	'woollyrhino': 'woollyrhinoceros',
	'yuty': 'yutyrannus',
	'zombiedodo': 'zomdodo',
};

module.exports = aliases;