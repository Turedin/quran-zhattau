/* ===================== Құран жаттау — қолданба логикасы ===================== */

/* ---------- XSS қорғанысы: барлық динамикалық мәтін осы арқылы өтеді ---------- */
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- Кәсіби SVG таңбашалар (эмодзисіз) ---------- */
const ICONS = {
  home:'<path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.4V20h13V9.4"/>',
  book:'<path d="M12 5.5C9.6 4 5.2 4 3.6 4.7V19c1.6-.7 6-.7 8.4.8"/><path d="M12 5.5C14.4 4 18.8 4 20.4 4.7V19c-1.6-.7-6-.7-8.4.8"/><path d="M12 5.5V20"/>',
  letters:'<path d="M4 5h7"/><path d="M7.5 5v2c0 3-1.4 5-4 6.2"/><path d="M5 11.4c1.8 2 4 2.6 5.6 2.6"/><path d="M13 19l3.5-8 3.5 8"/><path d="M14.4 16h4.2"/>',
  chart:'<path d="M5 20V11"/><path d="M12 20V5"/><path d="M19 20v-6"/><path d="M3.5 20h17"/>',
  sliders:'<path d="M4 7h9"/><path d="M17 7h3"/><circle cx="15" cy="7" r="2"/><path d="M4 17h3"/><path d="M11 17h9"/><circle cx="9" cy="17" r="2"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 14.4A8 8 0 1 1 9.6 4 6.5 6.5 0 0 0 20 14.4z"/>',
  auto:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.3-3.3"/>',
  play:'<path d="M7 5.5v13l11-6.5z"/>',
  check:'<path d="M4 12.5 9 17.5 20 6.5"/>',
  star:'<path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.2-4.1 5.8-.8z"/>',
  crescent:'<path d="M17 4.5a8 8 0 1 0 3.5 13A6.6 6.6 0 0 1 17 4.5z"/>',
  flame:'<path d="M12 3c1.2 3 4 4.2 4 8a4 4 0 0 1-8 0c0-1.6.6-2.7 1.4-3.6C9.2 8 9.6 5.4 12 3z"/>',
  trophy:'<path d="M8 4h8v4a4 4 0 0 1-8 0z"/><path d="M8 5H5v1a3 3 0 0 0 3 3"/><path d="M16 5h3v1a3 3 0 0 1-3 3"/><path d="M10 12.4V15h4v-2.6"/><path d="M9 19h6"/><path d="M10 19v-1.4a2 2 0 0 1 4 0V19"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  flag:'<path d="M6 21V4"/><path d="M6 5c3-2 6 2 9 0v7c-3 2-6-2-9 0"/>',
  seed:'<path d="M12 21v-7"/><path d="M12 14c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5z"/>',
  leaf:'<path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"/><path d="M9 15l6-6"/>',
  tree:'<path d="M12 21v-5"/><path d="M8.5 16a4 4 0 0 1-1-7.3 4 4 0 0 1 9 0A4 4 0 0 1 15.5 16z"/>',
  image:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="10" r="1.6"/><path d="m4 17 5-4 4 3 3-2 5 4"/>',
  upload:'<path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M5 20h14"/>',
  close:'<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-.9-.7-1.4-.7-2.4 0-.8.6-1.7 1.7-1.7H17a4 4 0 0 0 4-4C21 5.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="12" cy="7.6" r="1"/><circle cx="16.5" cy="11" r="1"/>'
};
const FILLED = new Set(['play']);
function svgIcon(n, size){ const d = ICONS[n]; if(!d) return ''; const f = FILLED.has(n);
  return '<svg class="ic" viewBox="0 0 24 24" width="'+(size||22)+'" height="'+(size||22)+'" fill="'+(f?'currentColor':'none')+'" stroke="'+(f?'none':'currentColor')+'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>'; }

