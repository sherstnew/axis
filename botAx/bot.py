from aiogram import Bot, Dispatcher
from config_reader import config
from handlers import start_handler, output_handler, input_handler, default_handler

bot = Bot(token=config.bot_token.get_secret_value())
dp = Dispatcher()
dp.include_routers(start_handler.router, output_handler.router, input_handler.router, default_handler.router)
