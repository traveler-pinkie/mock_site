import json
import hashlib

domain_data = input("Enter the websites domain: ")
password_data = input("Enter the password: ")

hasher = hashlib.sha256()

encoded_password = password_data.encode('utf-8')

hasher.update(encoded_password)

hex_digest = hasher.hexdigest()



output = f"Domain: {domain_data}, Password: {hex_digest}\n"
with open("data.json", "a") as file:
    json.dump(output, file)