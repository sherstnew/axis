from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, ReplyKeyboardRemove
from botAx.keyboards.start_keyboard import kb_start

router = Router()


@router.message(Command("start"))
async def cmd_start(message: Message):
    await message.answer(
        "Привет🤚, я бот и я помогу тебе",
        reply_markup=kb_start()
    )
