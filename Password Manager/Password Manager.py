import base64

import cryptography.exceptions
from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

'''def write_key():
    key = Fernet.generate_key()
    with open("key.key", "wb") as key_file:
        key_file.write(key)'''


def load_key():
    file = open("key.key", "rb")
    key = file.read()
    file.close()
    return key


def derive_key(master_pwd: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return base64.urlsafe_b64encode(kdf.derive(master_pwd.encode()))


master_pwd = str(input("What is the master password: "))

salt = load_key()
key = derive_key(master_pwd, salt)
fer = Fernet(key)


def view():
    try:
        with open('passwords.txt', 'r') as file:
            for line in file.readlines():
                data = line.rstrip()
                user, password = data.split("|")
                print(f"User: {user} | Password:{fer.decrypt(password.encode()).decode('utf-8')}")
    except Exception as e:
        print("Invalid master Password")


def add():
    username = input("What is your acc name: ")
    password = input("What is your password: ")

    with open('passwords.txt', 'a') as file:  # lets you open a file without having to manually close it (with keyword)
        file.write(f"{username}|{fer.encrypt(password.encode()).decode()}\n")


mode = input("Would you like to add a new password or view existing one?(view, add)? To quit press q : ").lower()
while True:

    if mode == "q":
        break
    if mode == "view":
        view()
    elif mode == "add":
        add()
    else:
        print("Invalid mode")

    mode = input("Would you like to add a new password or view existing one?(view, add)? To quit press q :  ").lower()
