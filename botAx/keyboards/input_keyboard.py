from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from botAx.global_params import available_input_choice


def input_keyboard() -> ReplyKeyboardMarkup:
    kb = ReplyKeyboardBuilder()

    kb.add(KeyboardButton(text=available_input_choice[0], request_location=True))
    kb.add(KeyboardButton(text=available_input_choice[1]))
    kb.add(KeyboardButton(text='Вернуться'))

    kb.adjust(2)
    return kb.as_markup(resize_keyboard=True, one_time_keyboard=True)
