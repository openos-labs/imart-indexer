import re
import uuid
import binascii
from hashlib import sha256


def primary_key_of_collection(creator, name) -> str:
    return sha256(f'{creator}::{name}'.encode('utf-8')).hexdigest()


def primary_key_of_token(creator, collection, name) -> str:
    return sha256(f'{creator}::{collection}::{name}'.encode('utf-8')).hexdigest()


def new_uuid() -> str:
    return uuid.uuid1().hex


def new_uuid_hex_bytes() -> bytes:
    id = uuid.uuid1()
    return binascii.unhexlify(id.hex)


def unhex_decode(data: str) -> str:
    return binascii.unhexlify(re.sub(r'^0x', '', data)).decode()


def flatten(lists):
    return [item for sublist in lists for item in sublist]
