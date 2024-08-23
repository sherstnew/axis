from aiogram import Router, F
from aiogram.types import Message
from botAx.classes.UsersChoice import UsersChoice
from botAx.keyboards.row_keyboard_with_come_back import row_keyboard_with_come_back
from botAx.keyboards.row_keyboard import make_keyboard_row
from botAx.global_params import available_input_choice, useful_data_1, useful_data_2, available_start_choice
from aiogram.fsm.context import FSMContext
from botAx.other_functions import check_digits
import requests
import time

router = Router()


@router.message(UsersChoice.input_choosing, F.text == None)
async def geo_handler(message: Message, state: FSMContext):
    await choose_cords(message, state)


@router.message(UsersChoice.input_choosing, F.text == available_input_choice[1])
async def choose_cords(message: Message, state: FSMContext):
    if available_input_choice[1] == message.text:
        await state.set_state(UsersChoice.choose_cords_writing)
        await message.answer(
            text="Хорошо👍! Теперь необходимо заполнить анкету для получения данных о возможной будущей"
                 " загруженности района. Введите данные и координаты от которых в радиусе 385 метров создаться "
                 f"виртуальная застройка\n\nВот анкета для заполнения необходимых данных:\n{useful_data_1}")
        return
    await state.set_state(UsersChoice.cords_writing)
    cords = (message.location.latitude, message.location.longitude)
    await state.update_data(cords=cords)
    await message.answer(
        text="Отлично👍! Координаты получены, теперь в радиусе 385 метров от вас создана виртуальная застройка"
             " для которой необходимо внести дополнительные данные для получения данных о возмужной будущей"
             f" загруженности.\n\nВот анкета для заполнения необходимых данных:\n{useful_data_2}")


@router.message(UsersChoice.cords_writing, F.text != 'Вернуться🔙')
async def data_confirm(message: Message, state: FSMContext):
    text = message.text.split('\n')
    if len(text) != 8 or not check_digits(text) or [i for i in text if float(i) < 0]:
        await message.answer(
            text=f"Данные введены неверно🚫!\nПопробуйте еще раз в точности по списку:\n{useful_data_2}")
        return
    data = await state.get_data()
    response = requests.post('http://172.16.18.126:8000/info',
                             json={"count_houses": text[0], "no_living_square": text[3], "apartments": text[1],
                                   "block_of_flats": text[2], "coordinates": [data['cords'][0], data['cords'][1]],
                                   "neeres_stations": [
                                       {'name': 'station', 'passengerflow_mornind': text[4],
                                        'passengerflow_evening': text[4], 'capacity': text[6]}], 'roads': [
                                     {'transport_in_hour': text[7],
                                      'rush_hour': round(int(text[4]) / int(text[7]), 1) * 10, 'max_load': text[7]}],
                                   'road_location': [1]}).json()

    await message.answer(text='Все получилось✅!\nОжидайте обработки⏳')
    time.sleep(2)
    await message.answer(text=f'Результатыℹ️:\n1)Для общественного транспорта:\n'
                              f'    - увеличение пассажиропотока на {round(response[0][0][0][0], 5)} тыс. чел./час\n'
                              f'    - заполненость станций - {round(response[0][0][0][1] * 100, 5)}%\n'
                              f'    - увеличение заполнености станций - {round(response[0][0][0][2] * 100, 5)}%\n'

                              f'2)Для дорог:\n'
                              f'    - увеличение количества транспортных средств на {round(response[1][0][0], 5)} т.с.\n'
                              f'    - баллы пробок - {round(response[1][0][1], 0)} баллов\n'
                              f'    - увелечение баллов пробок на {round(response[1][0][2], 0)} баллов',
                         reply_markup=make_keyboard_row(available_start_choice))

    await state.clear()
    await state.set_state(UsersChoice.start_choosing)


@router.message(UsersChoice.choose_cords_writing, F.text != 'Вернуться🔙')
async def choose_data_confirm(message: Message, state: FSMContext):
    text = message.text.split('\n')

    if (len(text) != 10 or not check_digits(text) or [i for i in text if float(i) < 0]
            or not -90 <= float(text[0]) <= 90 or not -180 <= float(text[1]) <= 180):
        await message.answer(
            text=f"Данные введены неверно🚫!\nПопробуйте еще раз в точности по списку:\n{useful_data_1}")
        return
    text = list(map(lambda x: float(x), text))
    response = requests.post('http://172.16.18.126:8000/info',
                             json={"count_houses": text[2], "no_living_square": text[5], "apartments": text[3],
                                   "block_of_flats": text[4], "coordinates": [text[0], text[1]], "neeres_stations": [
                                     {'name': 'station', 'passengerflow_mornind': text[7],
                                      'passengerflow_evening': text[7], 'capacity': text[8]}], 'roads': [
                                     {'transport_in_hour': text[6],
                                      'rush_hour': round(text[6] / text[9], 1) * 10, 'max_load': text[9]}],
                                   'road_location': [1]}).json()

    await message.answer(text='Все получилось✅!\nОжидайте обработки⏳')

    time.sleep(2)
    await message.answer(text=f'Результатыℹ️:\n1)Для общественного транспорта:\n'
                              f'    - увеличение пассажиропотока на {round(response[0][0][0][0], 5)} тыс. чел./час\n'
                              f'    - заполненость станций - {round(response[0][0][0][1] * 100, 5)}%\n'
                              f'    - увеличение заполнености станций - {round(response[0][0][0][2] * 100, 5)}%\n'

                              f'2)Для дорог:\n'
                              f'    - увеличение количества транспортных средств на {round(response[1][0][0], 5)} т.с.\n'
                              f'    - баллы пробок - {round(response[1][0][1], 0)} баллов\n'
                              f'    - увелечение баллов пробок на {round(response[1][0][2], 0)} баллов',
                         reply_markup=make_keyboard_row(available_start_choice))
    await state.clear()
    await state.set_state(UsersChoice.start_choosing)


@router.message(UsersChoice.choose_cords_writing, F.text != 'Вернуться🔙')
async def choose_data_wrong(message: Message, state: FSMContext):
    await state.update_data(chosen_cords=message.text.lower())
    await message.answer(
        text="Не получилось🚫! Попробуйте выбрать способ поделиться координатами на клавиатуре еще раз🔄",
        reply_markup=row_keyboard_with_come_back(available_input_choice))
