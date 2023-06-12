import type { Metadata } from 'next';
import { getVault } from '~/screens/VaultScreen';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await getVault(params.slug);
  return { title: name };
}

export { VaultScreen as default } from '~/screens/VaultScreen';