/* ===================== I18N ===================== */
const T = {
kk:{
 nHome:"Басты", nLearn:"Жаттау", nVocab:"Сөздік", nProg:"Прогресс", nSet:"Баптау",
 streak:"күн қатарынан", ayahs:"аят жатталды", mins:"мин бүгін",
 hProg:"Жалпы прогресс", hCont:"Жалғастыру", noCont:"Әлі бастаған бөлім жоқ — «Жаттау» бетінен бастаңыз",
 contBtn:"Жалғастыру",
 lMode:"Нені жаттаймыз?", mSurah:"Сүре бойынша", mAyah:"Аят бойынша", mPage:"Бет бойынша", mJuz:"Жүз (пара)", mHizb:"Хизб бойынша",
 fSurah:"Сүре", fSurahPick:"Сүрені таңдаңыз", fFrom:"Басталу аяты", fTo:"Аяқталу аяты", fPage:"Бет (1–604)", fJuz:"Жүз (1–30)", fHizb:"Хизб (1–60)",
 go:"Бастау", back:"Артқа", loading:"Жүктелуде...",
 study:"Оқу режимі", toMem:"Жаттауға өту", toQuiz:"Тест тапсыру",
 memT:"Өзін-өзі тексеру", memHint:"Жатқа оқыңыз да, сөзді ашу үшін басыңыз. Қателескен сөзді ҰЗАҚ басыңыз (қызыл болады) — ол әлсіз орындар тізіміне түседі.",
 memDone:"Аяқтау", memRes:(o,e)=>`Ашылды: ${o} сөз, қате: ${e}. ${e===0?"МәшаАллаһ, тамаша!":e<4?"Жақсы! Қателерді қайталаңыз":"Тағы қайталау керек"}`,
 quizT:"Тест", qMissing:"Жоқ сөзді табыңыз:", qNext:"Жалғастырыңыз — келесі аят қайсы?", qScore:(c,t)=>`Дұрыс: ${c}/${t}`,
 qDone:(c,t)=>`Тест бітті! Нәтиже: ${c}/${t}`,
 vT:"Кілт сөздер", vSub:"Құранда жиі кездесетін сөздер мен мағыналары",
 pT:"Жалпы прогресс", pBarTxt:(a,p)=>`${a} аят жатталды — Құранның ${p}%-ы`,
 pCal:"Соңғы 4 апта", pUnits:"Жатталған бөлімдер", pNoUnits:"Әлі жоқ. Бүгін бастаңыз!",
 pWeak:"Әлсіз орындар", pWeakSub:"Өзін-өзі тексеруде қателескен сөздер. Оларды қайта қарап шығыңыз.", pNoWeak:"Қателер жоқ — жарайсыз!",
 sRem:"Күнделікті еске салу", sRemSub:"Белгіленген уақытта браузер хабарландыру жібереді (қосымша ашық тұрғанда немесе фонда).",
 sTime:"Уақыт", remOn:"Қосу", remOk:"Еске салу қосылды", remNo:"Хабарландыруға рұқсат берілмеді",
 sData:"Деректер", exp:"Прогресті көшіру", reset:"Бәрін өшіру", resetQ:"Барлық прогресс өшіріледі. Сенімдісіз бе?",
 about:"Құран жаттау — жеке қолданысқа арналған. Мәтін: alquran.cloud (Хафс ұсынан Асым қираәті). Аудио: Мишари Рашид әл-Афаси. Аудармалар түсінік үшін ғана берілген.",
 unitDone:"Бөлім жатталды деп белгіленді", saved:"Сақталды", copied:"Көшірілді",
 surah:"сүре", page:"бет", juz:"жүз", hizb:"хизб", ayahsW:"аяттар",
 errLoad:"Жүктеу қатесі. Интернетті тексеріңіз.", markDone:"Жатталды деп белгілеу",
 todayDone:"Бүгінгі мақсат орындалды!",
 srsT:"Бүгінгі қайталау", srsNone:"Бүгін қайталау жоқ", srsRem:"Есімде", srsForgot:"Ұмыттым",
 tjBtn:"Тәжуид", tjQal:"қалқала", tjGhu:"ғунна", tjMadd:"мәд", tjNote:"жеңілдетілген режим",
 vcBtn:"Дауыспен тексеру", vcT:"Дауыспен тексеру",
 vcHint:"Микрофон түймесін басып, жатқа оқыңыз — қосымша тыңдап, сөздерді мәтінмен салыстырады. Жасыл — дұрыс, қызыл — қалып қалды. Chrome/Edge және интернет қажет.",
 vcNo:"Бұл браузер дауысты тануды қолдамайды — Chrome қолданыңыз",
 vcListen:"Тыңдап тұрмын... оқи беріңіз", vcStopped:"Тоқтатылды",
 vcRes:(ok,miss)=>`Дұрыс: ${ok}, қалып қалды/қате: ${miss}. ${miss===0?"МәшаАллаһ!":"Қызыл сөздерді қайталаңыз"}`,
 vcRecBtn:"Ұстазға жазу", vcRecStop:"Жазбаны сақтау",
 vcRecHint:"Оқуыңызды аудиоға жазып, файлды ұстазыңызға WhatsApp/Telegram арқылы жіберіңіз.",
 vcRecSaved:"Аудио сақталды — ұстазға жіберіңіз",
 shT:"Ұстаз / топпен бөлісу", shSub:"Прогресіңізді ұстазға немесе жаттау тобына жіберіңіз.", shBtn:"Прогреспен бөлісу",
 shTxt:(a,s,p)=>`Құран жаттау\nЖатталған аяттар: ${a}\nҚатарынан: ${s} күн\nҚұранның ${p}%-ы\nАлла қабыл етсін!`,
 plSetT:"Хатим-жоспар құру", plScope:"Аумақ", plJuzAmma:"Жүз Амма (78–114)", plJuz:"Бір жүз", plAll:"Бүкіл Құран",
 plDays:"Қанша күнге", plMake:"Жоспар құру", plDel:"Жоспарды өшіру",
 plT:"Хатим-жоспар", plNone:"Жоспар жоқ — «Прогресс» бетінде құрыңыз.",
 plDay:(d,n)=>`Күн ${d}/${n}`, plPages:(f,t)=>`Бүгінгі бөлім: ${f}–${t} беттер`,
 plDoneBtn:"Бүгінгісі оқылды", plOpen:"Ашу", plFin:"Жоспар аяқталды!", plBehind:(k)=>`(${k} күн артта)`,
 loopT:"Тыңдап қайталау", loopStart:"Бастау", loopStop:"Тоқтату",
 hintBtn:"Алғашқы сөздер", tafMecca:"Мекке сүресі", tafMedina:"Мәдина сүресі",
 achT:"Жетістіктер", wkT:"Апта статистикасы",
 days:["Дс","Сс","Ср","Бс","Жм","Сб","Жс"],
 ach:{first:"Алғашқы бөлім",a10:"10 аят",a50:"50 аят",a100:"100 аят",a300:"300 аят",s3:"3 күн қатарынан",s7:"7 күн қатарынан",s30:"30 күн қатарынан",quiz:"Мінсіз тест",mem:"Қатесіз тексеру",voice:"Дауыспен тексеру",plan:"Хатим аяқталды"},
 recT:"Қари (аудио оқушы)",
 wtBtn:"Жаттығу", wtT:"Әлсіз сөздер жаттығуы",
 wtHint:"Сөздің қай жерден екенін және аяттың жалғасын еске түсіріңіз. 3 рет қатарынан «Есімде» десеңіз — сөз тізімнен өшеді.",
 wtRem:"Есімде", wtNo:"Ұмыттым", wtDone:"Жаттығу бітті!", wtEmpty:"Әлсіз сөздер жоқ", wtLeft:"қалды",
 grpSub2:"Ұстаз берген топ кодымен қосылыңыз — прогресіңіз бен тилауат жазбаларыңыз ұстазға автоматты түрде жетеді.",
 grpCode:"Топ коды", grpName:"Атыңыз", grpJoin:"Қосылу", grpLeave:"Шығу",
 grpIn:(c)=>`Топ: ${c}`, grpFbT:"Ұстаз пікірі", grpNoFb:"Пікір әлі жоқ",
 grpNeedCfg:"Бұлт бапталмаған — firebase-setup.md нұсқаулығын қараңыз",
 grpSynced:"Синхрондалды", grpUp:"Жазба ұстазға жүктелді", grpErr:"Бұлтқа қосылу сәтсіз",
 cmpT:"Қаримен салыстыру",
 cmpHint:"Осы бөлімді жатқа оқып жазыңыз — қосымша темпіңіз бен кідірістеріңізді таңдалған қари оқуымен салыстырады.",
 cmpStart:"Жазуды бастау", cmpStop:"Тоқтату", cmpWait:"Талдау жүріп жатыр...",
 cmpYou:"Сіз", cmpRef:"Қари", cmpSec:"сек",
 cmpFaster:(p)=>`Сіз қариден ${p}% жылдамсыз — асықпаңыз, тәртілмен оқыңыз`,
 cmpSlower:(p)=>`Сіз қариден ${p}% баяусыз — жаттау кезінде бұл қалыпты`,
 cmpPace:"Темпіңіз қариға жақын — мәшаАллаһ!",
 cmpPauses:(n)=>`Ұзақ кідірістер: ${n}. Кідіріс көп жерде сөз ұмытылып тұруы мүмкін.`,
 cmpErr:"Талдау сәтсіз болды — Chrome қолданып көріңіз",
 sTheme:"Тақырып ( көрініс)", thLight:"Жарық", thDark:"Қараңғы", thAuto:"Авто",
 sBg:"Фон суреті", sBgSub:"Дайын үлгіні таңдаңыз немесе өз суретіңізді жүктеңіз.",
 bgPlain:"Қарапайым", bgUpload:"Сурет жүктеу", bgYour:"Сіздің суретіңіз", bgOpacity:"Айқындылығы",
 vSearchPh:"Сөзді іздеу (қазақша, орысша, араб)...", vModeList:"Тізім", vModeCards:"Жаттау",
 vAll:"Барлығы", vKnow:"Білемін", vRepeat:"Келесі", vFlipHint:"Аударманы көру үшін басыңыз",
 vCardsDone:"Жарайсыз! Барлық карталарды қайталап шықтыңыз.", vEmpty:"Ештеңе табылмады",
 vKnownN:(n)=>`білемін: ${n}`, vWord:"сөз",
 notifTitle:"Құран жаттау"
},
ru:{
 nHome:"Главная", nLearn:"Учить", nVocab:"Словарь", nProg:"Прогресс", nSet:"Настройки",
 streak:"дней подряд", ayahs:"аятов выучено", mins:"мин сегодня",
 hProg:"Общий прогресс", hCont:"Продолжить", noCont:"Вы ещё не начали — зайдите во вкладку «Учить»",
 contBtn:"Продолжить",
 lMode:"Что учим?", mSurah:"По суре", mAyah:"По аятам", mPage:"По страницам", mJuz:"По джузам", mHizb:"По хизбам",
 fSurah:"Сура", fSurahPick:"Выберите суру", fFrom:"Аят с", fTo:"Аят по", fPage:"Страница (1–604)", fJuz:"Джуз (1–30)", fHizb:"Хизб (1–60)",
 go:"Начать", back:"Назад", loading:"Загрузка...",
 study:"Режим чтения", toMem:"К заучиванию", toQuiz:"Пройти тест",
 memT:"Самопроверка", memHint:"Читайте наизусть и нажимайте на слово, чтобы открыть его. Если ошиблись — УДЕРЖИВАЙТЕ слово (станет красным), оно попадёт в список слабых мест.",
 memDone:"Завершить", memRes:(o,e)=>`Открыто: ${o} слов, ошибок: ${e}. ${e===0?"МашаАллах, отлично!":e<4?"Хорошо! Повторите ошибки":"Стоит повторить ещё раз"}`,
 quizT:"Тест", qMissing:"Найдите пропущенное слово:", qNext:"Продолжите — какой аят следующий?", qScore:(c,t)=>`Верно: ${c}/${t}`,
 qDone:(c,t)=>`Тест завершён! Результат: ${c}/${t}`,
 vT:"Ключевые слова", vSub:"Частые слова Корана и их значения",
 pT:"Общий прогресс", pBarTxt:(a,p)=>`${a} аятов выучено — ${p}% Корана`,
 pCal:"Последние 4 недели", pUnits:"Выученные разделы", pNoUnits:"Пока пусто. Начните сегодня!",
 pWeak:"Слабые места", pWeakSub:"Слова, в которых вы ошибались при самопроверке. Просмотрите их ещё раз.", pNoWeak:"Ошибок нет — отлично!",
 sRem:"Ежедневное напоминание", sRemSub:"Браузер пришлёт уведомление в выбранное время (когда вкладка открыта или в фоне).",
 sTime:"Время", remOn:"Включить", remOk:"Напоминание включено", remNo:"Доступ к уведомлениям не разрешён",
 sData:"Данные", exp:"Скопировать прогресс", reset:"Сбросить всё", resetQ:"Весь прогресс будет удалён. Вы уверены?",
 about:"Құран жаттау — для личного пользования. Текст: alquran.cloud (чтение Хафса от Асыма). Аудио: Мишари Рашид аль-Афаси. Переводы смыслов даны только для понимания.",
 unitDone:"Раздел отмечен как выученный", saved:"Сохранено", copied:"Скопировано",
 surah:"сура", page:"стр.", juz:"джуз", hizb:"хизб", ayahsW:"аяты",
 errLoad:"Ошибка загрузки. Проверьте интернет.", markDone:"Отметить выученным",
 todayDone:"Цель на сегодня выполнена!",
 srsT:"Повторение на сегодня", srsNone:"Сегодня повторений нет", srsRem:"Помню", srsForgot:"Забыл",
 tjBtn:"Таджвид", tjQal:"калькаля", tjGhu:"гунна", tjMadd:"мадд", tjNote:"упрощённый режим",
 vcBtn:"Проверка голосом", vcT:"Проверка голосом",
 vcHint:"Нажмите кнопку микрофона и читайте наизусть — приложение слушает и сверяет слова с текстом. Зелёное — верно, красное — пропущено. Нужны Chrome/Edge и интернет.",
 vcNo:"Этот браузер не поддерживает распознавание речи — используйте Chrome",
 vcListen:"Слушаю... читайте", vcStopped:"Остановлено",
 vcRes:(ok,miss)=>`Верно: ${ok}, пропущено/ошибки: ${miss}. ${miss===0?"МашаАллах!":"Повторите красные слова"}`,
 vcRecBtn:"Записать для устаза", vcRecStop:"Сохранить запись",
 vcRecHint:"Запишите своё чтение и отправьте файл наставнику через WhatsApp/Telegram.",
 vcRecSaved:"Аудио сохранено — отправьте устазу",
 shT:"Устаз / группа", shSub:"Отправьте свой прогресс наставнику или группе заучивания.", shBtn:"Поделиться прогрессом",
 shTxt:(a,s,p)=>`Құран жаттау\nВыучено аятов: ${a}\nДней подряд: ${s}\n${p}% Корана\nПусть Аллах примет!`,
 plSetT:"Создать хатим-план", plScope:"Объём", plJuzAmma:"Джуз Амма (78–114)", plJuz:"Один джуз", plAll:"Весь Коран",
 plDays:"За сколько дней", plMake:"Создать план", plDel:"Удалить план",
 plT:"Хатим-план", plNone:"Плана нет — создайте во вкладке «Прогресс».",
 plDay:(d,n)=>`День ${d}/${n}`, plPages:(f,t)=>`Сегодня: страницы ${f}–${t}`,
 plDoneBtn:"Сегодня выполнено", plOpen:"Открыть", plFin:"План завершён!", plBehind:(k)=>`(отставание ${k} дн.)`,
 loopT:"Слушай и повторяй", loopStart:"Начать", loopStop:"Стоп",
 hintBtn:"Первые слова", tafMecca:"Мекканская сура", tafMedina:"Мединская сура",
 achT:"Достижения", wkT:"Статистика недели",
 days:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
 ach:{first:"Первый раздел",a10:"10 аятов",a50:"50 аятов",a100:"100 аятов",a300:"300 аятов",s3:"3 дня подряд",s7:"7 дней подряд",s30:"30 дней подряд",quiz:"Идеальный тест",mem:"Проверка без ошибок",voice:"Проверка голосом",plan:"Хатим завершён"},
 recT:"Чтец (аудио)",
 wtBtn:"Тренажёр", wtT:"Тренажёр слабых слов",
 wtHint:"Вспомните, откуда это слово и как продолжается аят. Три «Помню» подряд — слово уходит из списка.",
 wtRem:"Помню", wtNo:"Забыл", wtDone:"Тренировка завершена!", wtEmpty:"Слабых слов нет", wtLeft:"осталось",
 grpSub2:"Присоединитесь по коду группы от устаза — ваш прогресс и записи чтения будут доходить до него автоматически.",
 grpCode:"Код группы", grpName:"Ваше имя", grpJoin:"Присоединиться", grpLeave:"Выйти",
 grpIn:(c)=>`Группа: ${c}`, grpFbT:"Отзывы устаза", grpNoFb:"Отзывов пока нет",
 grpNeedCfg:"Облако не настроено — см. инструкцию firebase-setup.md",
 grpSynced:"Синхронизировано", grpUp:"Запись отправлена устазу", grpErr:"Не удалось подключиться к облаку",
 cmpT:"Сравнение с чтецом",
 cmpHint:"Прочитайте этот раздел наизусть под запись — приложение сравнит ваш темп и паузы с чтением выбранного чтеца.",
 cmpStart:"Начать запись", cmpStop:"Стоп", cmpWait:"Идёт анализ...",
 cmpYou:"Вы", cmpRef:"Чтец", cmpSec:"сек",
 cmpFaster:(p)=>`Вы читаете на ${p}% быстрее чтеца — не спешите, соблюдайте тартиль`,
 cmpSlower:(p)=>`Вы читаете на ${p}% медленнее чтеца — при заучивании это нормально`,
 cmpPace:"Ваш темп близок к чтецу — машаАллах!",
 cmpPauses:(n)=>`Долгих пауз: ${n}. Там, где много пауз, слово может быть забыто.`,
 cmpErr:"Анализ не удался — попробуйте Chrome",
 sTheme:"Тема (оформление)", thLight:"Светлая", thDark:"Тёмная", thAuto:"Авто",
 sBg:"Фоновое изображение", sBgSub:"Выберите готовый фон или загрузите своё фото.",
 bgPlain:"Простой", bgUpload:"Загрузить фото", bgYour:"Ваше фото", bgOpacity:"Прозрачность",
 vSearchPh:"Поиск слова (рус., каз., араб.)...", vModeList:"Список", vModeCards:"Карточки",
 vAll:"Все", vKnow:"Знаю", vRepeat:"Дальше", vFlipHint:"Нажмите, чтобы увидеть перевод",
 vCardsDone:"Отлично! Вы прошли все карточки.", vEmpty:"Ничего не найдено",
 vKnownN:(n)=>`знаю: ${n}`, vWord:"слов",
 notifTitle:"Құран жаттау"
}};

/* ============ MOTIVATION (hadith/quotes) ============ */
const MOT = [
 {ar:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
  kk:"«Сендердің ең қайырлыларың — Құранды үйреніп, оны өзгеге үйреткендерің».", ru:"«Лучшие из вас — те, кто изучает Коран и обучает ему других».", src:"Бухари, 5027"},
 {ar:"اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
  kk:"«Құранды оқыңдар! Ақиқатында ол Қиямет күні өз иелеріне шапағатшы болып келеді».", ru:"«Читайте Коран, ибо в День воскресения он явится заступником за тех, кто его читал».", src:"Муслим, 804"},
 {ar:"وَالَّذِي يَقْرَأُ الْقُرْآنَ وَيَتَتَعْتَعُ فِيهِ وَهُوَ عَلَيْهِ شَاقٌّ لَهُ أَجْرَانِ",
  kk:"«Құранды қиналып, кібіртіктеп оқыған адамға екі сауап жазылады».", ru:"«Тому, кто читает Коран запинаясь, и чтение даётся ему с трудом, — двойная награда».", src:"Муслим, 798"},
 {ar:"مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ",
  kk:"«Кім Аллаһтың Кітабынан бір әріп оқыса, оған бір сауап, ал сауап он есе еселенеді».", ru:"«Кто прочитает одну букву из Книги Аллаха, тому запишется награда, а награда умножается десятикратно».", src:"Тирмизи, 2910"},
 {ar:"يُقَالُ لِصَاحِبِ الْقُرْآنِ اقْرَأْ وَارْتَقِ",
  kk:"«Құран иесіне: „Оқы да жоғарыла! Дүниедегідей мәнерлеп оқы. Сенің орның — оқыған соңғы аятыңда“ — делінеді».", ru:"«Обладателю Корана скажут: „Читай и поднимайся! Читай размеренно, как читал в мирской жизни — твоя ступень у последнего прочитанного аята“».", src:"Тирмизи, 2914; Абу Дауд, 1464"},
 {ar:"إِنَّ اللَّهَ يَرْفَعُ بِهَذَا الْكِتَابِ أَقْوَامًا وَيَضَعُ بِهِ آخَرِينَ",
  kk:"«Ақиқатында Аллаһ бұл Кітап арқылы бір қауымдарды көтереді, ал басқаларын төмендетеді».", ru:"«Поистине, посредством этой Книги Аллах возвышает одни народы и принижает другие».", src:"Муслим, 817"},
 {ar:"تَعَاهَدُوا الْقُرْآنَ فَوَالَّذِي نَفْسِي بِيَدِهِ لَهُوَ أَشَدُّ تَفَصِّيًا مِنَ الْإِبِلِ فِي عُقُلِهَا",
  kk:"«Құранды үнемі қайталап тұрыңдар! Жаным қолында болған Аллаһпен ант етемін: ол тұсаулы түйеден де тез қашып кетеді».", ru:"«Повторяйте Коран постоянно! Клянусь Тем, в Чьей руке моя душа, он ускользает быстрее, чем верблюд срывается с привязи».", src:"Бухари, 5033; Муслим, 791"},
 {ar:"وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِنْ مُدَّكِرٍ",
  kk:"«Біз Құранды зікір (еске алу) үшін жеңілдеттік. Еске алушы бар ма?» (Қамар, 17)", ru:"«Мы облегчили Коран для поминания. Но есть ли поминающие?» (аль-Камар, 17)", src:"Құран 54:17"}
];

