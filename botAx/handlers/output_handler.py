from aiogram import Router, F
from aiogram.types import Message, FSInputFile
from botAx.classes.UsersChoice import UsersChoice
from botAx.global_params import available_output_choice, available_start_choice
from aiogram.fsm.context import FSMContext
from botAx.graphDrawer.draw_linear_graph import draw_linear_graph
from botAx.graphDrawer.draw_circular_graph import draw_circular_graph
from botAx.graphDrawer.draw_histogram import draw_histogram
from botAx.keyboards.row_keyboard_with_come_back import row_keyboard_with_come_back
from botAx.keyboards.row_keyboard import make_keyboard_row

router = Router()


@router.message(UsersChoice.output_choosing, F.text.in_(available_output_choice))
async def choose_move(message: Message, state: FSMContext):
    await state.update_data(chosen_graph=message.text.lower())
    if message.text.lower() == available_output_choice[0].lower():
        draw_histogram()
        image_from_pc = FSInputFile("image.png")
        await message.answer_photo(
            image_from_pc,
            caption="Информация о запросах за последние 7 дней")
    elif message.text.lower() == available_output_choice[1].lower():
        draw_linear_graph()
        image_from_pc = FSInputFile("image.png")
        await message.answer_photo(
            image_from_pc,
            caption="Информация о запросах за последние 7 дней")
    elif message.text.lower() == available_output_choice[2].lower():
        draw_circular_graph()
        image_from_pc = FSInputFile("image.png")
        await message.answer_photo(
            image_from_pc,
            caption="Информация о запросах за последние 7 дней")


@router.message(UsersChoice.output_choosing, F.text != 'Вернуться')
async def choose_move_wrong(message: Message):
    await message.answer(
        text="Я не знаю такой диаграммы! Попробуй снова на клавиатуре!",
        reply_markup=row_keyboard_with_come_back(available_output_choice))
