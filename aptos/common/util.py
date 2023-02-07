import re
import uuid
import binascii
from hashlib import sha256


def primary_key_of_collection(chain, creator, name) -> str:
    msg = ''
    if not chain:
        msg = f'{creator}::{name}'.encode('utf-8')
    else:
        msg = f'{chain}::{creator}::{name}'.encode('utf-8')
    return sha256(msg).hexdigest()


def primary_key_of_token(chain, creator, collection, name) -> str:
    msg = ''
    if not chain:
        msg = f'{creator}::{collection}::{name}'.encode('utf-8')
    else:
        msg = f'{chain}::{creator}::{collection}::{name}'.encode('utf-8')
    return sha256(msg).hexdigest()


def new_uuid() -> str:
    return uuid.uuid1().hex


def new_uuid_hex_bytes() -> bytes:
    id = uuid.uuid1()
    return binascii.unhexlify(id.hex)


def unhex_decode(data: str) -> str:
    return binascii.unhexlify(re.sub(r'^0x', '', data)).decode()


def flatten(lists):
    return [item for sublist in lists for item in sublist]
