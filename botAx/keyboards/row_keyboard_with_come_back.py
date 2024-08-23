from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder


def row_keyboard_with_come_back(data) -> ReplyKeyboardMarkup:
    kb = ReplyKeyboardBuilder()

    for i in data:
        kb.add(KeyboardButton(text=i))

    kb.add(KeyboardButton(text='Вернуться🔙'))
    kb.adjust(2)
    return kb.as_markup(resize_keyboard=True, one_time_keyboard=True)
