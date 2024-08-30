module resource_account::demo_test {

    use aptos_framework::account::SignerCapability;
    use aptos_framework::object;
    use aptos_framework::resource_account;

    const MY_SEED: vector<u8> = b"my-seed";

    struct ResourceCap has key {
        signer_cap: SignerCapability
    }

    fun init_module(resource_account: &signer) {
        let signer_cap = resource_account::retrieve_resource_account_cap(resource_account, @publisher);
        move_to(resource_account, ResourceCap {
            signer_cap
        });
        create_object(resource_account);
    }

    fun create_object(resource_account: &signer) {
        // Create an object, and it'll just hang out
        object::create_named_object(resource_account, MY_SEED);
    }
}
