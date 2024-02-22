from environment import get_server_path
import os

server_path = get_server_path()


def files_path():
    path_to_files = os.path.normpath(os.path.join(server_path, "files")) + os.sep
    return path_to_files


def session_dir_path():
    path_to_sessions = os.path.normpath(os.path.join(server_path, "Sessions")) + os.sep
    return path_to_sessions


def files_download_path():
    path_to_sessions = os.path.normpath(os.path.join(server_path, "Download")) + os.sep
    return path_to_sessions
