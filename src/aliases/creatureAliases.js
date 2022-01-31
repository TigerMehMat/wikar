let aliases = {
    "аллозавр": "allosaurus",
    "карнотавр": "carnotaurus",
    "компсогнат": "compy",
    "компи": "compy",
    "дилофозавр": "dilophosaur",
    "гиганотозавр": "giganotosaurus",
    "гигантозавр": "giganotosaurus",
    "гига": "giganotosaurus",
    "мегалозавр": "megalosaurus",
    "микрораптор": "microraptor",
    "овираптор": "oviraptor",
    "раптор": "raptor",
    "тираннозавр": "rex",
    "рекс": "rex",
    "рэкс": "rex",
    "спинозавр": "spinosaur",
    "троодон": "troodon",
    "бесячий": "troodon",
    "велоназавр": "velonasaur",
    "велик": "velonasaur",
    "ютираннус": "yutyrannus",
    "ютик": "yutyrannus",
    "анкилозавр": "ankylosaurus",
    "анкила": "ankylosaurus",
    "бронтозавр": "brontosaurus",
    "диплодок": "diplodocus",
    "автобус": "diplodocus",
    "троллейбус": "diplodocus",
    "галлимим": "gallimimus",
    "игуанодон": "iguanodon",
    "кентрозавр": "kentrosaurus",
    "морелатопс": "morellatops",
    "верблюд": "morellatops",
    "пахицефалозавр": "pachy",
    "пахи": "pachy",
    "пахиринозавр": "pachyrhinosaurus",
    "паразауролоф": "parasaur",
    "паразавр": "parasaur",
    "пегомастакс": "pegomastax",
    "гопник": "pegomastax",
    "стегозавр": "stegosaurus",
    "теризинозавр": "therizinosaurus",
    "терезинозавр": "therizinosaurus",
    "теризина": "therizinosaurus",
    "терезина": "therizinosaurus",
    "титанозавр": "titanosaur",
    "трицератопс": "triceratops",
    "трайк": "triceratops",
    "барионикс": "baryonyx",
    "базилозавр": "basilosaurus",
    "диметродон": "dimetrodon",
    "лютоволк": "direwolf",
    "волк": "direwolf",
    "гиенодон": "hyaenodon",
    "гиена": "hyaenodon",
    "пурловия": "purlovia",
    "кротокрыс": "rollrat",
    "крыса": "rollrat",
    "саблезуб": "sabertooth",
    "тигр": "sabertooth",
    "сумчатыйлев": "thylacoleo",
    "лев": "thylacoleo",
    "кастороидес": "castoroides",
    "кастероидес": "castoroides",
    "бобр": "castoroides",
    "бобер": "castoroides",
    "бобёр": "castoroides",
    "халикотерий": "chalicotherium",
    "дедикурус": "doedicurus",
    "колобок": "doedicurus",
    "эквус": "equus",
    "конь": "equus",
    "лошадь": "equus",
    "гигантопитек": "gigantopithecus",
    "тушканчик": "jerboa",
    "листрозавр": "lystrosaurus",
    "листожуй": "lystrosaurus",
    "мамонт": "mammoth",
    "большерогийолень": "megaloceros",
    "мегалоцерос": "megaloceros",
    "олень": "megaloceros",
    "овис": "ovis",
    "баран": "ovis",
    "овца": "ovis",
    "овечка": "ovis",
    "барашек": "ovis",
    "парацератерий": "paracer",
    "фиомия": "phiomia",
    "прокоптодон": "procoptodon",
    "кенгуру": "procoptodon",
    "шерстистыйносорог": "woollyrhino",
    "носорог": "woollyrhino",
    "деодон": "daeodon",
    "кабан": "daeodon",
    "свирепыймедведь": "direbear",
    "медведь": "direbear",
    "мегатерий": "megatherium",
    "мезопитек": "mesopithecus",
    "мосхопс": "moschops",
    "морж": "moschops",
    "тюлень": "moschops",
    "оник": "onyc",
    "выдра": "otter",
    "жаба": "beelzebufo",
    "карбонемис": "carbonemys",
    "черепаха": "carbonemys",
    "диплокаулус": "diplocaulus",
    "бактерия": "diplocaulus",
    "капрозух": "kaprosuchus",
    "мегалания": "megalania",
    "саркозух": "sarco",
    "шипастыйдракон": "thornydragon",
    "шипохвост": "thornydragon",
    "титанобоа": "titanoboa",
    "змея": "titanoboa",
    "ихтиозавр": "ichthyosaurus",
    "дельфин": "ichthyosaurus",
    "лиоплеврадон": "liopleurodon",
    "лиоплевродон": "liopleurodon",
    "плезиозавр": "plesiosaur",
    "диморфодон": "dimorphodon",
    "птеранодон": "pteranodon",
    "кетцалькоатль": "quetzal",
    "тапежара": "tapejara",
    "додо": "dodo",
    "курица": "dodo",
    "петух": "dodo",
    "гесперорнис": "hesperornis",
    "кайруку": "kairuku",
    "пингвин": "kairuku",
    "ужаснаяптица": "terrorbird",
    "археоптерикс": "archaeopteryx",
    "аргентавис": "argentavis",
    "орёл" : "argentavis",
    "орел" : "argentavis",
    "ихтиорнис": "ichthyornis",
    "пелагорнис": "pelagornis",
    "снежнаясова": "snowowl",
    "сова": "snowowl",
    "гриф": "vulture",
    "удильщик": "angler",
    "целакант": "coelacanth",
    "дунклеостей": "dunkleosteus",
    "электрофорус": "electrophorus",
    "угорь": "electrophorus",
    "лидсихтис": "leedsichthys",
    "лида": "leedsichthys",
    "кит": "leedsichthys",
    "манта": "manta",
    "скат": "manta",
    "мегалодон": "megalodon",
    "акула": "megalodon",
    "пиранья": "piranha",
    "ахатина": "achatina",
    "улитка": "achatina",
    "богомол": "mantis",
    "мантис": "mantis",
    "скорпион": "pulmonoscorpius",
    "аранео": "araneo",
    "паук": "araneo",
    "артроплевра": "arthropluera",
    "скарабей": "dungbeetle",
    "гигантскаяпчела": "giantbee",
    "пчела": "giantbee",
    "шелкопряд": "lymantria",
    "бабочка": "lymantria",
    "лимантрия": "lymantria",
    "тусик": "tusoteuthis",
    "тусотеутис": "tusoteuthis",
    "кальмар": "tusoteuthis",
    "кракен": "tusoteuthis",
    "лампадог": "bulbdog",
    "бульдог": "bulbdog",
    "лучехвост": "glowtail",
    "ящерица": "glowtail",
    "ящерка": "glowtail",
    "опустошитель": "ravager",
    "равагер": "ravager",
    "горныйэлементаль": "rockelemental",
    "горныйголем": "rockelemental",
    "каменныйголем": "rockelemental",
    "голем": "rockelemental",
    "меловойголем": "chalkgolem",
    "ледянойголем": "icegolem",
    "снежныйголем": "icegolem",
    "камушек": "rockelemental",
    "булыжник": "rockelemental",
    "камень": "rockelemental",
    "глыба": "rockelemental",
    "светорог": "shinehorn",
    "козлик": "shinehorn",
    "единорог": "equus",
    "василиск": "basilisk",
    "яснокрыл": "featherlight",
    "гача": "gacha",
    "газбагс": "gasbags",
    "грифон": "griffin",
    "манагарм": "managarmr",
    "манагармр": "managarmr",
    "феникс": "phoenix",
    "скальныйдрейк": "rockdrake",
    "дрейк": "rockdrake",
    "виверна": "wyvern",
    "вива": "wyvern",
    "огненнаявиверна": "wyvern",
    "леснаявиверна": "wyvern",
    "ледянаявиверна": "icewyvern",
    "грозоваявиверна": "wyvern",
    "ядовитаявиверна": "wyvern",
    "каркинос": "karkinos",
    "фигнянапалочках": "karkinos",
    "краб": "karkinos",
    "инфорсер": "enforcer",
    "мех": "mek",
    "мегамех": "megamek",
    "разведчик": "scout",
    "жнец": "reaper",
    "корольжнец": "reaper",
    "рипер": "reaper",
    "мозазавр": "mosasaurus",
    "мозик": "mosasaurus",
    "аммонит": "ammonite",
    "книдария": "cnidaria",
    "медуза": "cnidaria",
    "эвриптерид": "eurypterid",
    "ракоскорпион": "eurypterid",
    "пиявка": "leech",
    "меганевра": "meganeura",
    "стрекоза": "meganeura",
    "саблезубыйлосось": "Sabertooth_Salmon",
    "лосось": "Sabertooth_Salmon",
    "титаномуравей": "titanomyrma",
    "муравей": "titanomyrma",
    "трилобит": "trilobite",
    "триллобит": "trilobite",
    "червьсмерти": "deathworm",
    "жуккувшинчик": "jugbug",
    "водянойжук": "jugbug",
    "нефтянойжук": "jugbug",
    "светлячок": "glowbug",
    "светляк": "glowbug",
    "минога": "lamprey",
    "безымянный": "nameless",
    "искатель": "seeker",
    "полярныймедведь": "polarbear",
    "дейноних": "deinonychus",
};

module.exports = aliases;