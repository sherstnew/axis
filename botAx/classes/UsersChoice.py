from aiogram.fsm.state import State, StatesGroup

class UsersChoice(StatesGroup):
    start_choosing = State()
    output_choosing = State()
    input_choosing = State()
    choose_cords_writing = State()
    cords_writing = State()

