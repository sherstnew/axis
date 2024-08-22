import numpy as np
import matplotlib.pyplot as plt
import datetime


def draw_circular_graph():
    # Запрос Ане
    data = np.array([1, 2, 6, 9, 4, 3, 12])

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

    fig, ax = plt.subplots()
    ax.pie(data, labels=np.array(weekend), autopct='%1.1f%%',
           wedgeprops={'lw':1, 'ls':'--','edgecolor':"k"}, rotatelabels=True)
    ax.axis('equal')
    plt.savefig('image.png')