const SURAHS=["Әл-Фатиха","Әл-Бақара","Әли Имран","Ән-Ниса","Әл-Мәида","Әл-Әнғам","Әл-Ағраф","Әл-Әнфал","Әт-Тәубе","Юнус","Һуд","Юсуф","Әр-Рағд","Ибраһим","Әл-Хиджр","Ән-Нахл","Әл-Исра","Әл-Кәһф","Мәриям","Та-һа","Әл-Әнбия","Әл-Хаж","Әл-Муминун","Ән-Нур","Әл-Фурқан","Әш-Шуғара","Ән-Нәмл","Әл-Қасас","Әл-Әнкәбут","Әр-Рум","Луқман","Әс-Сәжде","Әл-Ахзаб","Сәбә","Фатыр","Ясин","Әс-Саффат","Сад","Әз-Зумәр","Ғафир","Фуссиләт","Әш-Шура","Әз-Зухруф","Әд-Духан","Әл-Жәсия","Әл-Ахқаф","Мұхаммед","Әл-Фәтх","Әл-Хужурат","Қаф","Әз-Зәрият","Әт-Тур","Ән-Нәжм","Әл-Қамар","Әр-Рахман","Әл-Уақиға","Әл-Хадид","Әл-Мужәдәлә","Әл-Хашр","Әл-Мумтәхана","Әс-Саф","Әл-Жумға","Әл-Мунафиқун","Әт-Тәғабун","Әт-Талақ","Әт-Тахрим","Әл-Мулік","Әл-Қалам","Әл-Хаққа","Әл-Мағариж","Нұх","Әл-Жын","Әл-Муззәммил","Әл-Муддәссир","Әл-Қиямет","Әл-Инсан","Әл-Мурсәләт","Ән-Нәбә","Ән-Нәзиғат","Ғабаса","Әт-Тәкуир","Әл-Инфитар","Әл-Мутаффифин","Әл-Иншиқақ","Әл-Буруж","Әт-Тарық","Әл-Әғла","Әл-Ғашия","Әл-Фәжр","Әл-Бәләд","Әш-Шәмс","Әл-Ләйл","Әд-Духа","Әш-Шарх","Әт-Тин","Әл-Ғалақ","Әл-Қадір","Әл-Бәйина","Әз-Зәлзәлә","Әл-Ғадият","Әл-Қариға","Әт-Тәкәсур","Әл-Ғаср","Әл-Һумәзә","Әл-Фил","Құрайш","Әл-Мағун","Әл-Кәусар","Әл-Кәфирун","Ән-Наср","Әл-Мәсәд","Әл-Ихлас","Әл-Фәләқ","Ән-Нас"];
const SURAH_AYAHS=[7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
const TOTAL_AYAHS=6236;

/* ============ Краткие темы сур (тафсир-подсказки) ============ */
const SURAH_INFO={
1:["Кітаптың анасы — дұға мен мадақтың негізі","Мать Книги — основа мольбы и восхваления"],
2:["Ең ұзақ сүре: иман, үкімдер, Аятул-Курси","Самая длинная сура: вера, законы, Аят аль-Курси"],
18:["Үңгір иелері, Хызыр, Зулқарнайын — фитнадан қорғау","Люди пещеры, Хидр, Зулькарнайн — защита от смут"],
36:["Құранның жүрегі: қайта тірілу дәлелдері","Сердце Корана: доводы воскрешения"],
55:["Раббының қай сыйын жоққа шығарасың?","Какую же из милостей Господа вы отвергнете?"],
56:["Қиямет күнгі үш топ","Три группы людей в Судный день"],
67:["Қабір азабынан қорғайтын сүре","Сура, защищающая от наказания могилы"],
78:["Қайта тірілу туралы ұлы хабар","Великая весть о воскресении"],
79:["Жан алушы періштелер мен Қиямет","Ангелы, забирающие души, и Час"],
80:["Зағип кісі оқиғасы: насихаттың құны","История со слепым: ценность наставления"],
81:["Күн оралғанда — ақырзаман көріністері","Когда солнце будет скручено — картины конца света"],
82:["Аспан жарылғанда, амал дәптері","Раскол неба и запись деяний"],
83:["Өлшемнен жейтіндер: саудадағы адалдық","Обвешивающие: честность в торговле"],
84:["Аспан қақ айырылып, есеп басталады","Небо расколется, и начнётся расчёт"],
85:["Ор иелері: мүміндердің табандылығы","Люди рва: стойкость верующих"],
86:["Түнгі жұлдыз және адамның жаратылуы","Ночная звезда и сотворение человека"],
87:["Ұлы Раббыңды пәктеу, жеңіл жол","Прославление Всевышнего и лёгкий путь"],
88:["Бүркеуші күн: жәннат пен тозақ","Покрывающее: рай и ад"],
89:["Таң. Байлық пен кедейлік — сынақ","Заря. Богатство и бедность — испытание"],
90:["Мекке қаласы және екі жол","Город Мекка и два пути"],
91:["Күн. Жанды тазарту, Сәмүд елі","Солнце. Очищение души и самудяне"],
92:["Түн. Жұмсаудың екі жолы","Ночь. Два пути расходования"],
93:["Сәске. Пайғамбарға жұбаныш","Утро. Утешение Пророку"],
94:["Қиындықпен бірге жеңілдік бар","С тягостью приходит облегчение"],
95:["Інжір. Адам — ең көркем бейнеде","Смоковница. Человек в лучшем сложении"],
96:["Алғашқы аяттар: «Оқы!»","Первые аяты: «Читай!»"],
97:["Қадір түні — мың айдан қайырлы","Ночь предопределения лучше тысячи месяцев"],
98:["Анық дәлел","Ясное доказательство"],
99:["Жер сілкінісі: зәредей амал да есепте","Землетрясение: учтено даже малое дело"],
100:["Шапқан аттар. Адамның қайырымсыздығы","Скачущие кони. Неблагодарность человека"],
101:["Қағатын апат және таразы","Великое бедствие и весы"],
102:["Көбейтуге құмарлық алдандырды","Страсть к приумножению отвлекла вас"],
103:["Уақыт! Иман мен сабыр — құтылу жолы","Время! Спасение — в вере и терпении"],
104:["Ғайбатшы мен мал жинаушыға қасірет","Горе хулителю и накопителю"],
105:["Піл иелері оқиғасы","История владельцев слона"],
106:["Құрайшқа берілген нығмет","Милость, дарованная курайшитам"],
107:["Жетімді итермелеу, көзбояушылық","Сирота, показная молитва и мелочь"],
108:["Кәусар — мол сый","Каусар — изобилие"],
109:["Сендердің діндерің — өздеріңе","Размежевание: вам — ваша религия"],
110:["Аллаһтың көмегі мен жеңіс","Помощь Аллаха и победа"],
111:["Әбу Ләһәбтің ақыры","Конец Абу Ляхаба"],
112:["Ықылас: таухид — Құранның үштен бірі","Ихлас: единобожие — треть Корана"],
113:["Жаратылғандар зұлымдығынан қорғану","Защита от зла сотворённого"],
114:["Аздырушының азғыруынан қорғану","Защита от наущений шайтана"]
};
/* ===================== STATE / STORAGE ===================== */
let store = {};
try { store = JSON.parse(localStorage.getItem('qj') || '{}'); } catch(e){ store = {}; }
function defaults(s){
  s.lang = s.lang || 'kk';
  s.theme = s.theme || 'auto';        // light | dark | auto
  s.bg = s.bg || 'geo';               // фон үлгісі немесе 'none' | 'custom'
  s.bgCustom = s.bgCustom || null;    // dataURL
  s.bgOpacity = (s.bgOpacity==null) ? 55 : s.bgOpacity;
  s.units = s.units || {};
  s.weak = s.weak || [];
  s.days = s.days || {};
  s.last = s.last || null;
  s.remTime = s.remTime || '20:00';
  s.remEnabled = !!s.remEnabled;
  s.srs = s.srs || {};
  s.plan = s.plan || null;
  s.tajweed = !!s.tajweed;
  s.ach = s.ach || {};
  s.flags = s.flags || {};
  s.reciter = s.reciter || 'ar.alafasy';
  s.group = s.group || null;
  s.weak2 = s.weak2 || {};
  s.vocabKnown = s.vocabKnown || {};
  s.vocabMode = s.vocabMode || 'list';
  if(s.weak && s.weak.length){
    s.weak.forEach(x=>{ const k=x.w+'|'+x.ref; if(!s.weak2[k]) s.weak2[k]={w:x.w,ref:x.ref,ok:0}; });
    s.weak=[];
  }
  return s;
}
store = defaults(store);
function save(){ try{ localStorage.setItem('qj', JSON.stringify(store)); }catch(e){} }
function t(k){ const v = T[store.lang][k]; return v===undefined? k : v; }
function toastMsg(m){ const el=document.getElementById('toast'); el.textContent=m; el.classList.add('on'); setTimeout(()=>el.classList.remove('on'),2200); }
function todayKey(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function addMinutes(n){ const k=todayKey(); store.days[k]=(store.days[k]||0)+n; save(); }
function streak(){
  let s=0; const d=new Date();
  if(!store.days[todayKey()]) d.setDate(d.getDate()-1);
  for(;;){ const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    if(store.days[k]){ s++; d.setDate(d.getDate()-1);} else break; }
  return s;
}
function ayahsLearned(){ let n=0; for(const k in store.units) if(store.units[k].done) n+=store.units[k].ayahs; return n; }

/* ===================== THEME (жарық/қараңғы/авто) ===================== */
const mqDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
function effectiveTheme(){
  if(store.theme==='auto') return (mqDark && mqDark.matches) ? 'dark' : 'light';
  return store.theme;
}
function applyTheme(){
  const eff = effectiveTheme();
  document.documentElement.setAttribute('data-theme', eff);
  const tc = eff==='dark' ? '#15110b' : '#2f7355';
  const meta = document.querySelector('meta[name="theme-color"]'); if(meta) meta.setAttribute('content', tc);
  const btn = document.getElementById('themeBtn');
  if(btn){ const ic = store.theme==='auto' ? 'auto' : (eff==='dark' ? 'moon' : 'sun'); btn.innerHTML = svgIcon(ic,20); }
}
function cycleTheme(){
  store.theme = store.theme==='light' ? 'dark' : store.theme==='dark' ? 'auto' : 'light';
  save(); applyTheme(); renderThemeGrid();
}
function setTheme(v){ store.theme=v; save(); applyTheme(); renderThemeGrid(); }
if(mqDark && mqDark.addEventListener) mqDark.addEventListener('change', ()=>{ if(store.theme==='auto') applyTheme(); });

/* ===================== ФОН (исламдық суреттер/үлгілер) ===================== */
const BG = [
 {id:'none', kk:'Қарапайым', ru:'Простой'},
 {id:'geo', kk:'Геометрия', ru:'Геометрия', tile:true, svg:`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><rect width='140' height='140' fill='#f6efe2'/><g fill='none' stroke='#2f7355' stroke-width='1.4' opacity='0.5'><rect x='35' y='35' width='70' height='70'/><rect x='35' y='35' width='70' height='70' transform='rotate(45 70 70)'/><circle cx='70' cy='70' r='14' stroke='#b6862e'/></g><g fill='#b6862e' opacity='0.5'><circle cx='0' cy='0' r='3'/><circle cx='140' cy='0' r='3'/><circle cx='0' cy='140' r='3'/><circle cx='140' cy='140' r='3'/></g></svg>`},
 {id:'stars', kk:'Жұлдыздар', ru:'Звёзды', tile:true, svg:`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' fill='#faf4e8'/><g stroke='#b6862e' stroke-width='1.3' fill='none' opacity='0.55'><path d='M60 28 L70 50 L92 60 L70 70 L60 92 L50 70 L28 60 L50 50 Z'/><rect x='44' y='44' width='32' height='32' transform='rotate(45 60 60)'/></g><g stroke='#2f7355' stroke-width='1.1' fill='none' opacity='0.4'><path d='M0 0 L10 22 L0 30'/><path d='M120 0 L110 22 L120 30'/></g></svg>`},
 {id:'arabesque', kk:'Ою-өрнек', ru:'Орнамент', tile:true, svg:`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><rect width='160' height='160' fill='#f4ecdd'/><g fill='none' stroke='#2f7355' stroke-width='1.3' opacity='0.45'><path d='M80 20 C100 50 100 50 80 80 C60 50 60 50 80 20 Z'/><path d='M80 140 C100 110 100 110 80 80 C60 110 60 110 80 140 Z'/><path d='M20 80 C50 60 50 60 80 80 C50 100 50 100 20 80 Z'/><path d='M140 80 C110 60 110 60 80 80 C110 100 110 100 140 80 Z'/></g><circle cx='80' cy='80' r='6' fill='#b6862e' opacity='0.5'/></svg>`},
 {id:'mosque', kk:'Мешіт (кеш)', ru:'Мечеть (вечер)', svg:`<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='960' viewBox='0 0 1440 960' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1b2a4a'/><stop offset='0.45' stop-color='#4a3b63'/><stop offset='0.78' stop-color='#b9743f'/><stop offset='1' stop-color='#e8a85a'/></linearGradient></defs><rect width='1440' height='960' fill='url(#s)'/><circle cx='1120' cy='210' r='70' fill='#f7e6b8' opacity='0.92'/><circle cx='1148' cy='196' r='62' fill='#4a3b63' opacity='0.9'/><g fill='#fff' opacity='0.7'><circle cx='300' cy='160' r='2.5'/><circle cx='460' cy='110' r='2'/><circle cx='620' cy='200' r='2.5'/><circle cx='820' cy='130' r='2'/><circle cx='240' cy='260' r='1.8'/><circle cx='980' cy='250' r='2'/></g><g fill='#141d33'><rect x='0' y='720' width='1440' height='240'/><path d='M620 720 V560 a100 100 0 0 1 200 0 V720 Z'/><circle cx='720' cy='540' r='14'/><rect x='520' y='620' width='70' height='100'/><path d='M520 620 a35 35 0 0 1 70 0 Z'/><rect x='850' y='620' width='70' height='100'/><path d='M850 620 a35 35 0 0 1 70 0 Z'/><rect x='300' y='640' width='40' height='80'/><path d='M300 640 a20 20 0 0 1 40 0 Z'/><rect x='1080' y='640' width='40' height='80'/><path d='M1080 640 a20 20 0 0 1 40 0 Z'/></g></svg>`},
 {id:'dawn', kk:'Таң шапағы', ru:'Рассвет', svg:`<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='960' viewBox='0 0 1440 960' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='d' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#f6d79b'/><stop offset='0.5' stop-color='#e9b074'/><stop offset='1' stop-color='#c77f53'/></linearGradient></defs><rect width='1440' height='960' fill='url(#d)'/><circle cx='720' cy='430' r='150' fill='#fff3d6' opacity='0.85'/><circle cx='720' cy='430' r='220' fill='#fff3d6' opacity='0.3'/><g fill='#7a4a35' opacity='0.9'><rect x='0' y='760' width='1440' height='200'/><path d='M600 760 V610 a90 90 0 0 1 180 0 V760 Z'/><rect x='500' y='660' width='54' height='100'/><path d='M500 660 a27 27 0 0 1 54 0 Z'/><rect x='886' y='660' width='54' height='100'/><path d='M886 660 a27 27 0 0 1 54 0 Z'/></g></svg>`}
];
function bgDataUrl(svg){ return "url('data:image/svg+xml,"+encodeURIComponent(svg)+"')"; }
function applyBg(){
  const layer=document.getElementById('bgLayer');
  if(!layer) return;
  let img='', tile=false;
  if(store.bg==='custom' && store.bgCustom){ img='url("'+store.bgCustom+'")'; }
  else if(store.bg && store.bg!=='none'){
    const b=BG.find(x=>x.id===store.bg);
    if(b && b.svg){ img=bgDataUrl(b.svg); tile=!!b.tile; }
  }
  if(img){
    layer.style.backgroundImage=img;
    layer.style.backgroundSize = tile ? '150px' : 'cover';
    layer.style.backgroundRepeat = tile ? 'repeat' : 'no-repeat';
    layer.style.opacity = Math.max(0.1, Math.min(1, store.bgOpacity/100));
    document.body.classList.add('has-bg');
    document.getElementById('bgVeil').style.opacity = String(Math.min(1, 0.45 + (1-store.bgOpacity/100)*0.5));
  } else {
    layer.style.backgroundImage='';
    document.body.classList.remove('has-bg');
  }
}
function setBg(id){ store.bg=id; save(); applyBg(); renderBgGrid(); }
function setBgOpacity(v){ store.bgOpacity=+v; save(); applyBg(); }
function uploadBg(inp){
  const f=inp.files && inp.files[0]; if(!f) return;
  if(!/^image\//.test(f.type)){ toastMsg(t('errLoad')); return; }
  if(f.size > 4*1024*1024){ toastMsg(store.lang==='kk'?'Сурет тым үлкен (4МБ дейін)':'Файл слишком большой (до 4МБ)'); return; }
  const r=new FileReader();
  r.onload=()=>{ store.bgCustom=r.result; store.bg='custom'; save(); applyBg(); renderBgGrid(); toastMsg(t('saved')); };
  r.readAsDataURL(f);
  inp.value='';
}

/* ===================== NAV / LANG ===================== */
const NAV=[['home','home'],['learn','book'],['vocab','letters'],['prog','chart'],['set','sliders']];
function buildNav(){
  document.getElementById('nav').innerHTML = NAV.map(([s,ic])=>
    '<button data-s="'+s+'" onclick="show(\''+s+'\')">'+svgIcon(ic,23)+'<span id="n'+s.charAt(0).toUpperCase()+s.slice(1)+'"></span></button>'
  ).join('');
}
const SCREENS=['home','learn','study','mem','quiz','voice','vocab','prog','set','wtrain'];
let cur='home';
function show(s){
  if(s==='study2') s='study';
  if(s!=='study' && typeof loop!=='undefined' && loop.on) stopLoop();
  cur=s;
  SCREENS.forEach(x=>document.getElementById('scr-'+x).classList.toggle('on', x===s));
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on', b.dataset.s===s || (s==='study'&&b.dataset.s==='learn') || (s==='mem'&&b.dataset.s==='learn') || (s==='quiz'&&b.dataset.s==='learn') || (s==='voice'&&b.dataset.s==='learn') || (s==='wtrain'&&b.dataset.s==='prog')));
  if(s==='home') renderHome();
  if(s==='vocab') renderVocab();
  if(s==='prog') renderProg();
  if(s==='set') renderSet();
  window.scrollTo(0,0);
}
function setLang(l){ store.lang=l; save(); applyLang(); }
function applyLang(){
  document.documentElement.setAttribute('lang', store.lang);
  document.getElementById('lkk').classList.toggle('on', store.lang==='kk');
  document.getElementById('lru').classList.toggle('on', store.lang==='ru');
  ['home','learn','vocab','prog','set'].forEach(s=>{ const el=document.getElementById('n'+s.charAt(0).toUpperCase()+s.slice(1)); if(el) el.textContent=t('n'+s.charAt(0).toUpperCase()+s.slice(1)); });
  const setTxt=(id,key)=>{ const el=document.getElementById(id); if(el) el.textContent=t(key); };
  setTxt('stStreakL','streak'); setTxt('stAyahsL','ayahs'); setTxt('stMinL','mins');
  setTxt('hProgT','hProg'); setTxt('hContT','hCont'); setTxt('lModeT','lMode');
  setTxt('goStudy','go'); setTxt('backBtn','back'); setTxt('toMem','toMem'); setTxt('toQuiz','toQuiz');
  setTxt('memTitle','memT'); setTxt('memHint','memHint'); setTxt('memDone','memDone'); setTxt('memBack','back');
  setTxt('quizTitle','quizT'); setTxt('quizBack','back'); setTxt('vT','vT'); setTxt('vSub','vSub');
  setTxt('pT','pT'); setTxt('pCalT','pCal'); setTxt('pUnitsT','pUnits'); setTxt('pWeakT','pWeak'); setTxt('pWeakSub','pWeakSub');
  setTxt('sRemT','sRem'); setTxt('sRemSub','sRemSub'); setTxt('sTimeL','sTime'); setTxt('remOn','remOn');
  setTxt('sDataT','sData'); setTxt('expBtn','exp'); setTxt('resetBtn','reset'); setTxt('aboutTxt','about');
  setTxt('vcBtn','vcBtn'); setTxt('tjBtn','tjBtn'); setTxt('vcTitle','vcT'); setTxt('vcHint','vcHint');
  setTxt('vcRecHint','vcRecHint'); setTxt('vcRecBtn','vcRecBtn'); setTxt('vcBack','back');
  setTxt('plSetT','plSetT'); setTxt('loopT','loopT'); setTxt('loopBtn','loopStart'); setTxt('memHintBtn','hintBtn');
  setTxt('achT','achT'); setTxt('wkT','wkT'); setTxt('wtT','wtT'); setTxt('wtHintTxt','wtHint'); setTxt('wtBack','back');
  setTxt('recT','recT'); setTxt('cmpTitle','cmpT'); setTxt('cmpHintTxt','cmpHint'); setTxt('cmpBtn','cmpStart');
  setTxt('shT','shT'); setTxt('shSub','shSub'); setTxt('shBtn','shBtn');
  setTxt('sThemeT','sTheme'); setTxt('sBgT','sBg'); setTxt('sBgSub','sBgSub'); setTxt('bgOpacityL','bgOpacity');
  setTxt('bgUploadBtn','bgUpload');
  const vs=document.getElementById('vSearch'); if(vs) vs.placeholder=t('vSearchPh');
  setTxt('vModeListBtn','vModeList'); setTxt('vModeCardsBtn','vModeCards');
  const vsi=document.getElementById('vSearchIc'); if(vsi) vsi.innerHTML=svgIcon('search',18);
  const vcl=document.getElementById('vClear'); if(vcl) vcl.innerHTML=svgIcon('close',16);
  renderReciterSel(); renderThemeGrid(); renderBgGrid();
  renderModeGrid(); renderPicker();
  show(cur);
}
/* ===================== SETTINGS RENDER ===================== */
function renderThemeGrid(){
  const g=document.getElementById('themeGrid'); if(!g) return;
  const items=[['light','sun','thLight'],['dark','moon','thDark'],['auto','auto','thAuto']];
  g.innerHTML=items.map(([id,ic,key])=>
    '<button class="'+(store.theme===id?'on':'')+'" onclick="setTheme(\''+id+'\')" style="display:flex;flex-direction:column;align-items:center;gap:6px">'+svgIcon(ic,22)+'<span>'+esc(t(key))+'</span></button>'
  ).join('');
}
function renderBgGrid(){
  const g=document.getElementById('bgGrid'); if(!g) return;
  let html='';
  BG.forEach(b=>{
    let style='';
    if(b.id==='none') style="background:var(--card2)";
    else if(b.svg){ const tile=b.tile?'background-size:80px;background-repeat:repeat':'background-size:cover'; style="background-image:"+bgDataUrl(b.svg)+";"+tile; }
    html+='<div class="bg-opt'+(store.bg===b.id?' on':'')+'" onclick="setBg(\''+b.id+'\')" style="'+style+'"><span>'+esc(store.lang==='kk'?b.kk:b.ru)+'</span></div>';
  });
  if(store.bgCustom){
    html+='<div class="bg-opt'+(store.bg==='custom'?' on':'')+'" onclick="setBg(\'custom\')" style="background-image:url(\''+store.bgCustom.replace(/'/g,"%27")+'\')"><span>'+esc(t('bgYour'))+'</span></div>';
  }
  g.innerHTML=html;
  const op=document.getElementById('bgOpacity'); if(op) op.value=store.bgOpacity;
}

/* ===================== HOME ===================== */
function renderHome(){
  const m = MOT[new Date().getDate() % MOT.length];
  document.getElementById('motCard').innerHTML =
    '<div class="ar">'+esc(m.ar)+'</div><div class="tr">'+esc(store.lang==='kk'?m.kk:m.ru)+'</div><div class="src">— '+esc(m.src)+'</div>';
  document.getElementById('stStreak').textContent=streak();
  document.getElementById('stAyahs').textContent=ayahsLearned();
  document.getElementById('stMin').textContent=store.days[todayKey()]||0;
  const a=ayahsLearned(), p=Math.min(100,(a/TOTAL_AYAHS*100));
  document.getElementById('homeBar').style.width=p+'%';
  document.getElementById('homeBarTxt').textContent=T[store.lang].pBarTxt(a, p.toFixed(2));
  const c=document.getElementById('contArea');
  if(store.last){
    c.innerHTML='<b style="color:var(--ink)">'+esc(store.last.label)+'</b><div class="btn-row"><button class="btn sm" onclick="resumeLast()">'+esc(t('contBtn'))+'</button></div>';
  } else c.textContent=t('noCont');
  renderSrsCard(); renderPlanCard();
}
function resumeLast(){ mode=store.last.mode; renderModeGrid(); renderPicker(store.last); show('learn'); loadUnit(); }

/* ===================== LEARN PICKER ===================== */
let mode='surah';
function renderModeGrid(){
  const g=document.getElementById('modeGrid');
  const items=[['surah','mSurah'],['ayah','mAyah'],['page','mPage'],['juz','mJuz'],['hizb','mHizb']];
  g.innerHTML=items.map(([m,k])=>'<button class="'+(mode===m?'on':'')+'" onclick="mode=\''+m+'\';renderModeGrid();renderPicker()">'+esc(t(k))+'</button>').join('');
}
function surahOptions(sel){
  return SURAHS.map((s,i)=>'<option value="'+(i+1)+'"'+(sel==i+1?' selected':'')+'>'+(i+1)+'. '+esc(s)+' ('+SURAH_AYAHS[i]+')</option>').join('');
}
function renderPicker(pre){
  const a=document.getElementById('pickArea');
  if(mode==='surah'){
    a.innerHTML='<label class="fld">'+esc(t('fSurahPick'))+'</label><select id="pkSurahFull">'+surahOptions(pre&&pre.surah?pre.surah:1)+'</select>';
  } else if(mode==='ayah'){
    a.innerHTML='<label class="fld">'+esc(t('fSurah'))+'</label><select id="pkSurah" onchange="syncAyahRange()">'+surahOptions(pre&&pre.surah?pre.surah:1)+'</select>'+
      '<label class="fld">'+esc(t('fFrom'))+'</label><input type="number" id="pkFrom" min="1" value="1">'+
      '<label class="fld">'+esc(t('fTo'))+'</label><input type="number" id="pkTo" min="1" value="7">';
    if(pre&&pre.from){ document.getElementById('pkFrom').value=pre.from; document.getElementById('pkTo').value=pre.to; }
    else syncAyahRange();
  } else if(mode==='page'){
    a.innerHTML='<label class="fld">'+esc(t('fPage'))+'</label><input type="number" id="pkPage" min="1" max="604" value="'+((pre&&pre.n)||1)+'">';
  } else if(mode==='juz'){
    a.innerHTML='<label class="fld">'+esc(t('fJuz'))+'</label><input type="number" id="pkJuz" min="1" max="30" value="'+((pre&&pre.n)||30)+'">';
  } else {
    a.innerHTML='<label class="fld">'+esc(t('fHizb'))+'</label><input type="number" id="pkHizb" min="1" max="60" value="'+((pre&&pre.n)||60)+'">';
  }
}
function syncAyahRange(){
  const s=+document.getElementById('pkSurah').value;
  const max=SURAH_AYAHS[s-1];
  const f=document.getElementById('pkFrom'), to=document.getElementById('pkTo');
  f.max=max; to.max=max; if(+to.value>max) to.value=max; if(+f.value>max) f.value=1;
}

/* ===================== QURAN API ===================== */
const API='https://api.alquran.cloud/v1';
let unit=null;
async function fetchJSON(u){ const r=await fetch(u,{referrerPolicy:'no-referrer'}); if(!r.ok) throw new Error('http'); const j=await r.json(); if(j.code!==200) throw new Error('api'); return j.data; }
function trEdition(){ return store.lang==='kk' ? 'kk.altai' : 'ru.kuliev'; }

async function loadUnit(){
  const area=document.getElementById('studyArea');
  show('study'); area.innerHTML='<div class="spin"></div>';
  document.getElementById('studyTitle').textContent=t('loading');
  try{
    let arD, trD, label, key, sel={mode};
    if(mode==='surah'){
      const s=+document.getElementById('pkSurahFull').value;
      arD=await fetchJSON(API+'/surah/'+s);
      try{ trD=await fetchJSON(API+'/surah/'+s+'/'+trEdition()); }catch(e){ trD=null; }
      label=s+'. '+SURAHS[s-1]; key='s'+s+':full';
      Object.assign(sel,{surah:s});
      unit={key,label,surahNum:s,rev:arD.revelationType,ayahsTotal:SURAH_AYAHS[s-1],ayahs:arD.ayahs.map((a,i)=>({n:a.numberInSurah, global:a.number, ar:a.text, tr:trD?trD.ayahs[i].text:''}))};
    } else if(mode==='ayah'){
      const s=+document.getElementById('pkSurah').value;
      let f=+document.getElementById('pkFrom').value, to=+document.getElementById('pkTo').value;
      if(f>to)[f,to]=[to,f];
      const off=f-1, lim=to-f+1;
      arD=await fetchJSON(API+'/surah/'+s+'?offset='+off+'&limit='+lim);
      try{ trD=await fetchJSON(API+'/surah/'+s+'/'+trEdition()+'?offset='+off+'&limit='+lim);}catch(e){ trD=null; }
      label=s+'. '+SURAHS[s-1]+' ('+f+'–'+to+')'; key='s'+s+':'+f+'-'+to;
      Object.assign(sel,{surah:s,from:f,to:to});
      unit={key,label,surahNum:s,rev:arD.revelationType,ayahsTotal:SURAH_AYAHS[s-1],ayahs:arD.ayahs.map((a,i)=>({n:a.numberInSurah, global:a.number, ar:a.text, tr:trD?trD.ayahs[i].text:''}))};
    } else {
      let path,n;
      if(mode==='page'){ n=+document.getElementById('pkPage').value; path='/page/'+n; label=t('page')+' '+n; key='p'+n; }
      else if(mode==='juz'){ n=+document.getElementById('pkJuz').value; path='/juz/'+n; label=t('juz')+' '+n; key='j'+n; }
      else { n=+document.getElementById('pkHizb').value; label=t('hizb')+' '+n; key='h'+n; }
      sel.n=n;
      if(mode==='hizb'){
        const qs=[(n-1)*4+1,(n-1)*4+2,(n-1)*4+3,(n-1)*4+4];
        const parts=await Promise.all(qs.map(q=>fetchJSON(API+'/hizbQuarter/'+q+'/quran-uthmani')));
        let trParts=null;
        try{ trParts=await Promise.all(qs.map(q=>fetchJSON(API+'/hizbQuarter/'+q+'/'+trEdition()))); }catch(e){}
        const ay=[].concat(...parts.map(p=>p.ayahs));
        const tr=trParts?[].concat(...trParts.map(p=>p.ayahs)):null;
        unit={key,label,ayahs:ay.map((a,i)=>({n:a.numberInSurah, global:a.number, ar:a.text, tr:tr?tr[i].text:'', surah:a.surah?a.surah.englishName:''}))};
      } else {
        arD=await fetchJSON(API+path+'/quran-uthmani');
        try{ trD=await fetchJSON(API+path+'/'+trEdition()); }catch(e){ trD=null; }
        unit={key,label,ayahs:arD.ayahs.map((a,i)=>({n:a.numberInSurah, global:a.number, ar:a.text, tr:trD?trD.ayahs[i].text:'', surah:a.surah?a.surah.englishName:''}))};
      }
    }
    store.last=Object.assign({label:unit.label},sel); save();
    renderStudy(); addMinutes(1);
  }catch(e){
    area.innerHTML='<div class="card center" style="color:var(--red)">'+esc(t('errLoad'))+'</div>';
    document.getElementById('studyTitle').textContent='—';
  }
}

let audio=null;
const RECITERS=[
  ['ar.alafasy',128,'Мишари Рашид әл-Афаси'],
  ['ar.husary',128,'Махмуд Халил әл-Хусари'],
  ['ar.abdulbasitmurattal',64,'Абдул-Бәсит (муратталь)'],
  ['ar.abdurrahmaansudais',64,'Әбдірахман әс-Судайс']
];
function audioUrl(g){
  const r=RECITERS.find(x=>x[0]===store.reciter)||RECITERS[0];
  return 'https://cdn.islamic.network/quran/audio/'+r[1]+'/'+r[0]+'/'+g+'.mp3';
}
function renderReciterSel(){
  const el=document.getElementById('recSel');
  if(!el) return;
  el.innerHTML=RECITERS.map(r=>'<option value="'+r[0]+'"'+(store.reciter===r[0]?' selected':'')+'>'+esc(r[2])+'</option>').join('');
}
function setReciter(v){ store.reciter=v; save(); toastMsg(t('saved')); }
function playAyah(g,btn){
  if(audio){ audio.pause(); }
  audio=new Audio(audioUrl(g));
  audio.play().catch(()=>{});
}
function renderStudy(){
  document.getElementById('studyTitle').textContent=unit.label+' · '+unit.ayahs.length+' '+t('ayahsW');
  const done=store.units[unit.key]&&store.units[unit.key].done;
  let taf='';
  if(unit.surahNum){
    const th=SURAH_INFO[unit.surahNum];
    taf='<div class="taf"><b>'+(unit.rev==='Medinan'?t('tafMedina'):t('tafMecca'))+'</b> · '+unit.ayahsTotal+' '+t('ayahsW')+
      (th?'<div class="muted" style="margin-top:4px">'+esc(store.lang==='kk'?th[0]:th[1])+'</div>':'')+'</div>';
  }
  document.getElementById('studyArea').innerHTML=taf+unit.ayahs.map((a,ix)=>
    '<div class="ayah-card" id="ac'+ix+'"><div class="ar">'+(store.tajweed?tajweedify(a.ar):esc(a.ar))+'</div>'+
    (a.tr?'<div class="tr">'+esc(a.tr)+'</div>':'')+
    '<div class="meta"><span class="ayah-num">'+(a.surah?esc(a.surah)+' · ':'')+a.n+'</span>'+
    '<button class="play" onclick="playAyah('+a.global+',this)" aria-label="play">'+svgIcon('play',15)+'</button></div></div>'
  ).join('') +
  '<div class="btn-row"><button class="btn '+(done?'sec':'gold')+'" onclick="markDone()">'+(done?svgIcon('check',16)+' ':'')+esc(t('markDone'))+'</button></div>';
  document.getElementById('tjBtn').classList.toggle('gold', store.tajweed);
  renderTjLegend();
}
function markDone(){
  store.units[unit.key]={label:unit.label, ayahs:unit.ayahs.length, done:true, ts:Date.now(), sel:store.last};
  srsSchedule(unit.key, 0);
  addMinutes(2); save(); toastMsg(t('unitDone')); renderStudy(); checkAch(); syncGroup();
}

/* ===================== MEMORIZE (self-check) ===================== */
let memWords=[], memErr=0, memOpen=0, pressTimer=null;
function startMem(){
  if(!unit) return;
  show('mem'); memErr=0; memOpen=0;
  const area=document.getElementById('memArea');
  let html=''; memWords=[];
  unit.ayahs.forEach(a=>{
    a.ar.split(/\s+/).forEach((w,wi)=>{
      const idx=memWords.length;
      memWords.push({w, ref:unit.label+' · '+a.n});
      html+='<span class="w hidden" id="mw'+idx+'" data-i="'+idx+'"'+(wi===0?' data-first="1"':'')+'>'+esc(w)+'</span>';
    });
    html+='<span style="color:var(--gold);font-size:18px"> ﴿'+a.n+'﴾ </span>';
  });
  area.innerHTML=html;
  area.querySelectorAll('.w').forEach(el=>{
    el.addEventListener('click',()=>revealWord(el));
    el.addEventListener('touchstart',()=>{ pressTimer=setTimeout(()=>markErr(el),550); },{passive:true});
    el.addEventListener('touchend',()=>clearTimeout(pressTimer));
    el.addEventListener('mousedown',()=>{ pressTimer=setTimeout(()=>markErr(el),550); });
    el.addEventListener('mouseup',()=>clearTimeout(pressTimer));
    el.addEventListener('mouseleave',()=>clearTimeout(pressTimer));
    el.addEventListener('contextmenu',e=>{e.preventDefault(); markErr(el);});
  });
}
function revealWord(el){
  if(!el.classList.contains('hidden')) return;
  el.classList.remove('hidden'); el.classList.add('shown'); memOpen++;
}
function markErr(el){
  el.classList.remove('hidden'); el.classList.add('err'); memErr++; memOpen++;
  const i=+el.dataset.i;
  addWeak(memWords[i].w, memWords[i].ref);
}
function addWeak(w,ref){
  const k=w+'|'+ref;
  const e=store.weak2[k]||{w:w,ref:ref,ok:0};
  e.ok=0; store.weak2[k]=e;
  const ks=Object.keys(store.weak2);
  if(ks.length>150) delete store.weak2[ks[0]];
  save();
}
function finishMem(){
  if(memErr===0 && memWords.length>=10){ store.flags.mem=1; }
  addMinutes(3); save();
  toastMsg(T[store.lang].memRes(memOpen,memErr));
  show('study'); checkAch();
}
function memHintReveal(){
  document.querySelectorAll('#memArea .w[data-first="1"].hidden').forEach(el=>{
    el.classList.remove('hidden'); el.classList.add('shown');
  });
}

/* ===================== QUIZ ===================== */
let quiz={qs:[],i:0,score:0};
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function startQuiz(){
  if(!unit) return;
  const qs=[];
  const pool=unit.ayahs.filter(a=>a.ar.split(/\s+/).length>=4);
  shuffle(pool.slice()).slice(0,4).forEach(a=>{
    const ws=a.ar.split(/\s+/);
    const hide=1+Math.floor(Math.random()*(ws.length-2));
    const answer=ws[hide];
    const shown=ws.map((w,i)=>i===hide?'＿＿＿':w).join(' ');
    const others=shuffle(memAllWords().filter(w=>w!==answer)).slice(0,3);
    qs.push({type:'missing', text:shown, answer, opts:shuffle([answer,...others])});
  });
  if(unit.ayahs.length>=3){
    for(let k=0;k<Math.min(3,unit.ayahs.length-1);k++){
      const i=Math.floor(Math.random()*(unit.ayahs.length-1));
      const cur=unit.ayahs[i], nxt=unit.ayahs[i+1];
      const others=shuffle(unit.ayahs.filter(a=>a!==nxt&&a!==cur)).slice(0,2).map(a=>a.ar);
      qs.push({type:'next', text:cur.ar, answer:nxt.ar, opts:shuffle([nxt.ar,...others])});
    }
  }
  if(!qs.length) return;
  quiz={qs:shuffle(qs),i:0,score:0};
  show('quiz'); renderQ();
}
function memAllWords(){
  const s=new Set();
  unit.ayahs.forEach(a=>a.ar.split(/\s+/).forEach(w=>{ if(w.length>2) s.add(w); }));
  return [...s];
}
function renderQ(){
  const q=quiz.qs[quiz.i];
  document.getElementById('quizScore').textContent=T[store.lang].qScore(quiz.score,quiz.qs.length)+' · '+(quiz.i+1)+'/'+quiz.qs.length;
  document.getElementById('quizCard').innerHTML=
    '<div class="muted" style="margin-bottom:8px">'+(q.type==='missing'?esc(t('qMissing')):esc(t('qNext')))+'</div>'+
    '<div class="ar" style="font-size:'+(q.type==='next'?'19':'22')+'px;line-height:2;margin-bottom:14px">'+esc(q.text)+'</div>'+
    q.opts.map(o=>'<button class="q-opt ar" onclick="answerQ(this)" data-v="'+encodeURIComponent(o)+'" style="font-size:'+(q.type==='next'?'16':'20')+'px">'+esc(o)+'</button>').join('');
}
function answerQ(btn){
  const q=quiz.qs[quiz.i];
  const v=decodeURIComponent(btn.dataset.v);
  document.querySelectorAll('.q-opt').forEach(b=>{
    b.disabled=true;
    if(decodeURIComponent(b.dataset.v)===q.answer) b.classList.add('ok');
  });
  if(v===q.answer){ quiz.score++; } else { btn.classList.add('bad'); }
  setTimeout(()=>{
    quiz.i++;
    if(quiz.i<quiz.qs.length) renderQ();
    else {
      if(quiz.score===quiz.qs.length && quiz.qs.length>=4) store.flags.quiz=1;
      addMinutes(2); save(); toastMsg(T[store.lang].qDone(quiz.score,quiz.qs.length)); show('study'); checkAch();
    }
  },900);
}
/* ===================== СӨЗДІК (іздеу + жаттау режимі) ===================== */
let vCat='all';
let vcard={list:[],i:0,flip:false};
function knownCount(){ return Object.keys(store.vocabKnown).filter(k=>store.vocabKnown[k]).length; }
function setVocabSub(){
  const el=document.getElementById('vSub');
  if(el) el.textContent=t('vSub')+' · '+VOCAB.length+' '+t('vWord')+' · '+T[store.lang].vKnownN(knownCount());
}
function renderVocab(){
  document.getElementById('vT').textContent=t('vT');
  setVocabSub();
  document.getElementById('vModeListBtn').classList.toggle('on', store.vocabMode==='list');
  document.getElementById('vModeCardsBtn').classList.toggle('on', store.vocabMode==='cards');
  document.getElementById('vListWrap').style.display = store.vocabMode==='list'?'block':'none';
  document.getElementById('vCardsWrap').style.display = store.vocabMode==='cards'?'block':'none';
  let chips='<button class="chip'+(vCat==='all'?' on':'')+'" onclick="setVocabCat(\'all\')">'+esc(t('vAll'))+'</button>';
  Object.keys(window.VOCAB_CATS).forEach(code=>{
    chips+='<button class="chip'+(vCat===code?' on':'')+'" onclick="setVocabCat(\''+code+'\')">'+esc(window.VOCAB_CATS[code][store.lang==='kk'?0:1])+'</button>';
  });
  document.getElementById('vCats').innerHTML=chips;
  renderVocabBody();
}
function setVocabCat(c){ vCat=c; renderVocab(); }
function setVocabMode(m){ store.vocabMode=m; save(); renderVocab(); }
function vQuery(){ const el=document.getElementById('vSearch'); return el?el.value.trim().toLowerCase():''; }
function vFiltered(){
  const q=vQuery();
  return VOCAB.filter(v=>{
    if(vCat!=='all' && v[4]!==vCat) return false;
    if(!q) return true;
    return (v[0]+' '+v[1]+' '+v[2]+' '+v[3]).toLowerCase().includes(q);
  });
}
function clearVSearch(){ const el=document.getElementById('vSearch'); if(el) el.value=''; renderVocabBody(); }
function renderVocabBody(){
  const cl=document.getElementById('vClear'); if(cl) cl.classList.toggle('show', !!vQuery());
  if(store.vocabMode==='cards') renderCards(); else renderVocabList();
}
function renderVocabList(){
  const list=vFiltered();
  const el=document.getElementById('vList');
  if(!list.length){ el.innerHTML='<div class="muted center" style="padding:14px">'+esc(t('vEmpty'))+'</div>'; return; }
  el.innerHTML=list.map(v=>{
    const known=!!store.vocabKnown[v[0]];
    return '<div class="v-item"><div class="v-ar ar">'+esc(v[0])+'</div>'+
      '<div class="v-tx"><b>'+esc(store.lang==='kk'?v[1]:v[2])+'</b>'+
      '<div class="tl">'+esc(v[3])+'</div>'+
      '<div class="muted">'+esc(store.lang==='kk'?v[2]:v[1])+'</div></div>'+
      '<button class="v-star'+(known?' on':'')+'" onclick="toggleKnown(\''+encodeURIComponent(v[0])+'\')" aria-label="known">'+svgIcon('star',22)+'</button></div>';
  }).join('');
}
function toggleKnown(enc){
  const ar=decodeURIComponent(enc);
  if(store.vocabKnown[ar]) delete store.vocabKnown[ar]; else store.vocabKnown[ar]=1;
  save(); renderVocabBody(); setVocabSub();
}
function renderCards(){
  const pool=vFiltered();
  const unknown=pool.filter(v=>!store.vocabKnown[v[0]]);
  vcard={list:shuffle((unknown.length?unknown:pool).slice()), i:0, flip:false};
  drawCard();
}
function drawCard(){
  const area=document.getElementById('vCardArea'), btns=document.getElementById('vCardBtns');
  if(!vcard.list.length){ area.innerHTML='<div class="muted">'+esc(t('vEmpty'))+'</div>'; btns.innerHTML=''; return; }
  if(vcard.i>=vcard.list.length){
    area.innerHTML='<div class="fc-tr">'+esc(t('vCardsDone'))+'</div><div class="fc-count">'+vcard.list.length+'/'+vcard.list.length+'</div>';
    btns.innerHTML='<button class="btn sec" onclick="renderCards()">'+esc(t('vRepeat'))+'</button>';
    return;
  }
  const v=vcard.list[vcard.i];
  if(!vcard.flip){
    area.innerHTML='<div class="fc-count">'+(vcard.i+1)+'/'+vcard.list.length+'</div><div class="fc-ar ar">'+esc(v[0])+'</div><div class="fc-hint">'+esc(t('vFlipHint'))+'</div>';
    btns.innerHTML='';
  } else {
    area.innerHTML='<div class="fc-count">'+(vcard.i+1)+'/'+vcard.list.length+'</div><div class="fc-ar ar" style="font-size:34px">'+esc(v[0])+'</div>'+
      '<div class="fc-tl">'+esc(v[3])+'</div>'+
      '<div class="fc-tr">'+esc(store.lang==='kk'?v[1]:v[2])+'</div>'+
      '<div class="fc-tr2">'+esc(store.lang==='kk'?v[2]:v[1])+'</div>';
    btns.innerHTML='<button class="btn" onclick="cardKnow()">'+svgIcon('check',16)+' '+esc(t('vKnow'))+'</button>'+
      '<button class="btn sec" onclick="cardNext()">'+esc(t('vRepeat'))+'</button>';
  }
}
function flipCard(){ if(vcard.i<vcard.list.length){ vcard.flip=!vcard.flip; drawCard(); } }
function cardKnow(){ const v=vcard.list[vcard.i]; if(v){ store.vocabKnown[v[0]]=1; save(); setVocabSub(); } vcard.i++; vcard.flip=false; drawCard(); }
function cardNext(){ vcard.i++; vcard.flip=false; drawCard(); }

/* ===================== PROGRESS ===================== */
function renderProg(){
  const a=ayahsLearned(), p=Math.min(100,(a/TOTAL_AYAHS*100));
  document.getElementById('pBar').style.width=p+'%';
  document.getElementById('pBarTxt').textContent=T[store.lang].pBarTxt(a,p.toFixed(2));
  const grid=document.getElementById('calGrid'); let html='';
  const d=new Date(); d.setDate(d.getDate()-27);
  for(let i=0;i<28;i++){
    const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    html+='<i class="'+(store.days[k]?'done':'')+'">'+d.getDate()+'</i>';
    d.setDate(d.getDate()+1);
  }
  grid.innerHTML=html;
  const us=Object.entries(store.units).sort((x,y)=>y[1].ts-x[1].ts);
  document.getElementById('pUnits').innerHTML = us.length
    ? us.map(([k,u])=>'<div class="p-item"><span>'+esc(u.label)+'</span><span class="badge '+(u.done?'g':'y')+'">'+u.ayahs+' '+svgIcon('check',13)+'</span></div>').join('')
    : '<div class="muted">'+esc(t('pNoUnits'))+'</div>';
  const w=Object.values(store.weak2).filter(x=>x.ok<3).slice(-30).reverse();
  document.getElementById('pWeak').innerHTML = w.length
    ? '<div class="mem-area" style="font-size:22px;line-height:2.3">'+w.map(x=>'<span class="w weak" title="'+esc(x.ref)+'">'+esc(x.w)+'</span>').join(' ')+'</div>'+
      '<div class="btn-row"><button class="btn sm gold" onclick="startWt()">'+esc(t('wtBtn'))+'</button></div>'
    : '<div class="muted">'+esc(t('pNoWeak'))+'</div>';
  renderPlanSetup(); renderWeek(); renderAch(); renderGrpArea();
}

/* ===================== ТРЕНАЖЁР СЛАБЫХ СЛОВ ===================== */
let wt={list:[],i:0};
function dots(ok){ return '<span class="dot on"></span>'.repeat(ok)+'<span class="dot"></span>'.repeat(Math.max(0,3-ok)); }
function startWt(){
  const es=Object.entries(store.weak2).filter(([k,v])=>v.ok<3);
  if(!es.length){ toastMsg(t('wtEmpty')); return; }
  wt={list:shuffle(es.slice(0,20)), i:0};
  show('wtrain'); renderWt();
}
function renderWt(){
  if(wt.i>=wt.list.length){
    addMinutes(2); save(); toastMsg(t('wtDone')); show('prog'); return;
  }
  const v=wt.list[wt.i][1];
  document.getElementById('wtCard').innerHTML=
    '<div class="muted">'+(wt.i+1)+'/'+wt.list.length+'</div>'+
    '<div class="ar" style="font-size:38px;margin:14px 0">'+esc(v.w)+'</div>'+
    '<div class="muted">'+esc(v.ref)+'</div>'+
    '<div style="margin:10px 0">'+dots(v.ok)+'</div>'+
    '<div class="btn-row" style="justify-content:center">'+
    '<button class="btn" onclick="wtAns(1)">'+esc(t('wtRem'))+'</button>'+
    '<button class="btn sec" onclick="wtAns(0)">'+esc(t('wtNo'))+'</button></div>';
}
function wtAns(ok){
  const k=wt.list[wt.i][0], v=wt.list[wt.i][1];
  if(ok){ v.ok=(v.ok||0)+1; if(v.ok>=3){ delete store.weak2[k]; } else { store.weak2[k]=v; } }
  else { v.ok=0; store.weak2[k]=v; }
  save(); wt.i++; renderWt();
}

/* ===================== SRS ===================== */
const SRS_INT=[1,3,7,14,30,60,120];
function srsSchedule(key,step){ store.srs[key]={step:step, next:Date.now()+SRS_INT[Math.min(step,SRS_INT.length-1)]*864e5}; save(); }
function srsDue(){ const now=Date.now(); return Object.entries(store.srs).filter(([k,v])=>v.next<=now && store.units[k]); }
function renderSrsCard(){
  const c=document.getElementById('srsCard');
  const due=srsDue();
  let html='<h3>'+esc(t('srsT'))+'</h3>';
  if(!due.length){ c.innerHTML=html+'<div class="muted">'+esc(t('srsNone'))+'</div>'; return; }
  html+=due.slice(0,5).map(([k,v])=>
    '<div class="p-item"><span>'+esc(store.units[k].label)+'</span><span style="white-space:nowrap;display:flex;gap:6px">'+
    '<button class="btn sm" onclick="srsRemember(\''+esc(k)+'\')">'+esc(t('srsRem'))+'</button>'+
    '<button class="btn sm sec" onclick="srsForgot(\''+esc(k)+'\')">'+esc(t('srsForgot'))+'</button></span></div>'
  ).join('');
  c.innerHTML=html;
}
function srsRemember(key){ const s=store.srs[key]||{step:0}; srsSchedule(key, s.step+1); addMinutes(1); renderSrsCard(); toastMsg(t('saved')); }
function srsForgot(key){ srsSchedule(key, 0); openUnit(key); }
function openUnit(key){ const u=store.units[key]; if(u&&u.sel){ mode=u.sel.mode||'surah'; renderModeGrid(); renderPicker(u.sel); loadUnit(); } }

/* ===================== TAJWEED ===================== */
function tajweedify(s){
  return esc(s)
    .replace(/([قطبجد]ْ)/g,'<i class="tj q">$1</i>')
    .replace(/([نم]ّ)/g,'<i class="tj g">$1</i>')
    .replace(/(آ|[ء-ي]ٓ)/g,'<i class="tj m">$1</i>');
}
function toggleTj(){ store.tajweed=!store.tajweed; save(); if(unit) renderStudy(); }
function renderTjLegend(){
  const l=document.getElementById('tjLegend');
  if(!store.tajweed){ l.style.display='none'; return; }
  l.style.display='flex';
  l.innerHTML='<span style="color:var(--red)">● '+esc(t('tjQal'))+'</span>'+
    '<span style="color:#1f7a4f">● '+esc(t('tjGhu'))+'</span>'+
    '<span style="color:var(--gold)">● '+esc(t('tjMadd'))+'</span>'+
    '<span class="muted">'+esc(t('tjNote'))+'</span>';
}

/* ===================== VOICE CHECK ===================== */
let rec=null, recOn=false, vTarget=[], vIdx=0;
function normAr(w){
  return w.replace(/[ً-ٰٟۖ-ۭـ۟]/g,'')
          .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
          .replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^ؠ-ي]/g,'');
}
function openVoice(){
  if(!unit) return;
  show('voice'); vTarget=[]; vIdx=0;
  let html='';
  unit.ayahs.forEach(a=>{
    a.ar.split(/\s+/).forEach(w=>{
      const i=vTarget.length;
      vTarget.push({w, n:normAr(w), ref:unit.label+' · '+a.n});
      html+='<span class="vw" id="vw'+i+'">'+esc(w)+'</span> ';
    });
    html+='<span style="color:var(--gold);font-size:17px">﴿'+a.n+'﴾</span> ';
  });
  document.getElementById('vcArea').innerHTML=html;
  document.getElementById('vcStatus').textContent='';
  document.getElementById('micBtn').classList.remove('rec');
  document.getElementById('micBtn').innerHTML=svgIcon('mic',32);
  recOn=false;
}
function vcToggle(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){ toastMsg(t('vcNo')); return; }
  if(recOn){ stopVoice(); return; }
  rec=new SR(); rec.lang='ar-SA'; rec.continuous=true; rec.interimResults=true;
  let processed=0;
  rec.onresult=e=>{
    let words=[];
    for(let i=0;i<e.results.length;i++) words.push(...e.results[i][0].transcript.trim().split(/\s+/));
    for(let i=processed;i<words.length;i++) matchWord(normAr(words[i]));
    let fin=0;
    for(let i=0;i<e.results.length;i++) if(e.results[i].isFinal) fin+=e.results[i][0].transcript.trim().split(/\s+/).length;
    processed=fin;
  };
  rec.onerror=()=>{};
  rec.onend=()=>{ if(recOn){ try{rec.start();}catch(e){}} };
  try{ rec.start(); }catch(e){ toastMsg(t('vcNo')); return; }
  recOn=true;
  document.getElementById('micBtn').classList.add('rec');
  document.getElementById('vcStatus').textContent=t('vcListen');
}
function matchWord(nw){
  if(!nw || vIdx>=vTarget.length) return;
  for(let look=0; look<3 && vIdx+look<vTarget.length; look++){
    if(vTarget[vIdx+look].n===nw){
      for(let s=0;s<look;s++){ markMiss(vIdx+s); }
      const el=document.getElementById('vw'+(vIdx+look));
      if(el && !el.classList.contains('miss')) el.classList.add('ok');
      vIdx+=look+1; return;
    }
  }
}
function markMiss(i){
  const el=document.getElementById('vw'+i);
  if(el && !el.classList.contains('ok') && !el.classList.contains('miss')){
    el.classList.add('miss'); addWeak(vTarget[i].w, vTarget[i].ref);
  }
}
function stopVoice(){
  recOn=false;
  try{ rec && rec.stop(); }catch(e){}
  document.getElementById('micBtn').classList.remove('rec');
  const ok=document.querySelectorAll('.vw.ok').length;
  const miss=document.querySelectorAll('.vw.miss').length;
  document.getElementById('vcStatus').textContent=T[store.lang].vcRes(ok,miss);
  store.flags.voice=1; addMinutes(3); save(); checkAch();
}
let mediaRec=null, chunks=[];
async function recForUstaz(){
  const btn=document.getElementById('vcRecBtn');
  if(mediaRec && mediaRec.state==='recording'){ mediaRec.stop(); return; }
  try{
    const st=await navigator.mediaDevices.getUserMedia({audio:true});
    mediaRec=new MediaRecorder(st); chunks=[];
    mediaRec.ondataavailable=e=>chunks.push(e.data);
    mediaRec.onstop=async()=>{
      st.getTracks().forEach(tr=>tr.stop());
      const blob=new Blob(chunks,{type:mediaRec.mimeType||'audio/webm'});
      btn.textContent=t('vcRecBtn'); btn.classList.remove('danger');
      if(store.group && await fbInit()){
        try{
          const path='groups/'+store.group.code+'/rec/'+fbUser.uid+'_'+Date.now()+'.webm';
          await fb.st.ref(path).put(blob);
          await fb.db.collection('groups').doc(store.group.code).collection('students').doc(fbUser.uid)
            .collection('recordings').add({path:path, ts:Date.now(), unit:unit?unit.label:'', name:store.group.name});
          toastMsg(t('grpUp')); return;
        }catch(e){}
      }
      const f=new File([blob],'tilawah-'+todayKey()+'.webm',{type:blob.type});
      if(navigator.canShare && navigator.canShare({files:[f]})){
        navigator.share({files:[f], title:'Tilawah'}).catch(()=>downloadBlob(blob));
      } else downloadBlob(blob);
      toastMsg(t('vcRecSaved'));
    };
    mediaRec.start();
    btn.textContent=t('vcRecStop'); btn.classList.add('danger');
  }catch(e){ toastMsg(t('vcNo')); }
}
function downloadBlob(blob){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='tilawah-'+todayKey()+'.webm'; a.rel='noopener'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);
}

