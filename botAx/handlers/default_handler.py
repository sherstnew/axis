from aiogram import Router, F
from aiogram.types import Message
from botAx.keyboards.row_keyboard import make_keyboard_row
from botAx.global_params import available_start_choice
from aiogram.fsm.context import FSMContext
from botAx.classes.UsersChoice import UsersChoice

router = Router()


@router.message(F.text == 'Вернуться')
async def back_handler(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
        "Вы вернулись в начало! Выберите то что хотите сделать",
        reply_markup=make_keyboard_row(available_start_choice))
    await state.set_state(UsersChoice.start_choosing)


@router.message(F.text)
async def default_answer(message: Message):
    await message.answer(
        "Что то пошло не так! Попробуй еще раз, если не получиться перезапусти бота /start",
        reply_markup=make_keyboard_row(available_start_choice))
