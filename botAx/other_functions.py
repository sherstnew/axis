def check_digits(data):
    try:
        answer = [i for i in data if float(i)]
    except Exception:
        return False
    return answer