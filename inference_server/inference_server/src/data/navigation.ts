export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface MobileMenuItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly hasSubmenu?: boolean;
  readonly submenu?: MobileMenuItem[];
}

export interface ContactInfo {
  readonly id: string;
  readonly icon: string;
  readonly href: string;
  readonly text: string;
}

export interface SocialLink {
  readonly id: string;
  readonly href: string;
}

export const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'about', label: 'About', href: '#' },
  { id: 'service', label: 'Service', href: '#' },
  { id: 'pages', label: 'Pages', href: '#' },
  { id: 'blog', label: 'Blog', href: '#' },
  { id: 'project', label: 'Project', href: '#' },
  { id: 'login', label: 'Login', href: '#auth-login' },
  { id: 'register', label: 'Register', href: '#auth-register' }
] as const;

export const mobileMenuItems: MobileMenuItem[] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'about', label: 'About Us', href: '#' },
  { id: 'service', label: 'Service', href: '#' },
  { id: 'pages', label: 'Pages', href: '#' },
  { id: 'blog', label: 'Blog', href: '#' },
  { id: 'project', label: 'Project', href: '#' },
  { id: 'login', label: 'Login', href: '#auth-login' },
  { id: 'register', label: 'Register', href: '#auth-register' }
] as const;

export const contactInfo: ContactInfo[] = [
  { id: 'phone1', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon1.png", href: 'tel://0500222333', text: '0500 222 333' },
  { id: 'phone2', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon2.png", href: 'tel://0356588547', text: '03 5658 8547' },
  { id: 'email', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon3.png", href: 'mailto://admin@techxen.org', text: 'admin@techxen.org' },
  { id: 'website', icon: "https://techxen.vercel.app/assets/img/icon/footer1-icon4.png", href: 'https://www.techxen.org', text: 'www.techxen.org' }
] as const;

export const socialLinks: SocialLink[] = [
  { id: 'social1', href: '#' },
  { id: 'social2', href: '#' },
  { id: 'social3', href: '#' },
  { id: 'social4', href: '#' }
] as const;
