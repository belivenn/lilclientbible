import {
    Connection,
    Keypair,
    SystemProgram,
    PublicKey,
    Commitment,
  } from "@solana/web3.js";
  import { Program, Wallet, AnchorProvider, Address } from "@coral-xyz/anchor";
  import { WbaVault, IDL } from "../../programs/wba_vault";
  import {wallet} from "../../env.json";
  /// J8qKEmQpadFeBuXAVseH8GNrvsyBhMT8MHSVD3enRgJz
  
  // Import our keypair from the wallet file
  const keypair = Keypair.fromSecretKey(new Uint8Array(wallet.secretKey));
  
  // Commitment
  const commitment: Commitment = "confirmed";
  
  // Create a devnet connection
  const connection = new Connection("https://api.devnet.solana.com");
  
  // Create our anchor provider
  const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment,
  });
  
  // Create our program BLwzEcX8xskaPVuvrukaNkmY9624YedqBh19H5LdRoQB
  const program = new Program<WbaVault>(
    IDL,
    "BLwzEcX8xskaPVuvrukaNkmY9624YedqBh19H5LdRoQB" as Address,
    provider,
  );
  
  // Create a random keypair
  const vaultState = Keypair.generate();
  console.log(`Vault public key: ${vaultState.publicKey.toBase58()}`);
  
  // Create the PDA for our enrollment account
  // Seeds are "auth", vaultState
  const vaultAuth = PublicKey.findProgramAddressSync([Buffer.from("auth"), vaultState.publicKey.toBuffer()], program.programId)[0];
  
  // Create the vault key
  // Seeds are "vault", vaultAuth
  const vault = PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultAuth.toBuffer()], program.programId)[0];
  
  // Execute our enrollment transaction
  (async () => {
    try {
        const signature = await program.methods.initialize()
        .accounts({
            owner: keypair.publicKey,
            vaultState: vaultState.publicKey,
            vaultAuth: vaultAuth,
            vault: vault,
            systemProgram: SystemProgram.programId
            
        }).signers([keypair, vaultState]).rpc();
      console.log(`Init success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
      console.error(`Oops, something went wrong: ${e}`);
    }
  })();