import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Smartphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/restaurants', label: t('nav.restaurants') },
    { href: '/orders', label: t('nav.orders') },
    { href: '/about', label: t('nav.about') },
  ];

  const supportLinks = [
    { href: '/help', label: t('nav.help') },
    { href: '/faq', label: t('footer.faq') },
    { href: '/contact', label: t('footer.contactUs') },
    { href: '/partner', label: t('footer.partner') },
  ];

  const legalLinks = [
    { href: '/terms', label: t('footer.termsOfService') },
    { href: '/privacy', label: t('footer.privacyPolicy') },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <span className="text-2xl">🍕</span>
              </motion.div>
              <span className="font-bold text-2xl">
                Food<span className="text-primary">Go</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {t('footer.tagline')}
            </p>
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <Input placeholder="Enter your email" className="bg-background" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download & Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.download')}</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="mr-2 h-4 w-4" />
                Download iOS App
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="mr-2 h-4 w-4" />
                Download Android App
              </Button>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold text-lg mb-4">{t('footer.followUs')}</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
