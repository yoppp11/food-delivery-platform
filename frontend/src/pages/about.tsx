import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Truck, 
  Heart, 
  Shield, 
  Users, 
  Clock,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
    },
  },
};

export function AboutPage() {
  useTranslation();

  const values = [
    {
      icon: Utensils,
      title: 'Quality Food',
      description: 'We partner with the best restaurants to ensure every meal meets our high quality standards.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Our efficient delivery network ensures your food arrives hot and fresh in 30 minutes or less.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to make every order perfect.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'From contactless delivery to secure payments, your safety and privacy are guaranteed.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Partner Restaurants' },
    { value: '50,000+', label: 'Orders Delivered' },
    { value: '10+', label: 'Cities Served' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-primary">FoodGo</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're on a mission to transform how you experience food delivery. 
              Connecting you with the best local restaurants, delivered right to your doorstep.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2023, FoodGo started with a simple idea: make delicious food from 
                local restaurants accessible to everyone. What began as a small team with big 
                dreams has grown into a platform serving thousands of customers daily.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that good food brings people together. That's why we work tirelessly 
                to connect our customers with the best restaurants in their area, ensuring every 
                meal is a memorable experience.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we're proud to partner with hundreds of restaurants and have a dedicated 
                team of drivers who share our passion for delivering happiness, one meal at a time.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop"
                alt="Team cooking"
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">Since 2023</p>
                <p className="text-sm opacity-90">Delivering happiness</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To make food delivery simple, fast, and enjoyable for everyone. We strive to 
                    support local restaurants while providing our customers with an exceptional 
                    dining experience from the comfort of their homes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the leading food delivery platform in Indonesia, known for our 
                    reliability, quality, and commitment to customer satisfaction. We envision 
                    a future where everyone has access to great food, delivered with care.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do, from how we treat our partners 
              to how we serve our customers.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full text-center hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="h-14 w-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center"
                    >
                      <value.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm md:text-base opacity-90">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Reach out to us 
              through any of the channels below.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground text-sm">support@foodgo.com</p>
                  <p className="text-muted-foreground text-sm">hello@foodgo.com</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground text-sm">+62 21 1234 5678</p>
                  <p className="text-muted-foreground text-sm">Mon - Fri, 9am - 6pm</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm">Jl. Sudirman No. 123</p>
                  <p className="text-muted-foreground text-sm">Jakarta, Indonesia</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
