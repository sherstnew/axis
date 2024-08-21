from aiogram import Bot, Dispatcher
from config_reader import config
from handlers import start_handler

bot = Bot(token=config.bot_token.get_secret_value())
dp = Dispatcher()
dp.include_routers(start_handler.router)
