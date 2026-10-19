import { config, isTestnet } from '@/lib/config';

/**
 * Names the Stellar network the app is built for, so nobody mistakes a demo
 * deployment for real money.
 *
 * Derived from the single `isTestnet` helper in `config.ts`; the network
 * value comes from the same build-time config the wallet and contracts use,
 * so the badge can never disagree with where transactions are signed.
 */
export function NetworkBadge() {
  const label = isTestnet
    ? config.network === 'futurenet'
      ? 'Futurenet'
      : 'Testnet'
    : 'Mainnet';

  const styles = isTestnet
    ? 'bg-amber-50 text-amber-800 ring-amber-200'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-200';

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
      title={
        isTestnet
          ? 'Testnet: no real funds. Contract ids and demo USDC are test only.'
          : 'Stellar public network: transactions move real funds.'
      }
    >
      {label}
    </span>
  );
}
