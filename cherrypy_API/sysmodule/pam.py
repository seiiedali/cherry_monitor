import pamela

# add user function
def user_login(username, password):
    try:
    # executing useradd command using subprocess module
        mm = pamela.authenticate(username, password)
        print(mm)
        return True
    except:
        return False
