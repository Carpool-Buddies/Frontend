import os

IS_PRODUCTION = True


def is_production():
    return IS_PRODUCTION


def get_server_path():
    return "/Server" if IS_PRODUCTION else os.path.dirname(os.path.abspath(__file__))
