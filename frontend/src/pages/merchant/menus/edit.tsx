import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuForm } from '@/components/merchant/menu-form';
import { ArrowLeft } from 'lucide-react';
import { useMerchantMenuDetail, useUpdateMenu } from '@/hooks/use-merchant-menus';

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

export function EditMenuPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const menuId = id || '';

  const { data: menu, isLoading } = useMerchantMenuDetail(menuId);
  const updateMenuMutation = useUpdateMenu(menuId);

  const handleSubmit = (formData: FormData) => {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      isAvailable: formData.get('isAvailable') === 'true',
    };

    updateMenuMutation.mutate(data, {
      onSuccess: () => {
        navigate('/merchant/menus');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Menu not found</p>
        <Link to="/merchant/menus">
          <Button variant="link">Back to Menus</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Link to="/merchant/menus">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Menu</h1>
          <p className="text-muted-foreground">Update menu details</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MenuForm
          menu={menu}
          onSubmit={handleSubmit}
          isSubmitting={updateMenuMutation.isPending}
        />
      </motion.div>
    </motion.div>
  );
}
