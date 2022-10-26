import re
import uuid
import binascii


def new_uuid_hex_bytes() -> bytes:
    id = uuid.uuid1()
    return binascii.unhexlify(id.hex)


def unhex_decode(data: str) -> str:
    return binascii.unhexlify(re.sub(r'^0x', '', data)).decode()
