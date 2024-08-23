import numpy as np
import matplotlib.pyplot as plt
import requests



def draw_linear_graph():
    response = requests.get('http://172.16.18.126:8000/using_of_week').json()

    y = np.array([1, 2, 6, 9, 4, 3, 12])

    plt.clf()
    x = np.array([i for i in range(len(y))])
    plt.grid()
    plt.gcf().set_facecolor('gray')
    plt.plot(x, y, markerfacecolor='r', color='r', marker='o')
    plt.xlabel('День', fontsize=12, fontweight='bold')
    plt.ylabel('Количество запросов', fontsize=12, fontweight='bold')
    plt.xticks(np.arange(min(x), max(x) + 1, 1.0))
    plt.yticks(np.arange(min(y), max(y) + 1, 1.0))
    plt.savefig('image.png')