/* ===================== ХАТИМ-ПЛАН ===================== */
function juzPages(n){ return n===1?[1,21]:[(n-1)*20+2, n===30?604:n*20+1]; }
function renderPlanSetup(){
  const a=document.getElementById('planSetup');
  if(store.plan){
    a.innerHTML='<div class="muted">'+esc(planLabel())+'</div><div class="btn-row"><button class="btn danger sm" onclick="delPlan()">'+esc(t('plDel'))+'</button></div>';
    return;
  }
  a.innerHTML='<label class="fld">'+esc(t('plScope'))+'</label>'+
    '<select id="plScope" onchange="document.getElementById(\'plJuzRow\').style.display=this.value===\'juz\'?\'block\':\'none\'">'+
    '<option value="amma">'+esc(t('plJuzAmma'))+'</option><option value="juz">'+esc(t('plJuz'))+'</option><option value="all">'+esc(t('plAll'))+'</option></select>'+
    '<div id="plJuzRow" style="display:none"><label class="fld">'+esc(t('fJuz'))+'</label><input type="number" id="plJuzN" min="1" max="30" value="1"></div>'+
    '<label class="fld">'+esc(t('plDays'))+'</label><input type="number" id="plDays" min="3" max="1000" value="30">'+
    '<div class="btn-row"><button class="btn" onclick="makePlan()">'+esc(t('plMake'))+'</button></div>';
}
function planLabel(){ const p=store.plan; return (store.lang==='kk'?'Беттер ':'Страницы ')+p.from+'–'+p.to+' · '+p.days+' '+(store.lang==='kk'?'күн':'дн.'); }
function makePlan(){
  const sc=document.getElementById('plScope').value;
  const days=Math.max(3,+document.getElementById('plDays').value||30);
  let from,to;
  if(sc==='amma'){ from=582; to=604; }
  else if(sc==='all'){ from=1; to=604; }
  else { const [f,e]=juzPages(Math.min(30,Math.max(1,+document.getElementById('plJuzN').value||1))); from=f; to=e; }
  store.plan={from,to,days,start:todayKey(),done:{}};
  save(); renderPlanSetup(); toastMsg(t('saved')); show('home');
}
function delPlan(){ store.plan=null; save(); renderPlanSetup(); renderPlanCard(); }
function planState(){
  const p=store.plan; if(!p) return null;
  const total=p.to-p.from+1;
  const per=Math.ceil(total/p.days);
  const doneDays=Object.keys(p.done).length;
  if(doneDays>=p.days || p.from+doneDays*per>p.to) return {fin:true};
  const dayN=doneDays+1;
  const f=p.from+doneDays*per;
  const e=Math.min(p.to, f+per-1);
  const elapsed=Math.floor((Date.now()-new Date(p.start+'T00:00:00').getTime())/864e5)+1;
  return {fin:false, dayN, f, e, behind:Math.max(0,elapsed-dayN)};
}
function renderPlanCard(){
  const c=document.getElementById('planCard');
  let html='<h3>'+esc(t('plT'))+'</h3>';
  if(!store.plan){ c.innerHTML=html+'<div class="muted">'+esc(t('plNone'))+'</div>'; return; }
  const s=planState();
  if(s.fin){ c.innerHTML=html+'<b>'+esc(t('plFin'))+'</b>'; return; }
  html+='<b>'+T[store.lang].plDay(s.dayN,store.plan.days)+'</b> '+(s.behind?'<span class="muted">'+T[store.lang].plBehind(s.behind)+'</span>':'')+
    '<div class="muted" style="margin-top:4px">'+T[store.lang].plPages(s.f,s.e)+'</div>'+
    '<div class="bar"><i style="width:'+(Object.keys(store.plan.done).length/store.plan.days*100)+'%"></i></div>'+
    '<div class="btn-row"><button class="btn sm" onclick="openPlanPage('+s.f+')">'+esc(t('plOpen'))+'</button>'+
    '<button class="btn sm gold" onclick="planDoneToday()">'+esc(t('plDoneBtn'))+'</button></div>';
  c.innerHTML=html;
}
function openPlanPage(p){ mode='page'; renderModeGrid(); renderPicker({n:p}); loadUnit(); }
function planDoneToday(){
  const s=planState(); if(!s||s.fin) return;
  store.plan.done['d'+s.dayN]=todayKey();
  const s2=planState(); if(s2&&s2.fin) store.flags.plan=1;
  addMinutes(5); save(); renderPlanCard(); renderHome(); toastMsg(t('todayDone')); checkAch();
}

