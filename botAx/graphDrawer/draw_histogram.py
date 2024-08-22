import numpy as np
import matplotlib.pyplot as plt
import datetime


def draw_histogram():
    # Запрос Ане
    data = np.array([1, 2, 6, 0, 4, 3, 12])

    plt.clf()
    days = [datetime.date.today() - datetime.timedelta(days=i) for i in range(7, 0, -1)]
    weekend = []

    for i in days:
        if i.month < 10 and i.day < 10:
            weekend.append('0' + str(i.month) + '.0' + str(i.day))
        elif i.day < 10:
            weekend.append(str(i.month) + '.0' + str(i.day))
        elif i.month < 10:
            weekend.append('0' + str(i.month) + '.' + str(i.day))
        else:
            weekend.append(str(i.month) + '.' + str(i.day))

    plt.bar(np.array(weekend), data)
    plt.title('Данные за 7 дней')
    plt.xlabel("День", fontsize=12, fontweight='bold')
    plt.ylabel("Количество запросов", fontsize=12, fontweight='bold')
    plt.gcf().set_facecolor('gray')
    plt.yticks(np.arange(min(data), max(data) + 1, 1.0))
    plt.savefig('image.png')
