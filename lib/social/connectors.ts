export type SocialPlatform = 'facebook' | 'instagram' | 'messenger' | 'tiktok' | 'youtube' | 'whatsapp' | 'linkedin' | 'telegram' | 'pinterest';

export type SocialConnector = {
  platform: SocialPlatform;
  status: 'adapter-ready' | 'credentials-required' | 'approval-required';
  capabilities: Array<'publish' | 'draft' | 'comments' | 'messages' | 'analytics'>;
  note: string;
};

export const socialConnectors: SocialConnector[] = [
  { platform: 'facebook', status: 'credentials-required', capabilities: ['publish', 'comments', 'analytics'], note: 'Meta app, OAuth et permissions officielles requis.' },
  { platform: 'instagram', status: 'credentials-required', capabilities: ['publish', 'comments', 'messages', 'analytics'], note: 'Compte professionnel/créateur et permissions Meta requises selon la fonction.' },
  { platform: 'messenger', status: 'credentials-required', capabilities: ['messages'], note: 'Connexion Meta officielle requise.' },
  { platform: 'tiktok', status: 'approval-required', capabilities: ['publish', 'draft', 'analytics'], note: 'Application TikTok et scopes/approbations requis selon les APIs utilisées.' },
  { platform: 'youtube', status: 'credentials-required', capabilities: ['publish', 'analytics'], note: 'OAuth Google/YouTube requis.' },
  { platform: 'whatsapp', status: 'credentials-required', capabilities: ['messages', 'analytics'], note: 'WhatsApp Business Platform requis.' },
  { platform: 'linkedin', status: 'credentials-required', capabilities: ['publish', 'analytics'], note: 'OAuth et permissions LinkedIn requises.' },
  { platform: 'telegram', status: 'credentials-required', capabilities: ['publish', 'messages', 'analytics'], note: 'Bot/API Telegram requis.' },
  { platform: 'pinterest', status: 'credentials-required', capabilities: ['publish', 'analytics'], note: 'OAuth Pinterest requis.' },
];

export type SocialContentInput = { title: string; description: string; price?: number; currency?: string; location?: string; url: string };

export function buildSocialContent(input: SocialContentInput, platform: SocialPlatform) {
  const price = input.price == null ? '' : `\n💰 ${new Intl.NumberFormat('fr-DZ').format(input.price)} ${input.currency ?? 'DZD'}`;
  const location = input.location ? `\n📍 ${input.location}` : '';
  const cta = `\n👉 Voir sur WinsWi : ${input.url}`;
  if (platform === 'tiktok') return `${input.title}${location}${price}\nDécouvrez cette opportunité sur WinsWi.\n#WinsWi #BonPlan${cta}`;
  if (platform === 'instagram') return `${input.title}${location}${price}\n✨ Une opportunité sélectionnée par WinsWi.\n#WinsWi #Opportunite #Algerie${cta}`;
  return `${input.title}${location}${price}\n\n${input.description.slice(0, 700)}${cta}`;
}
