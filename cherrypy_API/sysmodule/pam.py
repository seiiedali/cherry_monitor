import pamela

# add user function
def user_login(username, password):
    try:
    # executing useradd command using subprocess module
        pamela.authenticate(username, password)
        return True
    except:
        return False

