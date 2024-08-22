from aiogram import Router, F
from aiogram.types import Message
from botAx.classes.UsersChoice import UsersChoice
from botAx.keyboards.row_keyboard_with_come_back import row_keyboard_with_come_back
from botAx.global_params import available_input_choice
from aiogram.fsm.context import FSMContext
from botAx.other_functions import check_digits

router = Router()


@router.message(UsersChoice.input_choosing, F.text == None)
async def geo_handler(message: Message, state: FSMContext):
    await choose_cords(message, state)



@router.message(UsersChoice.input_choosing, F.text == available_input_choice[1])
async def choose_cords(message: Message, state: FSMContext):
    if available_input_choice[1] == message.text:
        await state.set_state(UsersChoice.choose_cords_writing)
        await message.answer(
            text="Хорошо! Теперь необходимо заполнить анкету для получения данных о возможной будущей"
                 " загруженности района. Введите данные и координаты от которых в радиусе 385 метров создасться "
                 "виртуальная застройка\n\nВот анкета для заполнения необходимых данных:\n1)Широта\n2)Долгота\n"
                 "3)Количество домов\n4)Площадь"
                 " Апартаментов\n5)Площадь Многоквартирных домов\n6)Нежилплощадь\n7)Средняя загруженность ТС в час пик"
                 " (баллы 1-10)\n8)Средний пассажиропоток на станции в час пик (тыс. чел / час)\n9)Средняя пропускная"
                 " способность на"
                 " станциях в час пик (тыс. чел / час)\n\nПисать все с новой строки и без обозначний.\nПример:"
                 "\n54.3343\n34.6543\n50\n500\n1000\n2000\n7\n200.8\n45.3")
        return
    await state.set_state(UsersChoice.cords_writing)
    cords = (message.location.latitude, message.location.longitude)
    await state.update_data(cords=cords)
    await message.answer(
        text="Отлично! Координаты получены, теперь в радиусе 385 метров от вас создана виртуальная застройка"
             " для которой необходимо внести дополнительные данные для получения данных о возмужной будущей"
             " загруженности.\n\nВот анкета для заполнения необходимых данных:\n1)Количество домов\n2)Площадь"
             " Апартаментов\n3)Площадь Многоквартирных домов\n4)Нежилплощадь\n5)Средняя загруженность ТС в час пик"
             " (баллы 1-10)\n6)Средний пассажиропоток на станции в час пик (тыс. чел / час)\n7)Средняя пропускная"
             " способность на"
             " станциях в час пик (тыс. чел / час)\n\nПисать все с новой строки и без обозначний.\nПример:"
             " \n50\n500\n1000\n2000\n7\n200.8\n45.3")


@router.message(UsersChoice.cords_writing)
async def data_confirm(message: Message, state: FSMContext):
    text = message.text.split('\n')
    if len(text) != 7 or not check_digits(text) or [i for i in text if float(i) < 0] or not 1 <= int(text[6]) <= 10:
        await message.answer(
            text="Данные введены неверно!\nПопробуйте еще раз в точности по списку:\n1)Количество домов\n2)Площадь"
                 " Апартаментов\n3)Площадь Многоквартирных домов\n4)Нежилплощадь\n5)Средняя загруженность ТС в час пик"
                 " (баллы 1-10)\n6)Средний пассажиропоток на станции в час пик (тыс. чел / час)\n7)Средняя пропускная"
                 " способность на"
                 " станциях в час пик (тыс. чел / час)\n\nПисать все с новой строки и без обозначний.\nПример:"
                 " \n50\n500\n1000\n2000\n7\n200.8\n45.3")
        return
    # запрос ане
    data = await state.get_data()
    print(data)
    await message.answer(text='Все получилось! Ожидайте обработки')
    await state.clear()


@router.message(UsersChoice.choose_cords_writing)
async def choose_data_confirm(message: Message, state: FSMContext):
    text = message.text.split('\n')
    if (len(text) != 9 or not check_digits(text) or [i for i in text if float(i) < 0] or not -90 <= float(text[0]) <= 90
            or not -180 <= float(text[1]) <= 180 or not 1 <= int(text[6]) <= 10):
        await message.answer(
            text="Данные введены неверно!\nПопробуйте еще раз в точности по списку:\n1)Широта\n2)Долгота\n"
                 "3)Количество домов\n4)Площадь"
                 " Апартаментов\n5)Площадь Многоквартирных домов\n6)Нежилплощадь\n7)Средняя загруженность ТС в час пик"
                 " (баллы 1-10)\n8)Средний пассажиропоток на станции в час пик (тыс. чел / час)\n9)Средняя пропускная"
                 " способность на"
                 " станциях в час пик (тыс. чел / час)\n\nПисать все с новой строки и без обозначний.\nПример:"
                 "\n54.3343\n34.6543\n50\n500\n1000\n2000\n7\n200.8\n45.3")
        return
    # запрос ане
    await message.answer(text='Все получилось! Ожидайте обработки')
    await state.clear()

@router.message(UsersChoice.choose_cords_writing)
async def choose_data_wrong(message: Message, state: FSMContext):
    await state.update_data(chosen_cords=message.text.lower())
    await message.answer(
        text="Не получилось! Попробуй выбрать способ поделиться координатами на клавиатуре еще раз",
        reply_markup=row_keyboard_with_come_back(available_input_choice))