/* ===================== СЛУШАЙ И ПОВТОРЯЙ ===================== */
let loop={on:false,i:0,rep:0,n:3};
function toggleLoop(){ loop.on ? stopLoop() : startLoop(); }
function startLoop(){
  if(!unit) return;
  loop={on:true,i:0,rep:0,n:+document.getElementById('loopN').value||3};
  document.getElementById('loopBtn').textContent=t('loopStop');
  playLoopStep();
}
function playLoopStep(){
  if(!loop.on || loop.i>=unit.ayahs.length){ stopLoop(); return; }
  document.querySelectorAll('.ayah-card.cur').forEach(e=>e.classList.remove('cur'));
  const card=document.getElementById('ac'+loop.i);
  if(card){ card.classList.add('cur'); card.scrollIntoView({block:'center',behavior:'smooth'}); }
  if(audio) audio.pause();
  audio=new Audio(audioUrl(unit.ayahs[loop.i].global));
  audio.onended=()=>{ loop.rep++; if(loop.rep>=loop.n){ loop.rep=0; loop.i++; } playLoopStep(); };
  audio.play().catch(()=>stopLoop());
}
function stopLoop(){
  loop.on=false; if(audio) audio.pause();
  document.querySelectorAll('.ayah-card.cur').forEach(e=>e.classList.remove('cur'));
  const b=document.getElementById('loopBtn'); if(b) b.textContent=t('loopStart');
}

