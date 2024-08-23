from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from botAx.classes.UsersChoice import UsersChoice
from botAx.global_params import available_output_choice, available_start_choice
from botAx.keyboards.input_keyboard import input_keyboard
from botAx.keyboards.row_keyboard import make_keyboard_row
from botAx.keyboards.row_keyboard_with_come_back import row_keyboard_with_come_back

router = Router()


@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
        "Привет👋,\nВыберите на клавиатуре то, что вы хотите сделать📒",
        reply_markup=make_keyboard_row(available_start_choice))
    await state.set_state(UsersChoice.start_choosing)


@router.message(UsersChoice.start_choosing, F.text.in_(available_start_choice))
async def choose_move(message: Message, state: FSMContext):
    await state.update_data(chosen_move=message.text.lower())
    if message.text.lower() == available_start_choice[0].lower():
        await message.answer(
            text="Хорошо👍! Теперь выберите какую диаграмму хотите получить по виртуальным застройкам за последнюю"
                 " неделю📊",
            reply_markup=row_keyboard_with_come_back(available_output_choice))
        await state.set_state(UsersChoice.output_choosing)
        return
    await state.set_state(UsersChoice.input_choosing)
    await message.answer(
        text="Хорошо👍! Теперь выберите способ передать координаты🔃",
        reply_markup=input_keyboard())


@router.message(UsersChoice.start_choosing, F.text != 'Вернуться🔙')
async def choose_move_wrong(message: Message):
    await message.answer(
        text="Неизвестное действие! Попробуйте еще раз на клавиатуре🔄",
        reply_markup=row_keyboard_with_come_back(available_output_choice))
