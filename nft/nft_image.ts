import { wallet } from "../../env.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

(async () => {
    let keypair = await umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet.secretKey));
    console.log(`${keypair.publicKey}`);
    const signer = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(signer));

    try {
        const content = await readFile("generug.png")
        const image = createGenericFile(content, "generug.png", {contentType:"image/png"})

        const [myUri] = await bundlrUploader.upload([image]);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();