/* ===================== ДОСТИЖЕНИЯ ===================== */
const ACH=[['first','seed'],['a10','leaf'],['a50','tree'],['a100','star'],['a300','crescent'],
  ['s3','flame'],['s7','flame'],['s30','trophy'],['quiz','target'],['mem','book'],['voice','mic'],['plan','flag']];
function checkAch(){
  const a=ayahsLearned(), s=streak(), f=store.flags;
  const cond={first:Object.values(store.units).some(u=>u.done),
    a10:a>=10, a50:a>=50, a100:a>=100, a300:a>=300,
    s3:s>=3, s7:s>=7, s30:s>=30,
    quiz:!!f.quiz, mem:!!f.mem, voice:!!f.voice, plan:!!f.plan};
  let newest=null;
  ACH.forEach(([id])=>{ if(cond[id] && !store.ach[id]){ store.ach[id]=Date.now(); newest=id; } });
  if(newest){ save(); toastMsg(T[store.lang].ach[newest]); }
}
function renderAch(){
  document.getElementById('achGrid').innerHTML=ACH.map(([id,ico])=>
    '<div class="ach'+(store.ach[id]?' got':'')+'"><div class="ach-ic">'+svgIcon(ico,20)+'</div><b>'+esc(T[store.lang].ach[id])+'</b></div>'
  ).join('');
}

