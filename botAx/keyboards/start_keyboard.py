from aiogram.types import ReplyKeyboardMarkup
from aiogram.utils.keyboard import ReplyKeyboardBuilder


def kb_start() -> ReplyKeyboardMarkup:
    kb = ReplyKeyboardBuilder()
    kb.button(text="Да")
    kb.button(text="Нет")
    kb.adjust(2)
    return kb.as_markup(resize_keyboard=True, one_time_keyboard=True)
