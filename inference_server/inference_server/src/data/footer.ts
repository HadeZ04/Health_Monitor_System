export interface FooterService {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface FooterLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface FooterContactInfo {
  readonly id: string;
  readonly icon: string;
  readonly href: string;
  readonly text: string;
}

export interface FooterSocialLink {
  readonly id: string;
  readonly href: string;
}

export const footerServices: FooterService[] = [
  { id: 'cloud-computing', label: 'Cloud Computing Solution', href: '#' },
  { id: 'cybersecurity', label: 'Cybersecurity & Compliance', href: '#' },
  { id: 'software-dev', label: 'Software Development', href: '#' },
  { id: 'it-consulting', label: 'It Consulting & Support', href: '#' }
] as const;

export const footerLinks: FooterLink[] = [
  { id: 'about', label: 'About Us', href: '#' },
  { id: 'services', label: 'Our Services', href: '#' },
  { id: 'blog', label: 'Blog & News', href: '#' },
  { id: 'contact', label: 'Contact Us', href: '#' }
] as const;

export const footerContactInfo: FooterContactInfo[] = [
  { id: 'phone1', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon1.png", href: 'tel://0500222333', text: '0500 222 333' },
  { id: 'phone2', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon2.png", href: 'tel://0356588547', text: '03 5658 8547' },
  { id: 'email', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon3.png", href: 'mailto://admin@techxen.org', text: 'admin@techxen.org' },
  { id: 'website', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon4.png", href: 'https://www.techxen.org', text: 'www.techxen.org' }
] as const;

export const footerSocialLinks: FooterSocialLink[] = [
  { id: 'social1', href: '#' },
  { id: 'social2', href: '#' },
  { id: 'social3', href: '#' },
  { id: 'social4', href: '#' }
] as const;