/* ===================== СТАТИСТИКА НЕДЕЛИ ===================== */
function renderWeek(){
  const d=new Date(); d.setDate(d.getDate()-6);
  const rows=[]; let max=1;
  for(let i=0;i<7;i++){
    const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const m=store.days[k]||0; if(m>max) max=m;
    rows.push({m, lbl:T[store.lang].days[(d.getDay()+6)%7]});
    d.setDate(d.getDate()+1);
  }
  document.getElementById('wkChart').innerHTML=rows.map(r=>
    '<div><u>'+(r.m||'')+'</u><i style="height:'+Math.max(3,r.m/max*72)+'px"></i><b>'+esc(r.lbl)+'</b></div>'
  ).join('');
}

/* ===================== ОБЛАКО (Firebase) ===================== */
let fb=null, fbUser=null;
function fbReady(){ return typeof firebase!=='undefined' && window.QJ_FIREBASE && window.QJ_FIREBASE.apiKey && window.QJ_FIREBASE.apiKey.indexOf('PASTE')!==0; }
async function fbInit(){
  if(fb) return fb;
  if(!fbReady()) return null;
  try{
    if(!firebase.apps.length) firebase.initializeApp(window.QJ_FIREBASE);
    fb={db:firebase.firestore(), st:firebase.storage(), auth:firebase.auth()};
    if(!fb.auth.currentUser){ const c=await fb.auth.signInAnonymously(); fbUser=c.user; } else fbUser=fb.auth.currentUser;
    return fb;
  }catch(e){ fb=null; return null; }
}
async function joinGroup(){
  const code=(document.getElementById('grpCodeIn').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const name=(document.getElementById('grpNameIn').value||'').trim().slice(0,30);
  if(!code||!name) return;
  if(!fbReady()){ toastMsg(t('grpNeedCfg')); return; }
  if(!await fbInit()){ toastMsg(t('grpErr')); return; }
  store.group={code:code, name:name}; save();
  await syncGroup(); renderGrpArea(); loadFeedback(); toastMsg(t('grpSynced'));
}
function leaveGroup(){ store.group=null; save(); renderGrpArea(); }
async function syncGroup(){
  if(!store.group) return;
  if(!await fbInit()) return;
  try{
    await fb.db.collection('groups').doc(store.group.code).collection('students').doc(fbUser.uid)
      .set({name:store.group.name, ayahs:ayahsLearned(), streak:streak(), minToday:store.days[todayKey()]||0, lang:store.lang, ts:Date.now()},{merge:true});
  }catch(e){}
}
async function loadFeedback(){
  const el=document.getElementById('grpFb');
  if(!el||!store.group||!await fbInit()) return;
  try{
    const q=await fb.db.collection('groups').doc(store.group.code).collection('students').doc(fbUser.uid)
      .collection('feedback').orderBy('ts','desc').limit(5).get();
    el.innerHTML = q.empty ? '<div class="muted">'+esc(t('grpNoFb'))+'</div>'
      : q.docs.map(d=>{ const x=d.data();
          return '<div class="p-item" style="display:block"><div style="font-size:13.5px">'+esc(x.text||'')+'</div>'+
                 '<div class="muted" style="font-size:11px">'+esc(new Date(x.ts).toLocaleDateString())+'</div></div>'; }).join('');
  }catch(e){ el.innerHTML='<div class="muted">'+esc(t('grpNoFb'))+'</div>'; }
}
function renderGrpArea(){
  const a=document.getElementById('grpArea'); if(!a) return;
  if(store.group){
    a.innerHTML='<div class="p-item"><b>'+esc(T[store.lang].grpIn(store.group.code))+'</b>'+
      '<button class="btn sm sec" onclick="leaveGroup()">'+esc(t('grpLeave'))+'</button></div>'+
      '<h3 style="margin-top:10px;font-size:14px;color:var(--green)">'+esc(t('grpFbT'))+'</h3><div id="grpFb"></div>';
    loadFeedback();
  } else {
    a.innerHTML='<div class="muted" style="margin-bottom:6px">'+esc(t('grpSub2'))+'</div>'+
      '<label class="fld">'+esc(t('grpCode'))+'</label><input type="text" id="grpCodeIn" maxlength="8" style="text-transform:uppercase">'+
      '<label class="fld">'+esc(t('grpName'))+'</label><input type="text" id="grpNameIn" maxlength="30">'+
      '<div class="btn-row"><button class="btn sm" onclick="joinGroup()">'+esc(t('grpJoin'))+'</button></div>';
  }
}

/* ============== СРАВНЕНИЕ С ЭТАЛОНОМ (на устройстве) ============== */
let cmpMR=null, cmpChunks=[];
function cmpToggle(){ if(cmpMR && cmpMR.state==='recording'){ cmpMR.stop(); return; } startCmpRec(); }
async function startCmpRec(){
  const btn=document.getElementById('cmpBtn');
  try{
    const st=await navigator.mediaDevices.getUserMedia({audio:true});
    cmpMR=new MediaRecorder(st); cmpChunks=[];
    cmpMR.ondataavailable=e=>cmpChunks.push(e.data);
    cmpMR.onstop=()=>{ st.getTracks().forEach(tr=>tr.stop()); btn.textContent=t('cmpStart'); cmpAnalyze(new Blob(cmpChunks,{type:cmpMR.mimeType||'audio/webm'})); };
    cmpMR.start(); btn.textContent=t('cmpStop'); document.getElementById('cmpRes').innerHTML='';
  }catch(e){ toastMsg(t('cmpErr')); }
}
function refDuration(){
  return Promise.all(unit.ayahs.map(a=>new Promise(res=>{
    const x=new Audio(); x.preload='metadata';
    x.onloadedmetadata=()=>res(x.duration||0); x.onerror=()=>res(0); x.src=audioUrl(a.global);
  }))).then(ds=>ds.reduce((s,d)=>s+d,0));
}
async function cmpAnalyze(blob){
  const res=document.getElementById('cmpRes');
  res.innerHTML='<div class="muted">'+esc(t('cmpWait'))+'</div>';
  try{
    const ab=await blob.arrayBuffer();
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const buf=await ctx.decodeAudioData(ab);
    const ch=buf.getChannelData(0), sr=buf.sampleRate;
    const frame=Math.round(sr*0.05); const rms=[];
    for(let i=0;i+frame<ch.length;i+=frame){ let s=0; for(let j=i;j<i+frame;j++) s+=ch[j]*ch[j]; rms.push(Math.sqrt(s/frame)); }
    const peak=Math.max(...rms,0.0001), th=peak*0.12;
    let first=-1,last=-1; rms.forEach((v,i)=>{ if(v>th){ if(first<0)first=i; last=i; } });
    if(first<0) throw new Error('silent');
    const myD=(last-first+1)*0.05;
    let pauses=0, run=0;
    for(let i=first;i<=last;i++){ if(rms[i]<=th){ run++; } else { if(run>=14) pauses++; run=0; } }
    const refD=await refDuration();
    let verdict='';
    if(refD>1){ const diff=Math.round((myD-refD)/refD*100);
      verdict = diff<-15 ? T[store.lang].cmpFaster(Math.abs(diff)) : diff>25 ? T[store.lang].cmpSlower(diff) : T[store.lang].cmpPace; }
    const maxD=Math.max(myD,refD,1);
    res.innerHTML=
      '<div style="font-size:12.5px;font-weight:700;color:var(--ink2)">'+esc(t('cmpYou'))+': '+myD.toFixed(1)+' '+esc(t('cmpSec'))+'</div>'+
      '<div class="bar"><i style="width:'+(myD/maxD*100)+'%"></i></div>'+
      (refD>1?'<div style="font-size:12.5px;font-weight:700;color:var(--ink2);margin-top:6px">'+esc(t('cmpRef'))+': '+refD.toFixed(1)+' '+esc(t('cmpSec'))+'</div>'+
      '<div class="bar"><i style="width:'+(refD/maxD*100)+'%;background:var(--gold)"></i></div>':'')+
      '<div style="margin-top:10px;font-size:13.5px">'+esc(verdict)+'</div>'+
      (pauses>2?'<div class="muted" style="margin-top:5px">'+esc(T[store.lang].cmpPauses(pauses))+'</div>':'');
    addMinutes(3); save();
  }catch(e){ res.innerHTML='<div class="muted" style="color:var(--red)">'+esc(t('cmpErr'))+'</div>'; }
}

/* ===================== SHARE ===================== */
function shareProgress(){
  const a=ayahsLearned(), p=Math.min(100,(a/TOTAL_AYAHS*100)).toFixed(2);
  const txt=T[store.lang].shTxt(a,streak(),p);
  if(navigator.share){ navigator.share({text:txt}).catch(()=>{}); }
  else if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(()=>toastMsg(t('copied'))); }
}

