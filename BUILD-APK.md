# Установка «Құран жаттау» на Android

Готовый APK я не приложил, потому что для его сборки нужен Android SDK + JDK + Gradle
и доступ к их репозиториям (в среде, где я работаю, это закрыто). Ниже — три рабочих
пути, от самого простого к полноценному APK. Файлы приложения лежат в этой папке (`quran-pwa`).

---

## Путь 1. Установить как приложение без APK (быстро, 2 минуты)

Приложение уже PWA, его можно «установить» прямо из браузера — будет иконка на экране,
офлайн-режим и полноэкранный вид, без сборки.

1. Выложите папку на любой HTTPS-адрес (см. «Хостинг» ниже) — например GitHub Pages.
2. Откройте ссылку в **Chrome на Android**.
3. Меню (⋮) → **«Установить приложение»** / **«Добавить на главный экран»**.

Готово. Этого достаточно для личного пользования. Минус — нет файла `.apk` для рассылки
и нельзя опубликовать в Google Play.

---

## Путь 2. APK через PWABuilder (проще всего, без Android Studio)

PWABuilder — официальный инструмент Microsoft/Google: по ссылке на ваше PWA он сам
генерирует **подписанный APK/AAB**.

1. Выложите папку на HTTPS (см. «Хостинг»).
2. Откройте https://www.pwabuilder.com и вставьте адрес вашего сайта.
3. Нажмите **Package For Stores → Android → Generate**.
4. Скачайте архив. В нём:
   - `app-release-signed.apk` — можно сразу ставить на телефон (sideload);
   - `.aab` + ключ подписи — для загрузки в Google Play.

Подсказка: при первом запуске PWABuilder спросит package id — укажите `kz.quranzhattau.app`.

---

## Путь 3. Локальный APK через Capacitor (офлайн, без хостинга)

Самостоятельный APK, который содержит все файлы внутри и работает без интернета.
Нужен **Android Studio** (он сам поставит JDK и Android SDK) и **Node.js**.

Я подготовил проект в папке **`android-build/`**. Шаги:

```bash
cd quran-pwa/android-build

npm install                 # поставит Capacitor (нужен интернет)
npm run init:android        # скопирует файлы в www/ и создаст проект android/
npm run open                # откроет проект в Android Studio
```

В Android Studio:

1. Дождитесь окончания индексации (Gradle sync).
2. Меню **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. Когда появится уведомление «APK(s) generated» — нажмите **locate**.
   Файл будет тут: `android/app/build/outputs/apk/debug/app-debug.apk`.
4. Перекиньте `app-debug.apk` на телефон и установите (включите «Установка из неизвестных источников»).

Для версии в Google Play соберите подписанный релиз: **Build → Generate Signed Bundle / APK**.

Если меняли файлы приложения — повторно выполните `npm run sync`, затем пересоберите.

Идентификатор приложения и название уже заданы в `android-build/capacitor.config.json`
(`appId: kz.quranzhattau.app`, `appName: Құран жаттау`).

---

## Хостинг (для путей 1 и 2) — бесплатно через GitHub Pages

1. Создайте репозиторий на github.com и загрузите туда содержимое папки `quran-pwa`
   (`index.html`, `styles.css`, `app.js`, `vocab.js`, `manifest.json`, `sw.js`, иконки).
2. Settings → **Pages** → Source: ветка `main`, папка `/root` → Save.
3. Через 1–2 минуты появится адрес вида `https://<ваш-логин>.github.io/<репозиторий>/`.

PWA и service worker работают только по **HTTPS** (или на `localhost`) — у GitHub Pages
HTTPS включён по умолчанию.

---

## Что выбрать

- Нужно «прямо сейчас и для себя» → **Путь 1**.
- Нужен файл `.apk` без возни с Android Studio → **Путь 2** (PWABuilder).
- Нужен полностью офлайн APK / публикация в Play → **Путь 3** (Capacitor).
