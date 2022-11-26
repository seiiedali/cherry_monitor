import pamela


# add user function


def user_login(username: str, password: str) -> bool:
    """evaluate given entries to verify the user in the host system

    Args:
        username (str): entered username
        password (str): entered password

    Returns:
        bool: return True if the the specified user
        authenticates and false if it doesn't
    """
    try:
        # executing useradd command using subprocess module
        pamela.authenticate(username, password)
        return True
    except:
        return False
