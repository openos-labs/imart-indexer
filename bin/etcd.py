from etcd import etcd3

tokenId = "9a7b78644236a22aa8f12f711b83b62c6197df925bea2a9c7bd040887f4a0e8e"
if __name__ == "__main__":
    etcd = etcd3.client(host='etcd-host-01', port=2379)
    etcd.delete(f"cache:imart:aptosToken:id:{tokenId}")
    etcd.delete(f"cache:imart:aptosOrder:id:{tokenId}")
