# TgQuoteBot

Telegram Bot для создания стикеров из сообщений. Генератор изображений взят из бота [QuotLyBot](https://github.com/LyoSU/quote-bot) от LyoSU.


## Конфигурация и запуск бота

Клониурйте репозиторий и перейдите в каталог:

```bash
git clone https://github.com/alchemist-ifz/tg-quote-bot
cd tg-quote-bot
```


Скопируйте `config.example.js` в `config.js` и заполните поля:

- `BOT_TOKEN` - токен Telegram Bot
- `admins` - администраторы бота
- `active_chats` - чаты, в которых бот сможет отвечать (остальные чаты будут игнорироваться)
- `owner_id` - владелец бота, ему будут принадлежать наборы стикеров, так же ему будут отправляться уведомления об ошибках
- `protect_kitten` - установите `true`, если не хотите чтобы кто-то могу удалить котика из набора (стикер-заглушка, который изначально должен присутствовать в наборе, чтобы набор был виден)

Если вы хотите использовать бота в группе, убедитесь что в настройках бота отключен [режим приватности](https://core.telegram.org/bots/features#privacy-mode) (по умолчанию он включен у всех ботов), чтобы бот мог видеть все сообщения, либо используйте полное имя вашего бота при выполнении команд (`/command@this_bot`) иначе бот не будет видеть команды.


Запустите бота:

```bash
./run.sh
```


Для обновления бота выполните:

```bash
./update.sh
```


## Использование бота

1. Создайте новый набор стикеров с помощью команды `/newpack main`, будет создан набор стикеров с именем в формате `main_by_namebot`. Этот набор станет набором по умолчанию. Стикеры будут добавляться в него.
2. Далее ответьте на текстовое сообщение, из которого хотите сделать стикер и выполните команду `/q`.
3. Затем добавьте стикер в набор, используя команду `/add`. Так же вы можете добавить любой статичный стикер в набор.
4. Просмотреть список созданных наборов можно через команду `/listpack`.
5. Удалить стикер из набора можно указав его порядковый номер `/del N` (отчёт начинается с 0) или ответив на стикер, который хотите удалить и выполнив команду `/del`.
6. Если вы создали больше одного набора, вы можете изменить основной набор командой `/setmainpack name` (в качестве `name` используется имя, указанное при создании набора, в нашем примере это `main`).
7. Краткая справка доступна в самом боте, при вызове команды `/help`.


## Справка по боту

```
Основные команды:
/q - создать стикер
/add - добавить стикер в основной набор

Вспомогательные команды:
/listpack - показать список наборов стикеров

Команды для администраторов:
/del - удалить стикер из основного набора
/newpack - создать набор стикеров
/setmainpack - установить набор стикеров как основной
/report - получить отчёт о состоянии бота
```


## TODO

1. Доработать отчёт для администраторов.
2. Добавить тесты.
3. Добавить обработку группы сообщений.