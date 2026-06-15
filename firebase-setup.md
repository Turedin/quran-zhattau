# Настройка облака (Firebase) — 15 минут, бесплатно

Облако включает: кабинет устаза, группы учеников, синхронизацию прогресса и отправку записей чтения. Без настройки приложение работает как раньше — просто без этих функций.

## Шаг 1. Создать проект

1. Откройте console.firebase.google.com (нужен аккаунт Google) → «Create a project».
2. Имя: например `quran-jattau`. Google Analytics можно отключить. → Create.

## Шаг 2. Включить вход (Authentication)

1. В меню слева: Build → Authentication → Get started.
2. Вкладка Sign-in method → включите **Anonymous** (для учеников) и **Email/Password** (для устаза).

## Шаг 3. База данных (Firestore)

1. Build → Firestore Database → Create database → Production mode → регион `europe-west` (или ближайший) → Enable.
2. Вкладка Rules → замените всё на текст ниже → Publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /groups/{code} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.token.firebase.sign_in_provider == 'password';
      allow update, delete: if request.auth != null && resource.data.ustazUid == request.auth.uid;

      function isUstaz() {
        return get(/databases/$(db)/documents/groups/$(code)).data.ustazUid == request.auth.uid;
      }

      match /students/{uid} {
        allow read: if request.auth != null && (request.auth.uid == uid || isUstaz());
        allow write: if request.auth != null && request.auth.uid == uid;

        match /recordings/{rid} {
          allow read: if request.auth != null && (request.auth.uid == uid || isUstaz());
          allow create: if request.auth != null && request.auth.uid == uid;
        }
        match /feedback/{fid} {
          allow read: if request.auth != null && (request.auth.uid == uid || isUstaz());
          allow create: if request.auth != null && isUstaz();
        }
      }
    }
  }
}
```

## Шаг 4. Хранилище записей (Storage)

1. Build → Storage → Get started → Production mode → тот же регион.
2. Вкладка Rules → замените на:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /groups/{code}/rec/{file} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 20 * 1024 * 1024;
    }
  }
}
```

(лимит 20 МБ на запись — этого хватает на ~20 минут чтения)

## Шаг 5. Подключить приложение

1. Шестерёнка (Project settings) → внизу «Your apps» → значок `</>` (Web) → имя `quran-app` → Register.
2. Скопируйте значения из показанного `firebaseConfig` в файл **firebase-config.js** в этой папке (замените PASTE_...).
3. Загрузите обновлённую папку на хостинг (GitHub Pages / Netlify — см. README-PWA.md). Файлов теперь 8: index.html, ustaz.html, firebase-config.js, manifest.json, sw.js, 2 иконки, README.

## Как пользоваться

**Устаз**: открывает `https://ваш-сайт/ustaz.html` → регистрируется по email → «Создать группу» → передаёт ученикам 6-значный код.

**Ученик**: в приложении → вкладка «Прогресс» → блок «Устаз / группа» → вводит код и имя. С этого момента прогресс синхронизируется автоматически, а кнопка «Записать для устаза» отправляет аудио прямо в кабинет.

**Устаз видит**: список учеников (аяты, стрик, минуты, последняя активность), слушает записи, пишет отзывы — ученик видит их в своём блоке «Отзывы устаза».

## Лимиты бесплатного тарифа (Spark)

1 ГБ Firestore, 5 ГБ Storage, 50 тыс. чтений/день — для группы до ~100 учеников этого достаточно с запасом. Карта не требуется.