/* ===================== REMINDER ===================== */
let remInterval=null;
function renderSet(){
  document.getElementById('remTime').value=store.remTime;
  document.getElementById('remStatus').textContent = store.remEnabled ? t('remOk') : '';
  renderThemeGrid(); renderBgGrid();
}
function enableReminder(){
  store.remTime=document.getElementById('remTime').value||'20:00';
  if(!('Notification' in window)){ toastMsg(t('remNo')); return; }
  Notification.requestPermission().then(p=>{
    if(p==='granted'){ store.remEnabled=true; save(); startRemLoop(); renderSet(); toastMsg(t('remOk')); }
    else toastMsg(t('remNo'));
  });
}
function startRemLoop(){
  if(remInterval) clearInterval(remInterval);
  remInterval=setInterval(()=>{
    if(!store.remEnabled) return;
    const n=new Date();
    const hm=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');
    if(hm===store.remTime && !store.days['_notif_'+todayKey()]){
      store.days['_notif_'+todayKey()]=1; save();
      const m=MOT[n.getDate()%MOT.length];
      try{ new Notification(t('notifTitle'), {body:(store.lang==='kk'?m.kk:m.ru)}); }catch(e){}
    }
  },30000);
}

/* ===================== DATA ===================== */
function exportData(){
  const txt=JSON.stringify(store,null,1);
  if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(()=>toastMsg(t('copied'))); }
}
function resetData(){
  if(confirm(t('resetQ'))){
    store=defaults({lang:store.lang, theme:store.theme, bg:store.bg, bgCustom:store.bgCustom, bgOpacity:store.bgOpacity});
    save(); applyTheme(); applyBg(); applyLang(); toastMsg(t('saved'));
  }
}

/* ===================== INIT ===================== */
/* v5: warm theme, dark mode, фон, сүре бойынша, сөздік іздеу+карталар, қауіпсіздік */
buildNav();
applyTheme();
applyBg();
applyLang();
if(store.remEnabled && 'Notification' in window && Notification.permission==='granted') startRemLoop();
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
if(store.group){ setTimeout(()=>{ syncGroup(); }, 2500); }

