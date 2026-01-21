import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuForm } from '@/components/merchant/menu-form';
import { useCreateMenu } from '@/hooks/use-merchant-menus';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function NewMenuPage() {
  const navigate = useNavigate();
  const createMenuMutation = useCreateMenu();

  const handleSubmit = (formData: FormData) => {
    createMenuMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/merchant/menus');
      },
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Create New Menu</h1>
        <p className="text-muted-foreground">Add a new item to your menu</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MenuForm onSubmit={handleSubmit} isSubmitting={createMenuMutation.isPending} />
      </motion.div>
    </motion.div>
  );
}
