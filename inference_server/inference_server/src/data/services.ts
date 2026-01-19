export interface HeroService {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export const heroServices: HeroService[] = [
  { id: 'software', label: 'Software Development', href: '#' },
  { id: 'cloud', label: 'Cloud Solution', href: '#' },
  { id: 'it', label: 'It Solution', href: '#' },
  { id: 'analytics', label: 'Data Analytics', href: '#' },
  { id: 'technology', label: 'Technology', href: '#' },
  { id: 'security', label: 'Cyber Security', href: '#' },
  { id: 'consulting', label: 'Consulting Services', href: '#' }
] as const;
